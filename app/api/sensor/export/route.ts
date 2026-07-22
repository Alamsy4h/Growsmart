import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { sensordata } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Menggunakan model 'sensordata' sesuai dengan schema.prisma
    const data: sensordata[] = await prisma.sensordata.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const header = "No,Tanggal,Jam,Temperature (°C),Humidity (%),Soil Moisture (%)";

    // Berikan tipe eksplisit (item: sensordata) pada parameter map
    const rows = data.map((item: sensordata, i: number) => {
      const date = new Date(item.createdAt);
      const tanggal = date.toLocaleDateString("id-ID");
      const jam = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      return `${i + 1},${tanggal},${jam},${item.temperature},${item.humidity},${item.soilMoisture}`;
    });

    const csv = [header, ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="growsmart-laporan-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export CSV Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal export data" },
      { status: 500 }
    );
  }
}