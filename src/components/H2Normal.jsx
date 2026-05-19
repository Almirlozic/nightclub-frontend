import Image from "next/image";

const H2Normal = ({ title, bgImage = null }) => {
  return (  
    <div className="relative flex flex-col items-center gap-3 px-4 py-10 overflow-hidden">
      {bgImage && (
  <>
    <Image src={bgImage} alt="" fill style={{ objectFit: "cover" }} className="z-0" />
    <div className="absolute inset-0 bg-black/85 z-10" />
  </>
)}

      <div className="relative z-10 flex flex-col items-center gap-3">
        <h2 className="text-white font-bold tracking-widest text-xl md:text-3xl uppercase text-center">
          {title}
        </h2>
        <div className="relative w-48 md:w-[500px] h-3">
          <Image
            src="/assets/bottom_line2.png"
            alt=""
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
};

export default H2Normal;
