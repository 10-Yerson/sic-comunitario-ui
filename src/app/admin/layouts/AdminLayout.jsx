import ProtectedRoute from "@/protected/ProtectedRoute";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 w-full">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
