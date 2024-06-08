"use client";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner"

const NotionPage = () => {

const {user} = useUser();
const create = useMutation(api.documents.create);

const onCreate = () => {
    const promise = create({ title: "Без названия" })

    toast.promise(promise, {
        loading: "Создание новой заметки...",
        success: "Новая заметка создана!",
        error: "Не удалось создать заметку",
    });
};

    return ( 
        <div className="h-full flex flex-col items-center justify-center space-y-4">
             <Image
             src="/note.png"
             height="300"
             width="300"
             alt="NoteBook Image"
             className=""
            />
            <h2 className="text-lg font-medium">
                Добро пожаловать, {user?.firstName}
            </h2>
            <Button onClick={onCreate}>
                <PlusCircle className="w-4 h-4 mr-2"/>
                Создать заметку
            </Button>
        </div>
 );
}
 
export default NotionPage;