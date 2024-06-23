import { Labs } from "@prisma/client";
import { getProgress } from "./get-progress";
import { db } from "@/lib/db";

type LabsWithProgressWithCategory = Labs & {
  chapters: { id: string }[];
  progress: number | null;
};

type GetLabs = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getLabs = async ({
  userId,
  title,
  categoryId,
}: GetLabs): Promise<LabsWithProgressWithCategory[]> => {
  try {
    const labs = await db.labs.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const labsWithProgress: LabsWithProgressWithCategory[] =
      await Promise.all(
        labs.map(async (lab) => {
          const progressPercentage = await getProgress(userId, lab.id);
          return {
            ...lab,
            progress: progressPercentage,
          };
        })
      );
    return labsWithProgress;
  } catch (error) {
    console.log("Ошибка получения лекций ", error);
    return [];
  }
};