export type VendorService = {
  id: string;
  title: string;
  category: string;
  description: string;
  priceMinor: number;
  imageUrl?: string;
  status: "pending" | "approved" | "rejected";
  active: boolean;
};

export type ServiceErrors = Partial<Record<"title" | "category" | "description" | "price" | "image", string[]>>;
