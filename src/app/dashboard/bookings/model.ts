export type BookingRole = "customer" | "vendor";
export type BookingAction = "accepted" | "rejected" | "cancelled";
export type BookingStatus = BookingAction | "pending" | "confirmed" | "completed";

export type Booking = {
  id: string;
  eventDate: string;
  eventLocation: string;
  createdAt: string;
  status: BookingStatus;
  message?: string;
  service: { title: string; imageUrl: string | null };
  contact: { name: string; email?: string | null };
};

export function bookingsPath(role: BookingRole, id?: string) {
  const path = role === "customer" ? "/dashboard/customer/my-bookings" : "/dashboard/vendor/booking-requests";
  return id ? `${path}/${id}` : path;
}
