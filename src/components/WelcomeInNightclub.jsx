import Image from "next/image";

const cards = [
  {
    src: "/assets/content-img/thumb1.jpg",
    icon: "/assets/icon/favicon.png",
    label: "NIGHT CLUB",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
  },
  {
    src: "/assets/content-img/reastaurant_1.jpg",
    icon: "/assets/icon/table2.svg",
    label: "RESTAURANT",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
  },
  {
    src: "/assets/content-img/thumb2.jpg",
    icon: "/assets/icon/table3.svg",
    label: "BAR",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
  },
];

const WelcomeInNightclub = () => {
  return (
    <div className="flex justify-center gap-8 my-12">
      {cards.map(
        ({ src, icon, label, description }) => (
          <div
            key={label}
            className="relative w-75 h-95 overflow-hidden group cursor-pointer"
          >
            {/* Default: photo */}
            <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
              <Image
                src={src}
                alt={label}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Hover: info card */}
            <div className="absolute inset-0 bg-(--color-bg) opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-6 gap-4">
              {/* Corner accents */}
              <div
                className="absolute top-0 left-0 w-6 h-6 bg-(--color-brand)"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 0 100%)",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-6 h-6 bg-(--color-brand)"
                style={{
                  clipPath:
                    "polygon(100% 100%, 0 100%, 100% 0)",
                }}
              />

              {/* Icon */}
              <div className="border border-(--color-brand) p-4">
                <img
                  src={icon}
                  alt={label}
                  className="w-10 h-10"
                />
              </div>

              <h3 className="text-white font-bold tracking-widest text-lg">
                {label}
              </h3>
              <p className="text-white text-sm leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default WelcomeInNightclub;
