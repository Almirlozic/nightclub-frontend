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
import { getEvents, getTestimonials } from "@/lib/api";

export default async function Home() {
  const [allEvents, testimonials] = await Promise.all([
    getEvents({ next: { revalidate: 60 } }),
    getTestimonials(),
  ]);
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
      <PersonSpotlight initialPeople={testimonials} />
      <Newsletter />
    </div>
  );
}
