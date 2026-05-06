import  WelcomeInNightclub from "@/components/WelcomeInNightclub";
import H2Normal from "@/components/H2Normal";

export default function Playground() {
  return (
    <div className="bg-(--color-bg) text-white mb-12">
        <H2Normal title="Welcome in Nightclub" />
      <WelcomeInNightclub />
    </div>
  );
}