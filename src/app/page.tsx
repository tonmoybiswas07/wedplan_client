import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="grid min-h-svh place-items-center bg-rose-50 px-6">
      <div className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-rose-950">
          WedPlan
        </h1>
        <p className="mt-3 text-rose-900">
          Find the right vendors for your wedding.
        </p>
        <Button className="mt-6" disabled>
          Explore Wedding Services
        </Button>
      </div>
    </main>
  );
}