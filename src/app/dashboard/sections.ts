export const sections = {
  overview: { label: "Overview", description: "" },
  "my-bookings": { label: "My Bookings", description: "Review the vendors you’ve booked for your wedding." },
  "profile-settings": { label: "Profile Settings", description: "Update your display name and profile photo." },
  "my-services": { label: "My Services", description: "View and manage your wedding service listings." },
  "add-service": { label: "Add Service", description: "Create a listing for a wedding service you offer." },
  "booking-requests": { label: "Booking Requests", description: "Review requests from couples interested in your services." },
  subscription: { label: "Subscription", description: "View your plan and manage subscription billing." },
  "manage-users": { label: "Manage Users", description: "Review WedPlan accounts and manage access." },
  "manage-services": { label: "Manage Services", description: "Review and moderate vendor service listings." },
  transactions: { label: "Transactions", description: "Review payments and transaction history." },
} as const;

export type DashboardSection = keyof typeof sections;

export const dashboardRoles = {
  customer: {
    label: "Customer",
    description: "Your wedding plans and vendor bookings, all in one place.",
    sections: ["overview", "my-bookings", "profile-settings"],
  },
  vendor: {
    label: "Vendor",
    description: "Manage your wedding services and respond to couples.",
    sections: ["overview", "my-services", "add-service", "booking-requests", "subscription", "profile-settings"],
  },
  admin: {
    label: "Admin",
    description: "Oversee WedPlan accounts, service listings, and transactions.",
    sections: ["overview", "manage-users", "manage-services", "transactions"],
  },
} as const satisfies Record<string, { label: string; description: string; sections: readonly DashboardSection[] }>;

export type DashboardRole = keyof typeof dashboardRoles;

export function isDashboardRole(role: unknown): role is DashboardRole {
  return typeof role === "string" && Object.hasOwn(dashboardRoles, role);
}

export function dashboardPath(role: DashboardRole, section: DashboardSection = "overview") {
  return section === "overview" ? `/dashboard/${role}` : `/dashboard/${role}/${section}`;
}
