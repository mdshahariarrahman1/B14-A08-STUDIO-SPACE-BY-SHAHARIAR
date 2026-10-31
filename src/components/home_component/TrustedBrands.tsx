"use client";

import Marquee from "react-fast-marquee";

const BRANDS = [
  { name: "MAULIATE", mark: "sun" },
  { name: "LOGPRESS LOOGG", mark: "logpress" },
  { name: "HAUNERTEAM", mark: "hauner" },
  { name: "SALINDRA", mark: "salindra" },
  { name: "MONDA", mark: "monda", subtitle: "CAPITAL" },
  { name: "MAULIATE", mark: "sun" },
];

const TrustedBrands = () => (
  <section
    aria-labelledby="trusted-brands-heading"
    className="min-h-62 border-b-4 border-[#f1efeb] border-l-4 border-l-[#f5c2cf] bg-white px-5 pt-1"
  >
    <div className="mx-auto min-h-60 max-w-7xl border-t border-neutral-100">
      <h2
        id="trusted-brands-heading"
        className="pt-11 text-center text-[11px] font-medium tracking-[0.23em] text-[#927d72] sm:text-xs"
      >
        TRUSTED BY CREATORS &amp; BRANDS WORLDWIDE
      </h2>

      <div className="mt-7 sm:mt-8">
        <Marquee
          autoFill
          gradient
          gradientColor="#ffffff"
          pauseOnHover
          speed={28}
        >
          {BRANDS.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="mx-6 flex h-12 min-w-40 items-center justify-center gap-2.5 text-[#c9c9c9] sm:mx-8 sm:min-w-48"
            >
              {brand.mark === "sun" ? (
                <>
                  <span className="text-[22px] font-light tracking-tight sm:text-2xl">
                    {brand.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="size-9 shrink-0 rounded-full bg-[repeating-linear-gradient(135deg,#d4d4d4_0px,#d4d4d4_1px,transparent_1px,transparent_3px)]"
                  />
                </>
              ) : null}
              {brand.mark === "logpress" ? (
                <span className="text-[17px] font-black italic tracking-tight sm:text-lg">
                  ▰ {brand.name}
                </span>
              ) : null}
              {brand.mark === "hauner" ? (
                <>
                  <span
                    aria-hidden="true"
                    className="text-[23px] font-black tracking-[-0.2em]"
                  >
                    ▰▰
                  </span>
                  <span className="text-[16px] font-black italic tracking-tight sm:text-lg">
                    {brand.name}
                  </span>
                </>
              ) : null}
              {brand.mark === "salindra" ? (
                <>
                  <span
                    aria-hidden="true"
                    className="flex size-8 items-center justify-center rounded-full bg-[#d2d2d2] text-2xl font-black text-white"
                  >
                    S
                  </span>
                  <span className="text-[19px] font-black tracking-tight sm:text-xl">
                    {brand.name}
                  </span>
                </>
              ) : null}
              {brand.mark === "monda" ? (
                <>
                  <span
                    aria-hidden="true"
                    className="text-[27px] leading-none text-[#d2d2d2]"
                  >
                    ✣
                  </span>
                  <span className="flex flex-col leading-none">
                    <span className="text-[20px] font-semibold tracking-tight sm:text-[22px]">
                      {brand.name}
                    </span>
                    <span className="mt-0.5 text-[8px] tracking-[0.24em]">
                      {brand.subtitle}
                    </span>
                  </span>
                </>
              ) : null}
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  </section>
);

export default TrustedBrands;
