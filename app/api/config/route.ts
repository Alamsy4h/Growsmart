import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// PAKSA NEXT.JS MENGEKSEKUSI API INI SECARA DINAMIS SAAT RUNTIME
export const dynamic = "force-dynamic";

// GET — Load Config
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let config = await prisma.config.findFirst();

    if (!config) {
      config = await prisma.config.create({
        data: { 
          soilThreshold: 30, 
          manualWatering: false,
          updatedAt: new Date() // Diperlukan sesuai schema.prisma
        },
      });
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("GET /api/config error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat konfigurasi" },
      { status: 500 }
    );
  }
}

// POST — Save Config
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { soilThreshold, manualWatering } = await req.json();

    let config = await prisma.config.findFirst();

    if (!config) {
      config = await prisma.config.create({
        data: { 
          soilThreshold: Number(soilThreshold) || 30, 
          manualWatering: Boolean(manualWatering),
          updatedAt: new Date()
        },
      });
    } else {
      config = await prisma.config.update({
        where: { id: config.id },
        data: { 
          soilThreshold: Number(soilThreshold) || config.soilThreshold, 
          manualWatering: typeof manualWatering === "boolean" ? manualWatering : config.manualWatering,
          updatedAt: new Date()
        },
      });
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("POST /api/config error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan konfigurasi" },
      { status: 500 }
    );
  }
}