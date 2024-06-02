"use client";

import { Category } from "@prisma/client";

// ИКОНКИ!!!
import{
    FcEngineering,
    FcFilmReel,

} from "react-icons/fc"
import { IconType } from "react-icons/lib";
import CategoryItem from "./category-items";

interface CategoriesProps {
    items: Category[];
}
//Иконки!!!
const iconMap : Record<Category["name"], IconType> = {
    "Раздел 1" : FcEngineering,
    "Раздел 2" : FcFilmReel,
    "Раздел 3" : FcEngineering,
    "Раздел 4" : FcFilmReel,
    "Раздел 5" : FcEngineering,
}

export const Categories = ({ items }: CategoriesProps) => {
    return (
      <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item) => (
          <CategoryItem
            key={item.id}
            label={item.name}
            icon={iconMap[item.name]}
            value={item.id}
          />
        ))}
      </div>
    );
  };
  