import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET — load semua logs
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  const logs = await prisma.log.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, logs });
}

// DELETE — clear semua logs
export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  await prisma.log.deleteMany();

  return NextResponse.json({ success: true, message: "Semua log dihapus" });
}