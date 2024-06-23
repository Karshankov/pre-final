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

    const unpublishedChapter = await db.chapterLabs.update({
      where: {
        id: params.chapterId,
        labsId: params.labsId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChaptersInCourse = await db.chapterLabs.findMany({
      where: {
        labsId: params.labsId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.labs.update({
        where: {
          id: params.labsId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}