export type VendorService = {
  id: string;
  title: string;
  category: string;
  description: string;
  priceMinor: number;
  imageUrl?: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
};

export type ServiceErrors = Partial<Record<"title" | "category" | "description" | "price" | "image", string[]>>;
