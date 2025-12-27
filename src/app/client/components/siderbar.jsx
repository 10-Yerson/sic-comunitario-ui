'use client'

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from '@/utils/axios';

import { HiHome } from "react-icons/hi";
import { RiCalendarEventFill, RiLogoutCircleRLine } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";


export default function UserPanel() {

  const router = useRouter();
  const pathname = usePathname();

  const NavItem = ({ href, Icon, label }) => {
    const isActive = pathname === href;

    return (
      <li className="mt-3 p-2 rounded-lg">
        <a
          href={href}
          className={`relative flex flex-col items-center pb-1 transition-all duration-300 
          ${isActive ? "border-b-2 border-black" : "hover:text-blue-600 dark:hover:text-blue-300"}`}
        >
          <Icon className="h-5 w-5" />
          <span className="text-xs mt-2 tracking-wide">{label}</span>
        </a>
      </li>
    );
  };

 const NavItems = ({ href, Icon, onClick }) => {
  const isActive = pathname === href;

  return (
    <li className="p-2 text-black">
      {onClick ? (
        <button
          onClick={onClick}
          className={`relative flex flex-col items-center pb-3`}
        >
          <Icon className="h-5 w-5 text-black" />
        </button>
      ) : (
        <a
          href={href}
          className={`relative flex flex-col items-center pb-3 
          ${isActive ? "border-b-2 border-black" : ""}`}
        >
          <Icon className="h-5 w-5 text-black" />
        </a>
      )}
    </li>
  );
};


    const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      router.push('/');
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex-1">

      <nav className="w-full hidden md:flex md:w-40 md:flex-col md:items-center justify-around bg-white py-4 fixed md:top-0 md:left-0 md:h-screen">

        <ul className="flex md:flex-col md:mt-2 text-black capitalize space-x-4 md:space-x-0">
          <NavItem href="/client" Icon={HiHome} label="Home" />
          <NavItem href="/client/event" Icon={RiCalendarEventFill} label="Evento" />
          <NavItem href="/client/gestion" Icon={MdDashboard} label="gestion" />
          {/* <NavItem href="/client/notifications" Icon={IoNotifications} label="Notificaciones" /> */}
          <NavItem href="/client/perfil" Icon={FaUserCircle} label="Perfil" />
        </ul>

        <div className="mt-auto flex items-center space-x-3 p-3 rounded-full">
          <FiLogOut onClick={handleLogout}
          className="h-7 w-7" />
        </div>
      </nav>

      <nav className="w-full flex justify-around p-3 fixed bottom-0 md:hidden z-50 bg-white">
        <ul className="flex justify-around w-full capitalize">
          <NavItems href="/client/event" Icon={RiCalendarEventFill} />
          <NavItems href="/client/gestion" Icon={MdDashboard} />
          <NavItems href="/client" Icon={HiHome} />
          <NavItems href="/client/perfil" Icon={FaUserCircle} />
          <NavItems Icon={RiLogoutCircleRLine} onClick={handleLogout} />
        </ul>
      </nav>

    </div>
  );
}
