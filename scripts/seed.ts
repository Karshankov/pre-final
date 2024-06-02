// Создание(добавление) возможных опций(тем разделов) лекций в бд
const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
    try{

        await database.category.createMany({
            data: [
                {name: "Раздел 1"},
                {name: "Раздел 2"},
                {name: "Раздел 3"},
                {name: "Раздел 4"},
                {name: "Раздел 5"}, 
            ]
        });
        console.log("Успешно!");
    }catch(error){
        console.log("Ошибка добавления категорий в бд", error)
    }finally{
        await database.$disconnect();
    }
}

main();