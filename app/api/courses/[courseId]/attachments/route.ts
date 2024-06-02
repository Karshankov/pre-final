import { auth } from '@clerk/nextjs';
import { error } from 'console';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(
    req: Request,
    { params }:{ params : {courseId: string}}
) {
    try {
        const { userId } = auth();
        const { url } = await req.json();

        if(!userId){
            return new NextResponse("Не авторизованный", {status: 401} )
        }

        const courseOwner = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId: userId,
            }
        })

        if (!courseOwner) {
            return new NextResponse("Нет доступа", {status: 401} )
        }

        const attachment = await db.attachment.create({
            data:{
               url,
               name: url.split("/").pop(),
               courseId: params.courseId,
            }
        })

        return NextResponse.json(attachment);
    }catch(error){
        console.log("COURSE_ID_ATTACHEMETS", error)
        return new NextResponse("Internal Error", { status: 500})
    }
}