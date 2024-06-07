import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";
import { ConvexClientProvider } from "@/components/providers/convex-provider";

const NotionLayout = ({ children }: { children: React.ReactNode }) => {
  
  const { userId } = auth();
 if (!userId) {
  return redirect("/");
}


  return (
    <ConvexClientProvider>
    <div className="h-full flex">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
    </ConvexClientProvider>
  );
};

export default NotionLayout;
