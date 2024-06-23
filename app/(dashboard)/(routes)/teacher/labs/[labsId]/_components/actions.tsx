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
    labsId: string;
    isPublished: boolean;
  }

export const Actions = ({
    disabled,
    labsId,
    isPublished,
}: ActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
          setIsLoading(true);
    
          if (isPublished) {
            await axios.patch(`/api/labs/${labsId}/unpublish`);
            toast.success("Работа скрыта");
          } else {
            await axios.patch(`/api/labs/${labsId}/publish`);
            toast.success("Работа опубликована");

          }
    
          router.refresh();
        } catch {
          toast.error("Ошибка публикации работы");
        } finally {
          setIsLoading(false);
        }
      };

    const onDelete = async() =>{
        try{
            setIsLoading(true);

            await axios.delete(`/api/labs/${labsId}`);

            toast.success("Работа удалена");
            router.refresh();
            router.push(`/teacher/labs`);
        }catch{
            toast.error("Ошибка удаления работы");
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