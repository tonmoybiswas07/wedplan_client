export type VendorService = {
  id: string;
  title: string;
  category: string;
  location?: string;
  description: string;
  priceMinor: number;
  imageUrl?: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
};

export type ServiceErrors = Partial<Record<"title" | "category" | "location" | "description" | "price" | "image", string[]>>;
