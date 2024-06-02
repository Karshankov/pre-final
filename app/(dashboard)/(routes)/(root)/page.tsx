import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesListHome from "./_components/list";
import { UserButton, auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "./_components/info-card";

export default async function Dashboard() {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="В процессе"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Прочитанно"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
       <CoursesListHome items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}