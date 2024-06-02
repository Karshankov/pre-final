'use client';
import { useForm } from 'react-hook-form';

import * as z from 'zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Требуется заголовок',
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/courses', values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success('Лекция создана!');
    } catch {
      toast.error('Что-то пошло не так');
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Название лекции</h1>
        <p className="text-sm text-slate-600">
          Название лекции. Вы сможете изменить это позже.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название лекции</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="пример: 'Двоичная система счисления'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>О чем эта лекция?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Назад
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Продолжить
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
