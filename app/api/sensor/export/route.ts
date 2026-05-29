import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.sensorData.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    const header = "No,Tanggal,Jam,Temperature (°C),Humidity (%),Soil Moisture (%)";

    const rows = data.map((item, i) => {
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
    return NextResponse.json(
      { success: false, message: "Gagal export data" },
      { status: 500 }
    );
  }
}