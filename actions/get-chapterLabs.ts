import { db } from "@/lib/db";
import { Attachment, AttachmentLabs, Chapter, ChapterLabs } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  labsId: string;
  chapterId: string;
  videoUrl: string | null;
}

export const getChapter = async ({
  userId,
  labsId,
  chapterId,
  videoUrl
}: GetChapterProps) => {
  try {
    const labs = await db.labs.findUnique({
      where: {
        isPublished: true,
        id: labsId,
      },
    });

    const chapter = await db.chapterLabs.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });
    const videoUrl = await db.chapterLabs.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
        videoUrl: chapterId,
      },
    });

    if (!chapter || !labs) {
      throw new Error("Chapter or course not found");
    }

    let muxData = null;
    let attachments: AttachmentLabs[] = [];
    let nextChapter: ChapterLabs | null = null;

    attachments = await db.attachmentLabs.findMany({
        where: {
          labsId: labsId,
        },
      });
      
    

      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        },
      });

      nextChapter = await db.chapterLabs.findFirst({
        where: {
          labsId: labsId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      labs,
      muxData,
      attachments,
      nextChapter,
      userProgress,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      labs: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
    };
  }
};