import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { labsId: string } }
) {
  try {
    const { userId } = auth();
    const { labsId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const labs = await db.labs.findUnique({
      where: {
        id: labsId,
        userId,
      },
      include: {
        chapters: {

        },
      },
    });

    if (!labs) {
      return new NextResponse("Not found", { status: 404 });
    }

    const hasPublishedChapters = labs.chapters.some(
      (chapter) => chapter.isPublished
    );
    if (
      !labs.title ||
      !labs.description ||
      !labs.imageUrl ||
      !hasPublishedChapters
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedCourse = await db.labs.update({
      where: {
        id: labsId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}