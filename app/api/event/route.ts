import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PAKSA NEXT.JS MENGEKSEKUSI API INI SECARA DINAMIS (SAAT RUNTIME)
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { type, title, message } = await req.json();

    if (!type || !title || !message) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const log = await prisma.log.create({
      data: { type, title, message },
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error("Event error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}