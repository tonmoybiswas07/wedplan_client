import Link from "next/link";
import { AccountAvatar } from "@/components/ui/account-avatar";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardAccess } from "@/lib/dashboard-session";
import { cn } from "@/lib/utils";

export async function PublicAccountLink() {
  const access = await getDashboardAccess();
  if (access.status === "allowed") {
    return <Link href="/dashboard" aria-label={`Dashboard for ${access.user.name}`}
      className={cn(buttonVariants({ variant: "outline" }), "h-10 max-w-36 gap-2 px-2 sm:max-w-56")}>
      <AccountAvatar image={access.user.image} />
      <span className="truncate">{access.user.name}</span>
    </Link>;
  }
  return <Link href="/sign-in" className={cn(buttonVariants({ variant: "outline" }), "h-9 px-3")}>Sign in</Link>;
}
