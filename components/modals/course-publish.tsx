import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CoursePublishModalProps {
  children: React.ReactNode;
  isPublished?: boolean; // Изменение на необязательное свойство
}

export const CoursePublishModal = ({ children, isPublished = false }: CoursePublishModalProps) => {
  const statusText = isPublished ? 'опубликована' : 'скрыта';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Лекция {statusText}</AlertDialogTitle>
          <AlertDialogDescription>
            Теперь эта лекция {isPublished ? 'будет' : 'не будет'} видна студентам.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ОК</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};