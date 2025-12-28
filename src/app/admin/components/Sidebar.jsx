'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiUsers, FiFileText, FiHome, FiLogOut, FiClipboard, FiUserPlus, FiUser, FiPlusCircle, FiShield } from "react-icons/fi";
import axios from '@/utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      toast.success('¡Sesión cerrada exitosamente!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error('Error al cerrar sesión', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const menuSections = [
    {
      title: "Principal",
      items: [
        { href: "/admin", icon: FiHome, text: "Dashboard" },
      ]
    },
    {
      title: "Gestión de Usuarios",
      items: [
        { href: "/admin/users", icon: FiUsers, text: "Habitantes" },
        { href: "/admin/upload", icon: FiUserPlus, text: "Cargar Usuarios" },
        { href: "/admin/colaborador", icon: FiPlusCircle, text: "Agregar Colaborador" },
      ]
    },
    {
      title: "Administración",
      items: [
        { href: "/admin/secret", icon: FiClipboard, text: "Equipo de Gestión" },
        { href: "/admin/event", icon: FiFileText, text: "Eventos Comunitarios" },
        { href: "/admin/admins", icon: FiShield, text: "Administradores" },
      ]
    },
    {
      title: "Cuenta",
      items: [
        { href: "/admin/profile", icon: FiUser, text: "Mi Perfil" },
        { href: "#", icon: FiLogOut, text: "Cerrar Sesión", isLogout: true },
      ]
    }
  ];

  return (
    <>
      <div className="w-72 h-screen bg-[#FCFEFD] text-gray-900 fixed shadow-2xl border-r border-gray-200 flex flex-col">
        <div className="flex-1 px-4 py-6">
          {menuSections.map((section, index) => (
            <div key={index} className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  item.isLogout ? (
                    <li key={itemIndex}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 w-full rounded-lg transition-all duration-300 hover:bg-red-50 hover:text-red-600 text-left"
                      >
                        <item.icon size={20} className="transition-transform" />
                        <span className="font-medium text-sm">{item.text}</span>
                      </button>
                    </li>
                  ) : (
                    <SidebarItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      text={item.text}
                      active={pathname === item.href}
                    />
                  )
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Container con diseño personalizado */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
    </>
  );
}

function SidebarItem({ href, icon: Icon, text, active }) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
          active ? "bg-[#31DCB7] text-white" : "hover:bg-[#5060BC] hover:text-white"
        }`}
      >
        <Icon size={20} className={`${active ? "" : "group-hover:scale-110"} transition-transform`} />
        <span className="font-medium text-sm">{text}</span>
      </Link>
    </li>
  );
}