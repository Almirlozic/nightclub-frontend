import BtnNormal from "@/components/BtnNormal";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-6">
      <h1 className="text-3xl font-bold tracking-widest uppercase text-white">
        Siden blev ikke fundet
      </h1>
      <p className="text-white/70 max-w-md">
        Vi kunne ikke finde det du ledte efter. Måske er linket forkert, eller siden findes ikke længere.
      </p>
      <BtnNormal href="/" title="Tilbage til forsiden" />
    </div>
  );
}
