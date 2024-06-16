import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";


import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string, videoUrl: string | null };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
    videoUrl :params.videoUrl
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const completeOnEnd = !userProgress?.isCompleted;
  let videoUrl = chapter.videoUrl

    return ( 
    <div>
      {userProgress?.isCompleted &&(
        <Banner 
        label="Вы уже прочли эту главу"
        variant="success"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        
      {videoUrl && (
  <div className="p-4">
    <div className="relative aspect-video"> 
      <iframe
        width="100%"
        height="100%"
        src={videoUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  </div>
)}

        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
        <>
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    download={attachment}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
      </div>
    </div> 
    </div>
    );


};

export default ChapterIdPage;