import GalleryClient from "./GalleryClient";

const Gallery = async () => {
  const res = await fetch("https://nightclub-api-dhqe.onrender.com/gallery", { cache: "no-store" });

  const data = await res.json();

  return <GalleryClient images={data.data ?? data} />;
};

export default Gallery;
