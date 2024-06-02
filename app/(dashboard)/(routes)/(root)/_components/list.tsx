import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

const CoursesListHome = ({ items }: CoursesListProps) => {
  const filteredItems = items.filter((item) => item.progress !== null && item.progress > 0);

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters?.length!}
            progress={item.progress}
            category={item?.category?.name!}
          />
        ))}
      </div>
      {filteredItems.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          Лекции не найдены
        </div>
      )}
    </div>
  );
};

export default CoursesListHome;