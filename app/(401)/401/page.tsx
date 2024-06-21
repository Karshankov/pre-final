import { UserButton } from '@clerk/nextjs';
import React from 'react';

const Custom401Page: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      <div className="absolute top-4 right-4">
        <div className=" font-medium py-2 px-4 rounded-md text-sm">
          <UserButton/>
        </div>
      </div>
      <h1 className="text-5xl font-bold mb-6">Ошибка 401</h1>
      <p className="text-xl mb-10">Ожидайте подтверждения учетной записи преподавателем</p>
      <div className="flex items-center justify-center">
        <img src="/401.png" alt="Ошибка 401" className="w-[500px] h-auto" />
      </div>
      <p className="text-xl mt-10">Для обновления данных обновите веб-страницу</p>
    </div>
  );
};

export default Custom401Page;