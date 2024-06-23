import Mux from "@mux/mux-node";

 import { auth } from "@clerk/nextjs";
 import { NextResponse } from "next/server";

 import { db } from "@/lib/db";

 const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);


export async function DELETE(
  req: Request,
  { params }: { params: { labsId: string; chapterId: string } }
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
      return new NextResponse("Нет прав", { status: 401 });
    }

    const chapter = await db.chapterLabs.findUnique({
      where: {
        id: params.chapterId,
        labsId: params.labsId,
      },
    });

    if (!chapter) {
      return new NextResponse("Не найдено", { status: 404 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const deletedChapter = await db.chapterLabs.delete({
      where: {
        id: params.chapterId,
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

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}



export async function PATCH(
  req: Request,
  { params }: { params: { labsId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Вы не авторизаванны", { status: 401 });
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

    const chapter = await db.chapterLabs.update({
      where: {
        id: params.chapterId,
        labsId: params.labsId,
      },
      data: {
        ...values,
      },
    });


    // Видео MUX
    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }


    return NextResponse.json(chapter);

  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}