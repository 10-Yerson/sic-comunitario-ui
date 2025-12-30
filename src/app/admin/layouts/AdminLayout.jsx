import ProtectedRoute from "@/protected/ProtectedRoute";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex min-h-screen">
        <Sidebar />
        
        <div className="
          w-full 
          lg:ml-72 
          min-h-screen
          pt-16 lg:pt-0
          lg:px-0
        ">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}