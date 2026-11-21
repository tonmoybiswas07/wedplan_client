import Link from "next/link";
import { Check, CreditCard, Crown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { fetchDashboardApi } from "@/lib/dashboard-api";
import { cn } from "@/lib/utils";
import { RefreshConfirmation, UpgradeButton } from "./controls";
import { stripeMoney } from "./money";

const subscriptionPath = "/dashboard/vendor/subscription";
const transactionsPath = "/dashboard/admin/transactions";
const dateFormat = new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" });
const badge = "inline-flex w-fit items-center gap-1 rounded-full border border-line bg-blush px-2.5 py-1 text-xs font-semibold text-ink";
const card = "border border-line bg-paper p-1 shadow-sm";

type Billing = {
  plan: "free" | "premium";
  status: "active" | "inactive" | "canceled" | "expired";
  billingAvailable: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  awaitingPayment: boolean;
  checkoutConfirmed: boolean;
  price: { amount: number; currency: string; interval: string; intervalCount: number } | null;
};

async function billing(sessionId?: string) {
  const query = sessionId ? "?" + new URLSearchParams({ session_id: sessionId }).toString() : "";
  const response = await fetchDashboardApi("vendor", "/api/vendor/billing" + query);
  return response.ok ? await response.json() as Billing : null;
}

export function BillingLoading() {
  return <p role="status" className="border border-line bg-paper p-5 text-sm text-muted-foreground">Loading billing information…</p>;
}

export async function VendorSubscription() {
  const result = await billing();
  if (!result) return <p role="alert" className="border border-line bg-paper p-5">Subscription details could not be loaded. Refresh to try again.</p>;
  const premium = result.plan === "premium";
  const price = result.price;
  const ends = result.currentPeriodEnd ? dateFormat.format(new Date(result.currentPeriodEnd)) : null;

  return (
    <div className="grid max-w-4xl gap-5">
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3 border border-line/65 p-5">
          <div>
            <h2 className="font-display text-2xl">Current plan</h2>
            {premium && ends && <p className="mt-1 text-sm text-muted-foreground">
              {result.cancelAtPeriodEnd ? "Premium ends" : "Current paid period ends"} {ends}.
            </p>}
            {result.awaitingPayment && <p className="mt-1 text-sm text-muted-foreground">Your Stripe subscription is awaiting payment or action.</p>}
            {!premium && result.status === "expired" && <p className="mt-1 text-sm text-muted-foreground">Your paid Premium period has expired.</p>}
            {!premium && result.status === "canceled" && <p className="mt-1 text-sm text-muted-foreground">Your Premium subscription has ended.</p>}
          </div>
          <span className={badge}>{premium && <Crown size={14} aria-hidden="true" />}{premium ? "Premium" : "Free"}</span>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        <section className={card}>
          <div className="grid h-full content-start gap-4 border border-line/65 p-5 sm:p-6">
            <h2 className="font-display text-3xl">Free</h2>
            <p className="text-sm text-muted-foreground">No subscription fee.</p>
            <p className="flex items-start gap-2 text-sm"><Check size={17} aria-hidden="true" /> Activate up to 3 services.</p>
            <p className="text-sm">Vendor dashboard and booking request management.</p>
            {!premium && <span className={badge}>Current plan</span>}
          </div>
        </section>
        <section className={card}>
          <div className="grid h-full content-start gap-4 border border-line/65 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-display text-3xl"><Crown aria-hidden="true" className="size-5 text-berry" />Premium</h2>
            <p className="text-sm text-muted-foreground">{price ? (
              <>
                <strong className="text-lg text-ink">{stripeMoney(price.amount, price.currency)}</strong>
                {price.intervalCount === 1 ? ` per ${price.interval}` : ` every ${price.intervalCount} ${price.interval}s`}
              </>
            ) : "Recurring subscription"}</p>
            <p className="flex items-start gap-2 text-sm"><Check size={17} aria-hidden="true" /> No active-service limit.</p>
            <p className="text-sm">All Free features and a Premium Vendor badge.</p>
            {premium ? <span className={badge}>Current plan</span> : result.awaitingPayment ? (
              <p className="text-sm text-muted-foreground">Resolve the existing subscription in Stripe before starting another checkout.</p>
            ) : result.billingAvailable ? <UpgradeButton /> : (
              <p className="text-sm text-muted-foreground">Stripe Test Mode checkout is unavailable.</p>
            )}
            <p className="text-xs text-muted-foreground">Stripe Test Mode</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export async function PaymentReturn({ kind, search }: { kind: "success" | "cancel"; search: Promise<Record<string, string | string[] | undefined>> }) {
  const query = kind === "success" ? await search : {};
  const sessionId = typeof query.session_id === "string" && /^cs_test_[a-zA-Z0-9]+$/.test(query.session_id) && query.session_id.length <= 180
    ? query.session_id : undefined;
  const result = kind === "success" && sessionId ? await billing(sessionId) : null;
  const confirmed = result?.checkoutConfirmed === true;
  const heading = kind === "cancel" ? "Checkout cancelled" : confirmed ? "Payment confirmed" : "Payment confirmation pending";

  return (
    <section className={cn(card, "max-w-2xl")}>
      <div className="grid gap-4 border border-line/65 p-5 sm:p-8">
        <CreditCard aria-hidden="true" className="text-berry" />
        <h2 role="status" className="font-display text-3xl">{heading}</h2>
        <p className="text-sm text-muted-foreground">
          {kind === "cancel" ? "You can return to your subscription and start Checkout again."
            : confirmed ? "Premium is now active for your vendor account."
            : "WedPlan is waiting for verified payment confirmation from Stripe."}
        </p>
        <div className="flex flex-wrap gap-3">
          {kind === "success" && !confirmed && sessionId && <RefreshConfirmation auto={Boolean(result)} />}
          <Link href={subscriptionPath} className={cn(buttonVariants(), "h-10 px-4")}>Back to Subscription</Link>
        </div>
      </div>
    </section>
  );
}

type Transaction = {
  id: string;
  vendor: string;
  plan: "premium";
  amount: number;
  currency: string;
  status: "paid" | "failed";
  date: string;
};

export async function AdminTransactions({ search }: { search: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = (await search).page;
  const page = typeof raw === "string" && /^[1-9]\d{0,5}$/.test(raw) ? Number(raw) : 1;
  const response = await fetchDashboardApi("admin", `/api/admin/transactions?page=${page}`);
  if (!response.ok) return <p role="alert" className="border border-line bg-paper p-5">Transactions could not be loaded. Refresh to try again.</p>;
  const { transactions, hasNext } = await response.json() as { transactions: Transaction[]; hasNext: boolean };

  return (
    <div className="grid gap-5">
      {transactions.length ? (
        <ul className="grid gap-3">
          {transactions.map((row) => (
            <li key={row.id} className={card}>
              <dl className="grid min-w-0 grid-cols-2 gap-3 border border-line/65 p-4 text-sm sm:grid-cols-3 lg:grid-cols-6">
                <div className="col-span-2 min-w-0 sm:col-span-1"><dt className="text-muted-foreground">Vendor</dt><dd className="break-words font-semibold">{row.vendor}</dd></div>
                <div><dt className="text-muted-foreground">Plan</dt><dd className="font-semibold">Premium</dd></div>
                <div><dt className="text-muted-foreground">Amount</dt><dd className="font-semibold">{stripeMoney(row.amount, row.currency)}</dd></div>
                <div><dt className="text-muted-foreground">Currency</dt><dd className="font-semibold uppercase">{row.currency}</dd></div>
                <div><dt className="text-muted-foreground">Status</dt><dd className="mt-0.5">
                  <span className={cn(badge, row.status === "paid" ? "bg-success-surface text-success-ink" : "bg-danger-surface text-danger-ink")}>{row.status === "paid" ? "Paid" : "Failed"}</span>
                </dd></div>
                <div><dt className="text-muted-foreground">Date</dt><dd className="font-semibold"><time dateTime={row.date}>{dateFormat.format(new Date(row.date))}</time></dd></div>
              </dl>
            </li>
          ))}
        </ul>
      ) : <p className="border border-dashed border-line bg-paper p-8 text-center text-muted-foreground">No transactions on this page.</p>}
      {(page > 1 || hasNext) && <nav aria-label="Transaction results" className="flex items-center gap-3">
        {page > 1 && <Link href={`${transactionsPath}?page=${page - 1}`} className={buttonVariants({ variant: "outline" })}>Previous</Link>}
        <span className="text-sm">Page {page}</span>
        {hasNext && <Link href={`${transactionsPath}?page=${page + 1}`} className={buttonVariants({ variant: "outline" })}>Next</Link>}
      </nav>}
    </div>
  );
}
