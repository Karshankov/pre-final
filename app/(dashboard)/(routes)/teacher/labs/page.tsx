import { auth } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { DataTable } from './_components/data-tabble';
import { columns } from './_components/columns';
import { db } from "@/lib/db";

const CoursesPage = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const labs = await db.labs.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={labs} />
    </div>
  );
};

export default CoursesPage;
