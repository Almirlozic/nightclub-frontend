import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WelcomeInNightclub from "@/components/WelcomeInNightclub";
import H2Normal from "@/components/H2Normal";
import LatestVideo from "@/components/LatestVideo";
import FeauteredEvents from "@/components/FeauteredEvents";
import Gallery from "@/components/Gallery";
import Webplayer from "@/components/Webplayer";
import PersonSpotlight from "@/components/PersonSpotlight";
import Newsletter from "@/components/Newsletter";

export default async function Home() {
  const res = await fetch("https://nightclub-api-dhqe.onrender.com/events", { next: { revalidate: 60 } });
  const allEvents = await res.json();
  const featuredEvents = allEvents.filter((e) => e.isFeatured);

  return (
    <div>
      <Hero />
      <Header />
      <H2Normal title="Welcome in Nightclub" />
      <WelcomeInNightclub />
      <H2Normal title="Feautered events" />
      <FeauteredEvents events={featuredEvents} />
      <H2Normal title="Nightclub gallery" />
      <Gallery />
      <H2Normal title="Night Club Track" />
      <Webplayer />
      <H2Normal title="Latest Video" />
      <LatestVideo />
      <PersonSpotlight />
      <Newsletter />
    </div>
  );
}
