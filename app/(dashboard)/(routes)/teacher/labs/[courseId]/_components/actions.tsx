"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { CoursePublishModal } from "@/components/modals/course-publish";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
  }

export const Actions = ({
    disabled,
    courseId,
    isPublished,
}: ActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
          setIsLoading(true);
    
          if (isPublished) {
            await axios.patch(
              `/api/courses/${courseId}/unpublish`
            );
            toast.success("Лекция скрыта");
          } else {
            await axios.patch(
              `/api/courses/${courseId}/publish`
            );
            toast.success("Лекция опубликована");

          }
    
          router.refresh();
        } catch {
          toast.error("Ошибка публикации главы");
        } finally {
          setIsLoading(false);
        }
      };

    const onDelete = async() =>{
        try{
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}`);

            toast.success("Лекция удалена");
            router.refresh();
            router.push(`/teacher/courses`);
        }catch{
            toast.error("Ошибка удаления главы");
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
           <CoursePublishModal  isPublished={isPublished}>
           <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
            {isPublished ? "Скрыть" : "Опубликовать"}
          </Button>
          </CoursePublishModal>

            <ConfirmModal onConfirm={onDelete}>
            <Button size="sm" disabled={isLoading}>
              <Trash className="h-4 w-4 " />
            </Button>
            </ConfirmModal>
        </div>
      );
}