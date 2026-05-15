import  WelcomeInNightclub from "@/components/WelcomeInNightclub";
import H2Normal from "@/components/H2Normal";
import LatestVideo from "@/components/LatestVideo";
import FeauteredEvents from "@/components/FeauteredEvents";
import PersonSpotlight from "@/components/PersonSpotlight";
import Newsletter from "@/components/Newsletter";
import Webplayer from "@/components/Webplayer";


export default function Playground() {
  return (
    <div className="bg-(--color-bg) text-white mb-12">
      <Webplayer/>
        {/* <H2Normal title="Welcome in Nightclub" bgImage="/assets/bg/footerbg.jpg" />
      <WelcomeInNightclub />
        <H2Normal title="Latest Video" />
      <LatestVideo />
        <H2Normal title="Feautered Events" />
        <FeauteredEvents />
        <Webplayer src="/assets/audio/sample.mp3" title="Sample Song" artist="Sample Artist" />
        <PersonSpotlight />
        <Newsletter /> */}
    </div>
  );
}