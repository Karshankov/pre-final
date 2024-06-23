"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";


interface ChapterActionsProps {
    disabled: boolean;
    labsId: string;
    chapterId: string;
    isPublished: boolean;
  }

export const ChapterActions = ({
    disabled,
    labsId,
    chapterId,
    isPublished,
}: ChapterActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
          setIsLoading(true);
    
          if (isPublished) {
            await axios.patch(
              `/api/labs/${labsId}/chapters/${chapterId}/unpublish`
            );
            toast.success("Задание скрыта");
          } else {
            await axios.patch(
              `/api/labs/${labsId}/chapters/${chapterId}/publish`
            );
            toast.success("Задание опубликована");
          }
    
          router.refresh();
        } catch {
          toast.error("Ошибка публикации задания");
        } finally {
          setIsLoading(false);
        }
      };

    const onDelete = async() =>{
        try{
            setIsLoading(true);

            await axios.delete(`/api/labs/${labsId}/chapters/${chapterId}`);

            toast.success("Задание удалена");
            router.refresh();
            router.push(`/teacher/labs/${labsId}`);
        }catch{
            toast.error("Ошибка удаления задания");
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
           <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
            {isPublished ? "Скрыть" : "Опубликовать"}
          </Button>

            <ConfirmModal onConfirm={onDelete}>
            <Button size="sm" disabled={isLoading}>
              <Trash className="h-4 w-4 " />
            </Button>
            </ConfirmModal>
        </div>
      );
}