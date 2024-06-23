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
    const course = await db.labs.findUnique({
      where: {
        id: labsId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedCourse = await db.labs.update({
      where: {
        id: labsId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.log("[LAB_ID_UNPUBLISH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}