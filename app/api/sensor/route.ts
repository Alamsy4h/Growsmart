import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { temperature, humidity, soilMoisture, plantId } = await req.json();

    if (!temperature || !humidity || !soilMoisture || !plantId) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const data = await prisma.sensorData.create({
      data: { temperature, humidity, soilMoisture, plantId },
    });

    // Cek threshold, kalau soilMoisture di bawah threshold → buat log otomatis
    const config = await prisma.config.findFirst();
    if (config && soilMoisture < config.soilThreshold) {
      await prisma.log.create({
        data: {
          type: "watering",
          title: "Penyiraman Otomatis",
          message: `Kelembapan ${soilMoisture}%. Pompa aktif karena di bawah threshold ${config.soilThreshold}%.`,
        },
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Sensor error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// GET — ambil data sensor terbaru untuk dashboard
export async function GET() {
  try {
    const latest = await prisma.sensorData.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: latest });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}