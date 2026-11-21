import { Camera, Flower2, Landmark, Shirt, Sparkles, Utensils } from "lucide-react";

export const categories = [
  { name: "Photography & Videography", aliases: ["Photography", "Videography"], Icon: Camera },
  { name: "Wedding Venues", aliases: ["Venue", "Venues", "Wedding Venue"], Icon: Landmark },
  { name: "Decoration & Florist", aliases: ["Decoration", "Flowers", "Florist"], Icon: Flower2 },
  { name: "Catering Services", aliases: ["Catering"], Icon: Utensils },
  { name: "Makeup & Styling", aliases: ["Makeup", "Bridal Makeup", "Styling"], Icon: Sparkles },
  { name: "Wedding Fashion", aliases: ["Fashion", "Bridal Fashion"], Icon: Shirt },
] as const;

export function canonicalCategory(value?: string) {
  return categories.find(({name, aliases}) => [name, ...aliases].some((entry) => entry.toLowerCase() === value?.toLowerCase()))?.name ?? "";
}
