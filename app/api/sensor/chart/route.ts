import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { sensordata } from "@prisma/client";

export async function GET() {
  try {
    const since = new Date();
    since.setHours(since.getHours() - 24);

    const data: sensordata[] = await prisma.sensordata.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
    });

    const grouped: Record<string, { total: number; count: number }> = {};

    data.forEach((item: sensordata) => {
      const hour = item.createdAt.getHours();
      const slot = Math.floor(hour / 2) * 2;
      const key = `${String(slot).padStart(2, "0")}:00`;
      if (!grouped[key]) grouped[key] = { total: 0, count: 0 };
      grouped[key].total += item.soilMoisture;
      grouped[key].count += 1;
    });

    const chartData = Object.entries(grouped).map(([time, val]) => ({
      time,
      soilMoisture: Math.round(val.total / val.count),
    }));

    return NextResponse.json({ success: true, data: chartData });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}