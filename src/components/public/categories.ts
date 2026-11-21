import { Camera, Film, Flower2, Landmark, Sparkles, Utensils } from "lucide-react";

export const categories = [
  { name: "Photography", Icon: Camera },
  { name: "Videography", Icon: Film },
  { name: "Catering", Icon: Utensils },
  { name: "Decoration", Icon: Flower2 },
  { name: "Venue", Icon: Landmark },
  { name: "Bridal Makeup", Icon: Sparkles },
] as const;
