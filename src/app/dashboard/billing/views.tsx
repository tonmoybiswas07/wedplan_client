import Link from "next/link";
import { Check, CreditCard, Crown, Sparkles, AlertCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { fetchDashboardApi } from "@/lib/dashboard-api";
import { cn } from "@/lib/utils";
import { RefreshConfirmation, UpgradeButton } from "./controls";
import { stripeMoney } from "./money";

const subscriptionPath = "/dashboard/vendor/subscription";
const transactionsPath = "/dashboard/admin/transactions";
const dateFormat = new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" });
const badge = "inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-bold";
const card = "rounded-2xl border border-border/80 bg-card p-6 shadow-sm";

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

export async function VendorSubscription() {
  const result = await billing();
  if (!result) return (
    <div role="alert" className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
      Subscription details could not be loaded. Please refresh the page to retry.
    </div>
  );
  
  const premium = result.plan === "premium";
  const price = result.price;
  const ends = result.currentPeriodEnd ? dateFormat.format(new Date(result.currentPeriodEnd)) : null;

  return (
    <div className="grid max-w-4xl gap-6">
      {/* Current Status Banner */}
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Membership Status</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
              {premium ? "WedPlan Premium Partner" : "WedPlan Standard Vendor"}
            </h2>
            {premium && ends && (
              <p className="mt-1 text-xs text-muted-foreground">
                {result.cancelAtPeriodEnd ? "Premium access concludes on" : "Next billing renewal on"} <strong className="text-foreground">{ends}</strong>.
              </p>
            )}
            {result.awaitingPayment && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <AlertCircle size={14} /> Your Stripe subscription is pending action or payment verification.
              </p>
            )}
            {!premium && result.status === "expired" && (
              <p className="mt-1 text-xs text-muted-foreground">Your previous paid Premium billing period has expired.</p>
            )}
            {!premium && result.status === "canceled" && (
              <p className="mt-1 text-xs text-muted-foreground">Your Premium subscription has ended.</p>
            )}
          </div>
          <span className={cn(badge, premium ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" : "bg-secondary text-secondary-foreground")}>
            {premium && <Crown size={14} aria-hidden="true" />}
            {premium ? "Premium Active" : "Free Tier"}
          </span>
        </div>
      </section>

      {/* Plan Comparison Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <section className={card}>
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-bold text-foreground">Standard Free</h3>
                {!premium && <span className={cn(badge, "bg-secondary text-secondary-foreground")}>Active Tier</span>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Ideal for emerging wedding vendors starting out.</p>
              
              <div className="mt-6 border-t border-border/70 pt-5">
                <p className="font-display text-3xl font-extrabold text-foreground">৳0 <span className="text-xs font-normal text-muted-foreground">/ forever</span></p>
              </div>

              <ul className="mt-6 grid gap-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>Publish up to <strong>3 Active Services</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>Receive customer booking requests</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>Basic vendor dashboard overview</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-border/70 pt-4">
              <p className="text-xs text-muted-foreground text-center">Standard Free included with every registration.</p>
            </div>
          </div>
        </section>

        {/* Premium Plan */}
        <section className={cn(card, "border-primary/40 bg-gradient-to-b from-secondary/40 via-card to-card relative overflow-hidden")}>
          <div className="absolute top-0 inset-x-0 h-1 bg-primary" />
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown size={20} className="text-primary" />
                  <h3 className="font-display text-2xl font-bold text-foreground">Premium Partner</h3>
                </div>
                {premium ? (
                  <span className={cn(badge, "bg-primary text-primary-foreground")}>Current Plan</span>
                ) : (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase">Recommended</span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Unlimited exposure & verified badge visibility.</p>

              <div className="mt-6 border-t border-border/70 pt-5">
                {price ? (
                  <p className="font-display text-3xl font-extrabold text-foreground">
                    {stripeMoney(price.amount, price.currency)}
                    <span className="text-xs font-normal text-muted-foreground">
                      {price.intervalCount === 1 ? ` / ${price.interval}` : ` every ${price.intervalCount} ${price.interval}s`}
                    </span>
                  </p>
                ) : (
                  <p className="font-display text-2xl font-bold text-foreground">Flexible Subscription</p>
                )}
              </div>

              <ul className="mt-6 grid gap-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span className="font-semibold text-foreground">Unlimited Active Wedding Services</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span className="font-semibold text-foreground">Premium Partner Badge on all listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span>Priority placement in category searches</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-primary" />
                  <span>Instant customer inquiry notifications</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-border/70 pt-5">
              {premium ? (
                <div className="rounded-xl bg-emerald-500/10 p-3 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Your Premium Partner benefits are active.
                </div>
              ) : result.awaitingPayment ? (
                <p className="text-center text-xs text-muted-foreground">Please resolve the pending Stripe invoice to resume checkout.</p>
              ) : result.billingAvailable ? (
                <UpgradeButton />
              ) : (
                <p className="text-center text-xs text-muted-foreground">Stripe Test Mode checkout is currently offline.</p>
              )}
              <p className="mt-2 text-center text-[11px] text-muted-foreground">Secured via Stripe Test Mode Checkout</p>
            </div>
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
  const heading = kind === "cancel" ? "Checkout Cancelled" : confirmed ? "Subscription Confirmed!" : "Payment Processing...";

  return (
    <section className={cn(card, "max-w-2xl")}>
      <div className="flex flex-col items-center text-center p-6">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CreditCard size={28} />
        </div>
        <h2 role="status" className="font-display text-3xl font-bold text-foreground">{heading}</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          {kind === "cancel" 
            ? "Your Stripe checkout session was stopped without charges. You can retry whenever you want."
            : confirmed 
              ? "Your Stripe payment has been verified. Unlimited service publishing is now active on your vendor account."
              : "WedPlan is awaiting the verified webhook confirmation event from Stripe. This usually takes just a few seconds."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {kind === "success" && !confirmed && sessionId && <RefreshConfirmation auto={Boolean(result)} />}
          <Link href={subscriptionPath} className={cn(buttonVariants(), "rounded-full px-6 text-sm font-semibold")}>
            Return to Subscription
          </Link>
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
  if (!response.ok) return (
    <div role="alert" className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
      Transactions could not be loaded. Please refresh the page to retry.
    </div>
  );
  
  const { transactions, hasNext } = await response.json() as { transactions: Transaction[]; hasNext: boolean };

  return (
    <div className="grid gap-6">
      {transactions.length ? (
        <ul className="grid gap-3">
          {transactions.map((row) => (
            <li key={row.id} className={card}>
              <dl className="grid min-w-0 grid-cols-2 gap-3 p-2 text-xs sm:grid-cols-3 lg:grid-cols-6 items-center">
                <div className="col-span-2 min-w-0 sm:col-span-1">
                  <dt className="text-muted-foreground uppercase font-semibold text-[10px]">Vendor</dt>
                  <dd className="break-words font-bold text-foreground text-sm">{row.vendor}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase font-semibold text-[10px]">Tier</dt>
                  <dd className="font-semibold text-primary">Premium Partner</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase font-semibold text-[10px]">Amount</dt>
                  <dd className="font-bold text-foreground text-sm">{stripeMoney(row.amount, row.currency)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase font-semibold text-[10px]">Currency</dt>
                  <dd className="font-semibold uppercase text-muted-foreground">{row.currency}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase font-semibold text-[10px]">Status</dt>
                  <dd className="mt-0.5">
                    <span className={cn(badge, row.status === "paid" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive")}>
                      {row.status === "paid" ? "Paid / Verified" : "Failed"}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground uppercase font-semibold text-[10px]">Date</dt>
                  <dd className="font-medium text-foreground"><time dateTime={row.date}>{dateFormat.format(new Date(row.date))}</time></dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card p-12 text-center text-sm text-muted-foreground">
          No platform transactions recorded yet.
        </div>
      )}

      {(page > 1 || hasNext) && (
        <nav aria-label="Transaction results pagination" className="flex items-center justify-center gap-3 border-t border-border/60 pt-6">
          {page > 1 && (
            <Link href={`${transactionsPath}?page=${page - 1}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4")}>
              Previous
            </Link>
          )}
          <span className="text-xs font-semibold rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
            Page {page}
          </span>
          {hasNext && (
            <Link href={`${transactionsPath}?page=${page + 1}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4")}>
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
