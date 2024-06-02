"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";


interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
};

const formSchema = z.object({
    description: z.string().min(1, {
    message: "Введите описание",
  }),
});

export const DescriptionForm = ({
  initialData,
  courseId
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""

    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Лекция обновлена!");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Что то пошло не так");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Описание лекции
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Назад</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Изменить описание
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
            "text-sm mt-2",
            !initialData.description && "text-red-600 italic"
        )}>
          {initialData.description || "Нет описания"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Например: 'Что такое двоичная система и как ей пользоваться."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Сохранить
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}