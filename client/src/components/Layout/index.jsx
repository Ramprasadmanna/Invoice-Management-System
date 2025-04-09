import Header from '@components/Header';
import SideBar from '@components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className='relative grid max-h-screen min-h-screen grid-cols-1 grid-rows-[auto_1fr] overflow-hidden bg-slate-100 md:grid-cols-[auto_1fr]'>
      <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <Header setShowSidebar={setShowSidebar} />
      <Outlet />
    </div>
  );
};

export default Layout;
