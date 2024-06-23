import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { chapterId: string; labsId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Вы не авторизованны", { status: 401 });
    }
    const ownCourse = await db.labs.findUnique({
      where: {
        id: params.labsId,
        userId,
      },
    });
    if (!ownCourse) {
      return new NextResponse("Нет доступа", { status: 401 });
    }
    const chapter = await db.chapterLabs.findUnique({
      where: {
        id: params.chapterId,
        labsId: params.labsId,
      },
    });
    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
    });

    if (
      !chapter ||
      !chapter.title ||
      !chapter.description 
    ) {
      return new NextResponse("Отсутствуют обязательные поля", { status: 400 });
    }
    const publishedChapter = await db.chapterLabs.update({
      where: {
        id: params.chapterId,
        labsId: params.labsId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}