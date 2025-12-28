import UserPanel from "../components/siderbar";
import ProtectedRoute from "@/protected/ProtectedRoute";

export default function Layout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="flex">
        <UserPanel />
        <div className="w-full md:ml-64 ml-0 pb-20 md:pb-0">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
