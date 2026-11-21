import Form from "next/form";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchDashboardApi } from "@/lib/dashboard-api";
import { cn } from "@/lib/utils";
import type { DashboardSearch } from "../admin-services/list";
import { dashboardRoles, isDashboardRole } from "../sections";
import { AccountControls } from "./controls";
import { adminUsersPath, type AdminUser } from "./model";

function AccountCard({ user, viewerEmail, details }: { user: AdminUser; viewerEmail: string; details?: boolean }) {
  const role = dashboardRoles[user.role]?.label ?? "Unknown";
  const isViewer = viewerEmail === user.email;

  return (
    <article className="border border-line bg-paper p-1 shadow-sm">
      <div className="grid gap-4 border border-line/65 p-4 sm:p-5">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blush text-ink">
              <UserRound aria-hidden="true" size={18} />
            </span>
            <div className="min-w-0">
              <h2 className="break-words font-display text-2xl">{user.name}</h2>
              <p className="break-words text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <span className={cn(
            "rounded-full border border-line/65 px-2.5 py-1 text-xs font-semibold",
            user.blocked ? "bg-danger-surface text-danger-ink" : "bg-success-surface text-success-ink",
          )}>{user.blocked ? "Blocked" : "Active"}</span>
        </div>
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex gap-2"><dt className="text-muted-foreground">Role</dt><dd className="font-semibold">{role}</dd></div>
          {details && <div className="flex gap-2"><dt className="text-muted-foreground">Access</dt>
            <dd className="font-semibold">{user.blocked ? "Protected access denied" : "Protected access enabled"}</dd></div>}
        </dl>
        <div className="flex flex-wrap items-center gap-2 border-t border-line/65 pt-3">
          {!details && <Link href={`${adminUsersPath}/${user.id}`} prefetch={false}
            aria-label={`View details for ${user.name}`}
            className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3")}>View details</Link>}
          {isViewer ? <span className="px-2 text-xs text-muted-foreground">Your account</span> : <AccountControls user={user} />}
        </div>
      </div>
    </article>
  );
}

export async function AdminUsersList({ search, viewerEmail }: {
  search: Promise<DashboardSearch>;
  viewerEmail: string;
}) {
  const params = await search;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const role = isDashboardRole(params.role) ? params.role : "";
  const page = typeof params.page === "string" && /^[1-9]\d{0,5}$/.test(params.page) ? Number(params.page) : 1;

  function query(pageNumber: number) {
    const search = new URLSearchParams({ page: String(pageNumber) });
    if (role) search.set("role", role);
    if (q) search.set("q", q);
    return search.toString();
  }

  const response = await fetchDashboardApi("admin", `/api/admin/users?${query(page)}`);
  const result = response.ok ? await response.json() as { users: AdminUser[]; hasNext: boolean } : null;

  return (
    <div className="grid gap-5">
      <Form action={adminUsersPath} key={query(page)} className="flex flex-wrap items-end gap-3 border border-line bg-paper p-4">
        <div className="min-w-0 flex-1 basis-52">
          <label htmlFor="user-search" className="mb-1 block text-sm font-semibold">Search users</label>
          <Input id="user-search" name="q" type="search" maxLength={100} defaultValue={q}
            placeholder="Name or email" className="h-10" />
        </div>
        <div>
          <label htmlFor="user-role" className="mb-1 block text-sm font-semibold">Role</label>
          <select id="user-role" name="role" defaultValue={role}
            className="h-10 rounded-md border border-input bg-paper px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring">
            <option value="">All roles</option>
            {Object.entries(dashboardRoles).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
          </select>
        </div>
        <Button type="submit" className="h-10 px-4">Apply filters</Button>
        {(q || role) && <Link href={adminUsersPath} className={cn(buttonVariants({ variant: "ghost" }), "h-10 px-3")}>Clear</Link>}
      </Form>
      {!result ? <p role="alert" className="border border-line bg-paper p-5">Users could not be loaded. Refresh the page to try again.</p>
        : result.users.length ? <ul className="grid gap-4 xl:grid-cols-2">
          {result.users.map((user) => <li key={user.id} className="min-w-0"><AccountCard user={user} viewerEmail={viewerEmail} /></li>)}
        </ul> : <p className="border border-dashed border-line bg-paper p-8 text-center text-muted-foreground">No users match these filters.</p>}
      {result && (page > 1 || result.hasNext) && <nav aria-label="User results" className="flex flex-wrap items-center gap-3">
        {page > 1 && <Link href={`${adminUsersPath}?${query(page - 1)}`} className={buttonVariants({ variant: "outline" })}>Previous</Link>}
        <span className="text-sm">Page {page}</span>
        {result.hasNext && <Link href={`${adminUsersPath}?${query(page + 1)}`} className={buttonVariants({ variant: "outline" })}>Next</Link>}
      </nav>}
    </div>
  );
}

export async function AdminUserDetails({ id, viewerEmail }: { id: string; viewerEmail: string }) {
  const response = /^[\da-f]{24}$/i.test(id) ? await fetchDashboardApi("admin", `/api/admin/users/${id}`) : null;
  const result = response?.ok ? await response.json() as { user: AdminUser } : null;

  return (
    <div className="grid max-w-3xl gap-5">
      <Link href={adminUsersPath} className="w-fit text-sm font-semibold underline underline-offset-4">Back to Manage Users</Link>
      {result ? <AccountCard user={result.user} viewerEmail={viewerEmail} details /> : (
        <p role="alert" className="border border-line bg-paper p-5">
          {!response || response.status === 404 ? "This user could not be found." : "User details could not be loaded. Refresh the page to try again."}
        </p>
      )}
    </div>
  );
}
