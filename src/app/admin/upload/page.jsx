import ImportUsers from "../components/upload";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <ImportUsers />
    </AdminLayout>
  );
}
