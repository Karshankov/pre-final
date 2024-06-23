"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AttachmentLabs, Labs } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Labs & {attachments: AttachmentLabs[]}
  labsId: string;
};

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  labsId
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/labs/${labsId}/attachments`, values);
      toast.success("Работа обновлена");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Что то пошло не так");
    }
  }

  const onDelete = async (id: string) =>{
    try{
      setDeletingId(id);
      await axios.delete(`/api/labs/${labsId}/attachments/${id}`);
      toast.success("Вложение удалено");
      router.refresh();
    } catch{
      toast.error("Ошибка удаления");
    }finally{
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Вложения работы
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Назад</>
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Добавить файл
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
             Нет вложений
            </p>
          )}
          {initialData.attachments.length > 0 &&(
            <div className="space-y-2">
              {initialData.attachments.map((attachment) =>(
                <div
                key={attachment.id}
                className="flex items-center p-3 w-full bg-sky-100
                 border-sky-200 text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                  <p className="text-xs line-clamp-1">
                    {attachment.name}
                  </p>
                  {deletingId === attachment.id &&(
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin"/>
                    </div>
                  )}
                  {deletingId !== attachment.id &&(
                    <button
                    onClick={() => onDelete(attachment.id)}
                    className="ml-auto hover:opacity-75"
                    >
                      <X className="h-4 w-4 text-red-700"/>
                    </button>
                  )}
                </div>
              ) )}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Вложения, которые могут понадобится при выполнении работы&#40;например: примеры&#41; 
          </div>
        </div>
      )}
    </div>
  )
}