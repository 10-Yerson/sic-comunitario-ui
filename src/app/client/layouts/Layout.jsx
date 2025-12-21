import UserPanel from "../components/Dasboard/siderbar/index";
import ProtectedRoute from "@/protected/ProtectedRoute";

export default function Layout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="flex">
        <UserPanel />
        <div className="w-full md:ml-40 ml-0">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
