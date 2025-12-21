import Usuarios from "../components/Usuarios";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Usuarios />
    </AdminLayout>
  );
}
