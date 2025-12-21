'use client'

import React from "react";
import { usePathname } from "next/navigation";

import { HiHome } from "react-icons/hi";
import { RiMessage3Fill, RiSearchFill } from "react-icons/ri";
import { MdVideoLibrary } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

export default function UserPanel() {

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

  const NavItems = ({ href, Icon }) => {
    const isActive = pathname === href;

    return (
      <li className="p-2 text-black">
        <a
          href={href}
          className={`relative flex flex-col items-center pb-3 
          ${isActive ? "border-b-2 border-black" : ""}`}
        >
          <Icon className="h-5 w-5 text-black" />
        </a>
      </li>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex-1">

      {/* Sidebar escritorio */}
      <nav className="w-full hidden md:flex md:w-40 md:flex-col md:items-center justify-around bg-white py-4 fixed md:top-0 md:left-0 md:h-screen">

        <ul className="flex md:flex-col md:mt-2 text-black capitalize space-x-4 md:space-x-0">
          <NavItem href="/client" Icon={HiHome} label="Home" />
          <NavItem href="/client/messages" Icon={RiMessage3Fill} label="Mensajes" />
          <NavItem href="/client/search" Icon={RiSearchFill} label="Buscar" />
          <NavItem href="/client/videos" Icon={MdVideoLibrary} label="Videos" />
          <NavItem href="/client/notifications" Icon={IoNotifications} label="Notificaciones" />
          <NavItem href="/client/profile" Icon={FaUserCircle} label="Perfil" />
        </ul>

        <div className="mt-auto flex items-center space-x-3 p-3 rounded-full">
          <BsThreeDots className="h-7 w-7" />
        </div>
      </nav>

      <nav className="w-full flex justify-around p-3 fixed bottom-0 md:hidden z-50 bg-white">
        <ul className="flex justify-around w-full capitalize">
          <NavItems href="/client/messages" Icon={RiMessage3Fill} />
          <NavItems href="/client/search" Icon={RiSearchFill} />
          <NavItems href="/client" Icon={HiHome} />
          <NavItems href="/client/notifications" Icon={IoNotifications} />
          <NavItems href="/client/profile" Icon={FaUserCircle} />
        </ul>
      </nav>

    </div>
  );
}
