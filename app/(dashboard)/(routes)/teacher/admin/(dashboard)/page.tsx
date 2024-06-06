// pages/users.tsx
import React from 'react';
import UserTable from './UserTable';
// import UserTable from './UserTable';


const UsersPage: React.FC = () => {
  return (
    <div className='p-4'>
      <UserTable />
    </div>
  );
};

export default UsersPage;