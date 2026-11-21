import { CircleUserRound } from "lucide-react";

export function AccountAvatar({ image }: { image?: string }) {
  if (image && /^https:\/\//i.test(image)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Images are hosted by ImgBB or the OAuth provider.
      <img src={image} alt="" referrerPolicy="no-referrer" className="size-7 shrink-0 rounded-full object-cover" />
    );
  }
  return <CircleUserRound size={20} className="shrink-0" aria-hidden="true" />;
}
