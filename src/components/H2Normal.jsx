import Image from "next/image";

const H2Normal = ({ title }) => {
  return (
    <div className="flex flex-col items-center gap-3 px-4">
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
  );
};

export default H2Normal;
