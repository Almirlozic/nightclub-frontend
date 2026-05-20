import WelcomeInNightclub from "@/components/WelcomeInNightclub";
import H2Normal from "@/components/H2Normal";
import LatestVideo from "@/components/LatestVideo";
import FeauteredEvents from "@/components/FeauteredEvents";
import Gallery from "@/components/Gallery";

export default function Playground() {
  return (
    <div className="bg-(--color-bg) text-white mb-12">
      <H2Normal title="Welcome in Nightclub" bgImage="/assets/bg/footerbg.jpg" />
      <WelcomeInNightclub />
      <H2Normal title="Latest Video" />
      <LatestVideo />
      <H2Normal title="Feautered Events" />
      <FeauteredEvents />
      <Gallery />
    </div>
  );
}
