import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminGetUsers } from "@/lib/api";
import { AdminHeader, AdminTable, EmptyRow, TableSkeleton } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/admin/users")({ component: Page });

function Page() {
  const { data, isLoading } = useQuery({ queryKey: ["admin", "users"], queryFn: adminGetUsers });
  return (
    <>
      <AdminHeader title="Users" />
      {isLoading ? <TableSkeleton /> : (
        <AdminTable head={["Name", "Email", "Phone", "Language", "Role"]}>
          {!data?.length ? <EmptyRow cols={5} /> : data.map((u) => (
            <tr key={u.id}>
              <td className="px-3 py-2 font-medium">{u.full_name}</td><td className="px-3 py-2">{u.email}</td><td className="px-3 py-2">{u.phone}</td>
              <td className="px-3 py-2 uppercase">{u.preferred_language}</td>
              <td className="px-3 py-2"><span className={u.role === "admin" ? "rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground" : "text-muted-foreground"}>{u.role}</span></td>
            </tr>
          ))}
        </AdminTable>
      )}
    </>
  );
}
