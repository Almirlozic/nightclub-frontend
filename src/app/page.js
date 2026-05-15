import Header from "@/components/Header";
import Image from "next/image";
import WelcomeInNightclub from "@/components/WelcomeInNightclub";
import H2Normal from "@/components/H2Normal";
import LatestVideo from "@/components/LatestVideo";
import FeauteredEvents from "@/components/FeauteredEvents";
import Gallery from "@/components/Gallery";
import PersonSpotlight from "@/components/PersonSpotlight";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div>
      <H2Normal title="Welcome in Nightclub" />
            <WelcomeInNightclub />
      <H2Normal title="Feautered events" />
            <FeauteredEvents />
      <H2Normal title="Nightclub gallery" />
            <Gallery />
      <H2Normal title="Latest Video" />
            <LatestVideo />
      <H2Normal title="Person Spotlight" />
            <PersonSpotlight />
            <Newsletter />
    </div>
  );
}
