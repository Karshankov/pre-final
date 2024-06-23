import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { labsId: string } }
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Не авторизованны", { status: 401 });
    }

    const courseOwner = await db.labs.findUnique({
      where: {
        id: params.labsId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Нет доступа", { status: 401 });
    }

    const lastChapter = await db.chapterLabs.findFirst({
      where: {
        labsId: params.labsId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;
    const chapter = await db.chapterLabs.create({
      data: {
        title,
        labsId: params.labsId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}