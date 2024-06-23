import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function DELETE(
  req: Request, 
  { params }:{ params: {labsId: string, attachmentId: string } } 
) {
    try{
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Не авторизованный", {status: 401} )
        }

        const courseOwner = await db.labs.findUnique({
            where:{
                id: params.labsId,
                userId: userId,
            }
        })

        if (!courseOwner) {
            return new NextResponse("Нет доступа", {status: 401} )
        }


        const attachment = await db.attachmentLabs.delete({
            where:{
                labsId: params.labsId,
                id: params.attachmentId
            }
        });

        return NextResponse.json(attachment);
    }catch(error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}