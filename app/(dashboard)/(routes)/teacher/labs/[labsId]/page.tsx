import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { IconBadge } from "@/components/icon-badge";
import { File, FileUp, FolderPen, LayoutDashboard, ListChecks } from 'lucide-react';

//импорт форм
import { TitleForm } from './_components/title-form';
import { DescriptionForm } from './_components/description-form';
import { ImageForm } from './_components/image-form';
import { AttachmentForm } from './_components/attachment-form';
import { ChapterForm } from './_components/chapters-form';
import Banner from '@/components/banner';
import { Actions } from './_components/actions';

const LabsIdPage = async ({
   params 
  }: {
     params: { labsId: string }
}) => {
  const { userId }  = auth();

  if(!userId) {
    return redirect('/');
  }
  
  const labs = await db.labs.findUnique({
    where: {
      id: params.labsId,
      userId
    },
    include:{
      chapters:{
        orderBy:{
          position:"asc"
        }
      },
      attachments:{
        orderBy:{
          createdAt: "desc"
        }
      }
    }
  });
  

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  console.log(categories);

  if(!labs) {
    return redirect('/');
  }
// обязательные поля
  const requiredFields =[ 
    labs.title,
    labs.description,
    labs.imageUrl,
    labs.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length; //кол во обязатьельных полей
  const completedFields = requiredFields.filter(Boolean).length;
  
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
    {!labs.isPublished &&(
      <Banner 
      label="Эта работа не опубликована. Она не будет видна студентам"
      />
    )}
    <div className='p-6'>
      {/* Id лекции: {params.courseId} */}
     
      <div  className='flex items-center justify-between'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-2xl font-medium'>
            Настройка практической работы
          </h1>
          <span className='text-sm  text-slate-700'>
            Заполните все поля  {completionText}
          </span>
        </div>

       <Actions 
        disabled={!isComplete}
        labsId={params.labsId}
        isPublished={labs.isPublished}
       />

      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div>
          <div className='flex items-center gap-x-2'>
          <IconBadge icon={FolderPen}/>
            <h2 className='text-xl'>
              Редактирование практической работы
            </h2>
          </div>
          <TitleForm
              initialData={labs}
              labsId={labs.id}
            />
            <DescriptionForm
              initialData={labs}
              labsId={labs.id}
            />
            <ImageForm
              initialData={labs}
              labsId={labs.id}
            />
        </div>

        <div className='space-y-6'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={ListChecks} />
              <h2 className='text-xl'>
                Задания
              </h2>
            </div>

            <ChapterForm
              initialData={labs}
              labsId={labs.id}
            />

          </div>
          
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={FileUp} />
              <h2 className='text-xl'>
                Ресурсы и вложения
              </h2>
            </div>
            <AttachmentForm
              initialData={labs}
              labsId={labs.id}
            />
          </div>
          
        </div>      

      </div>
    </div>
    </>
  );
};

export default LabsIdPage;
