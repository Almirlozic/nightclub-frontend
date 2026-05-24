import GalleryClient from "./GalleryClient";
import { getGallery } from "@/lib/api";

const Gallery = async () => {
  const data = await getGallery();

  return <GalleryClient images={data.data ?? data} />;
};

export default Gallery;
