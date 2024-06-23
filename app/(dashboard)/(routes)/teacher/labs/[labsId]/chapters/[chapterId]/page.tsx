import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import Banner from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";
const ChapterIdPage = async({
    params
}:{
    params: { labsId: string, chapterId: string }
}) => {
    const { userId } = auth();
    if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapterLabs.findUnique({
    where: {
      id: params.chapterId,
      labsId: params.labsId,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    // chapter.videoUrl
];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);




    return ( 
   <>
   {!chapter.isPublished && (
    <Banner 
    variant="warning"
    label="Эта работа не опубликована. Она не будет видна в лекции"
    />
   )}
    <div className="p-6">
        <div className="flex items-center justify-between">
        <div className="w-full">
        <Link
        href={`/teacher/labs/${params.labsId}`}
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Вернуться к настройке практической работы
        </Link>
        <div className="flex items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Создание задания</h1>
                <span className="text-sm text-slate-700">
                  Заполните все поля {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                labsId={params.labsId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
        </div>   
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
            <div>
            <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard}/>
                <h2 className="text-xl">
                   Заполнение задания 
                </h2>
            </div>
            <ChapterTitleForm 
            initialData={chapter}
            labsId={params.labsId}
            chapterId={params.chapterId}
            />
            <ChapterDescriptionForm 
            initialData={chapter}
            labsId={params.labsId}
            chapterId={params.chapterId}
            />
            </div>
        </div>

        <div>
        <div className="flex items-center gap-x-2">
            <IconBadge icon={Video}/>
            <h2 className="text-xl">
                Добавить видео
            </h2>
        </div>
        <ChapterVideoForm 
        initialData={chapter}
        labsId={params.labsId}
        chapterId={params.chapterId}
        />

        </div>
        </div>
    </div> 
  </>
);
}
 
export default ChapterIdPage;