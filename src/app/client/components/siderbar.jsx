'use client'

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from '@/utils/axios';

import { HiHome } from "react-icons/hi";
import { RiCalendarEventFill, RiLogoutCircleRLine } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import { Home, CalendarPlus, LayoutDashboard, UserCircle, LogOut } from 'lucide-react';


export default function UserPanel() {
  const router = useRouter();
  const pathname = usePathname();

  const NavItem = ({ href, Icon, label }) => {
    const isActive = pathname === href;

    return (
      <li className="mb-2">
        <a
          href={href}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
            ${isActive
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
            }`}
        >
          <Icon className={`h-6 w-6 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
          <span className="font-medium text-sm">{label}</span>
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
            className="relative flex flex-col items-center pb-3"
          >
            <Icon className="h-6 w-6 text-black" />
          </button>
        ) : (
          <a
            href={href}
            className={`relative flex flex-col items-center pb-3 
            ${isActive ? "border-b-2 border-black" : ""}`}
          >
            <Icon className="h-6 w-6 text-black" />
          </a>
        )}
      </li>
    );
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      router.push('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 flex-1">
        {/* Menu Desktop */}
        <nav className="w-full hidden md:flex md:w-64 md:flex-col bg-white fixed md:top-0 md:left-0 md:h-screen shadow-xl border-r border-gray-200 z-50">

          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SIC</h1>
                <p className="text-xs text-gray-500">Sistema Integral</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
              Menú Principal
            </p>
            <ul className="space-y-1">
              <NavItem href="/client" Icon={HiHome} label="Inicio" />
              <NavItem href="/client/event" Icon={RiCalendarEventFill} label="Crear Evento" />
              <NavItem href="/client/gestion" Icon={MdDashboard} label="Gestión Evento" />
              <NavItem href="/client/perfil" Icon={FaUserCircle} label="Perfil" />
            </ul>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
            >
              <FiLogOut className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </nav>



        {/* Menu Mobile */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white border-t border-gray-100 shadow-2xl">
          <ul className="flex items-center justify-around px-2 py-2">
            {[
              { href: '/client', Icon: Home, label: 'Inicio' },
              { href: '/client/event', Icon: CalendarPlus, label: 'Crear' },
              { href: '/client/gestion', Icon: LayoutDashboard, label: 'Gestión' },
              { href: '/client/perfil', Icon: UserCircle, label: 'Perfil' },
            ].map(({ href, Icon, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <a href={href} className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${isActive ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-110' : 'text-gray-400'}`}>
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </a>
                </li>
              );
            })}

            <li>
              <button onClick={handleLogout} className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                  <LogOut size={20} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-semibold text-red-400">Salir</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}