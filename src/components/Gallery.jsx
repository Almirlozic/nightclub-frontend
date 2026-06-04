// Henter GalleryClient-komponenten fra samme mappe.
// GalleryClient håndterer al den interaktive logik (klik, swipe, modal).
// Vi deler det op i to filer fordi Gallery henter data fra serveren,
// mens GalleryClient kører i browseren og håndterer brugerinteraktion.
import GalleryClient from "./GalleryClient";

// Henter funktionen getGallery fra vores eget api-bibliotek.
// @/ er en genvej til projektets src-mappe (en "path alias").
// getGallery henter billeder fra vores backend/CMS (f.eks. Sanity eller et REST API).
import { getGallery } from "@/lib/api";

// Gallery er en "async" komponent — den kan hente data fra serveren FØR den vises.
// async betyder at funktionen kan bruge "await" og vente på at data er klar.
// Den kører KUN på serveren (ingen "use client" øverst).
const Gallery = async () => {

  // await stopper og venter på at getGallery() er færdig med at hente data fra API'et.
  // Resultatet (billedlisten) gemmes i variablen "data".
  const data = await getGallery();

  // Gengiver GalleryClient og sender billederne med som en prop kaldet "images".
  // data.data ?? data er en "nullish coalescing"-operator:
  //   Hvis data.data eksisterer (API'et returnerede { data: [...] }) → brug data.data
  //   Ellers (API'et returnerede listen direkte) → brug data som det er
  // Det håndterer to forskellige API-svarformater på én gang.
  return <GalleryClient images={data.data ?? data} />;
};

// Gør Gallery tilgængeligt for andre filer så de kan importere det.
export default Gallery;
