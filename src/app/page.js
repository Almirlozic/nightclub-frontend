import Header from "@/components/Header";
import Image from "next/image";
import WelcomeInNightclub from "@/components/WelcomeInNightclub";
import H2Normal from "@/components/H2Normal";
import LatestVideo from "@/components/LatestVideo";

export default function Home() {
  return (
    <div>
      <H2Normal title="Welcome in Nightclub" />
            <WelcomeInNightclub />
              <H2Normal title="Latest Video" />
            <LatestVideo />
    </div>
  );
}
