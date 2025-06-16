
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <SearchBar />
        <main className="mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
