import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// =========================================================================
// 1. POST — Menerima data dari ESP32 (DHT22 + PIR + Soil Moisture)
// =========================================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Pengecekan typeof yang ketat agar angka 0 tidak dianggap undefined
    const temperature = typeof body.temperature === 'number' ? body.temperature : undefined;
    const humidity = typeof body.humidity === 'number' ? body.humidity : undefined;
    const motionDetected = body.motionDetected !== undefined ? Boolean(body.motionDetected) : false;
    const soilMoisture = typeof body.soilMoisture === 'number' ? body.soilMoisture : 0;
      
    let plantId = body.plantId ? parseInt(body.plantId) : 1;

    if (temperature === undefined || humidity === undefined) {
      return NextResponse.json(
        { success: false, message: "Format payload sensor tidak valid atau kosong" },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------------------
    // CEK ATAU BUAT DATA PLANT (Menggunakan model 'plant')
    // ---------------------------------------------------------------------
    let existingPlant = await prisma.plant.findUnique({
      where: { id: plantId }
    });

    if (!existingPlant) {
      existingPlant = await prisma.plant.create({
        data: { 
          id: plantId, 
          name: "Tanaman Greenhouse", 
          type: "Tomat"
        }
      });
    }

    // ---------------------------------------------------------------------
    // SIMPAN KE DATABASE (Menggunakan model 'sensordata')
    // ---------------------------------------------------------------------
    const data = await prisma.sensordata.create({
      data: { 
        temperature, 
        humidity, 
        soilMoisture, 
        motionDetected,
        plantId: existingPlant.id
      },
    });

    // --- LOGIKA OTOMATISASI PENYIRAMAN BERDASARKAN THRESHOLD ---
    const config = await prisma.config.findFirst();
    if (config) {
      if (soilMoisture < config.soilThreshold) {
        if (!config.manualWatering) {
          await prisma.log.create({
            data: {
              type: "watering",
              title: "Penyiraman Otomatis Aktif",
              message: `Kelembapan tanah berada di angka ${soilMoisture}%. Pompa air diaktifkan otomatis (Threshold: ${config.soilThreshold}%).`,
            },
          });
          
          await prisma.config.update({
            where: { id: config.id },
            data: { 
              manualWatering: true,
              updatedAt: new Date()
            }
          });
        }
      } else if (soilMoisture >= config.soilThreshold && config.manualWatering) {
        await prisma.log.create({
          data: {
            type: "watering",
            title: "Penyiraman Otomatis Selesai",
            message: `Kelembapan tanah mencapai ${soilMoisture}%. Kondisi ideal terpenuhi, pompa dinonaktifkan.`,
          },
        });

        await prisma.config.update({
          where: { id: config.id },
          data: { 
            manualWatering: false,
            updatedAt: new Date()
          }
        });
      }
    }

    // --- LOGIKA SECURITY LOG DENGAN COOLDOWN 60 DETIK ---
    if (motionDetected) {
      const cooldownTime = new Date(Date.now() - 60 * 1000);

      const recentLog = await prisma.log.findFirst({
        where: {
          type: "security",
          createdAt: {
            gte: cooldownTime,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!recentLog) {
        await prisma.log.create({
          data: {
            type: "security",
            title: "Pergerakan Terdeteksi",
            message: "Sensor PIR mendeteksi adanya aktivitas pergerakan di dalam area Greenhouse.",
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Data berhasil disimpan", data });
  } catch (error) {
    console.error("Sensor POST error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server saat menyimpan data" },
      { status: 500 }
    );
  }
}

// =========================================================================
// 2. GET — Menyuplai data lengkap ke Dashboard secara Real-time
// =========================================================================
export async function GET() {
  try {
    // Memanggil model 'sensordata' (huruf kecil semua sesuai schema.prisma)
    const latest = await prisma.sensordata.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json({
        success: true,
        data: {
          temperature: 0,
          air_humidity: 0,
          soil_moisture: 0,
          motion_detected: false,
          pump_status: "OFF",
          avg_temperature: "0.0"
        }
      });
    }

    const config = await prisma.config.findFirst();
    const pumpStatus = config?.manualWatering ? "ON" : "OFF";

    return NextResponse.json({ 
      success: true, 
      data: {
        temperature: latest.temperature,
        air_humidity: latest.humidity,
        soil_moisture: latest.soilMoisture, 
        motion_detected: latest.motionDetected, 
        pump_status: pumpStatus,
        avg_temperature: typeof latest.temperature === 'number' ? latest.temperature.toFixed(1) : "0.0"
      }
    });
  } catch (error) {
    console.error("Sensor GET error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server saat memuat dashboard" },
      { status: 500 }
    );
  }
}