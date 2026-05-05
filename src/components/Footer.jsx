import Image from "next/image";
import SocialIcons from "./SocialIcons";

const XIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 2L18 18M18 2L2 18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const Footer = () => {
  return (
    <footer>
      {/* Main footer section */}
      <div
        className="relative"
        style={{
          backgroundImage:
            "url('/assets/bg/footerbg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/85" />

        <div className="relative z-10 grid grid-cols-1 min-[909px]:grid-cols-3 gap-4 min-[909px]:gap-6 lg:gap-12 px-6 min-[909px]:px-8 lg:px-16 py-12 lg:py-24">
          {/* Column 1: Brand + Location + Hours */}
          <div className="flex flex-col items-center min-[909px]:items-start gap-8 min-[909px]:gap-0 min-[909px]:justify-between h-full text-center min-[909px]:text-left">
            <div>
              <p className="text-white text-3xl font-bold">
                NIGHT
                <span className="text-(--color-brand)">
                  CLUB
                </span>
              </p>
              <span className="text-white text-xs tracking-[4px]">
                HAVE A GOOD TIME
              </span>
            </div>

            <div>
              <h3 className="text-(--color-brand) font-bold tracking-widest mb-3">
                LOCATION
              </h3>
              <p className="text-white font-bold text-sm">
                Kompagnistræde 278
              </p>
              <p className="text-white font-bold text-sm">
                1265 København K
              </p>
            </div>

            <div>
              <h3 className="text-(--color-brand) font-bold tracking-widest mb-3">
                OPENING HOURS
              </h3>
              <p className="text-white font-bold text-sm">
                WED - THU 10:30 PM TO 3 AM
              </p>
              <p className="text-white font-bold text-sm">
                SAT - SUN: 11 PM TO 5 AM
              </p>
            </div>
          </div>

          {/* Column 2: News */}
          <div className="hidden min-[909px]:flex flex-col justify-between h-full">
            <h3 className="text-(--color-brand) font-bold tracking-widest mb-6">
              NEWS
            </h3>
            <div className="flex flex-col gap-10 flex-1">
              {[
                { src: "/assets/content-img/recent_post1.jpg", alt: "News post 1" },
                { src: "/assets/content-img/recent_post2.jpg", alt: "News post 2" },
              ].map(({ src, alt }) => (
                <div key={alt} className="flex gap-4 items-start">
                  <div className="relative shrink-0 w-16 h-14 min-[909px]:w-28 min-[909px]:h-20">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(max-width: 909px) 64px, 112px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm leading-relaxed">
                      Lorem Ipsum is simply dummy text of the printing and typesetting.
                    </p>
                    <p className="text-(--color-brand) text-sm mt-2">
                      April 17, 2026
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Recent Posts */}
          <div className="hidden min-[909px]:flex flex-col justify-between h-full">
            <h3 className="text-(--color-brand) font-bold tracking-widest mb-6">
              RECENT POSTS
            </h3>
            <div className="flex flex-col justify-between flex-1">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start"
                >
                  <div className="text-(--color-brand) flex-shrink-0 mt-0.5">
                    <XIcon />
                  </div>
                  <div>
                    <p className="text-white text-sm leading-relaxed">
                      It is a long established
                      fact that a reader will be
                      distracted by the
                      readable...
                    </p>
                    <p className="text-(--color-brand) text-sm mt-2">
                      5 hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black py-6 flex flex-col min-[909px]:flex-row items-center gap-6 min-[909px]:gap-0 justify-center min-[909px]:justify-between px-8 lg:px-16">
        <p className="text-gray-500 text-sm text-center min-[909px]:text-left">
          Night Club<br />All Rights Reserved
        </p>
        <div className="flex flex-col items-center gap-3">
          <p className="text-white text-sm font-semibold">Stay Connected With Us</p>
          <SocialIcons />
        </div>
        <p className="text-gray-500 text-sm">
          Copyright © NightClub
        </p>
      </div>
    </footer>
  );
};

export default Footer;
