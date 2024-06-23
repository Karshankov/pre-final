import Mux from "@mux/mux-node"
import { auth } from "@clerk/nextjs";
import { error } from "console";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";


const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);


export async function DELETE(
  req: Request,
  { params }: { params: { labsId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Не авторизованный", { status: 401 });
    }
    const lab = await db.labs.findUnique({
      where: {
        id: params.labsId,
        userId,
      },
      include: {
        chapters: {
          
        },
      },
    });

    if (!lab) {
      return new NextResponse("Не найдено", { status: 404 });
    }

    // for (const chapter of course.chapters) {
    //   if (chapter.muxData) {
    //     await Video.Assets.del(chapter.muxData.assetId);
    //   }
    // }
    const deletedCourse = await db.labs.delete({
      where: {
        id: params.labsId,
      },
    });
    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[LAB_ID_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}


export async function PATCH(
    req: Request,
    { params }: {params:{ labsId: string }}
) {
    try{
        const {userId} = auth();
        const  {labsId} = params;
        const values = await req.json();

        if(!userId){
            return new NextResponse("Не авторизованны", {status: 401})
        }

        const lab = await db.labs.update({
            where: {
              id: labsId,
              userId
            },
            data: {
              ...values,
            }
          });

          return NextResponse.json(lab);
    } catch (error) {
        console.log("[LAB_ID]", error)
        return  new NextResponse("Internal Error", {status: 500} )
    }
}