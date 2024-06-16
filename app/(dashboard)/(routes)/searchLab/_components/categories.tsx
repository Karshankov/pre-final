"use client";

import { Category } from "@prisma/client";

// ИКОНКИ!!!
import{
    FcEngineering,
    FcFilmReel,
    FcSettings,
    FcCalculator

} from "react-icons/fc"
import { FaComputer } from "react-icons/fa6";
import { GoFileBinary } from "react-icons/go";
import { IconType } from "react-icons/lib";
import CategoryItem from "./category-items";

interface CategoriesProps {
    items: Category[];
}
//Иконки!!!
const iconMap : Record<Category["name"], IconType> = {
    "Раздел 1" : FcSettings,
    "Раздел 2" : FcSettings,
    "Раздел 3" : FcCalculator,
    "Раздел 4" : FaComputer,
    "Раздел 5" : GoFileBinary,
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
  