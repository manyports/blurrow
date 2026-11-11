import { Instrument } from "./Instrument";

/* The opening: the promise and what it gets you, hung from one left
   edge. Then, with room to breathe, the product itself, as one object
   you can play. The instrument is the call to action.            */
export function Hero() {
  return (
    <section className="pt-14 sm:pt-24">
      <div className="flex flex-col items-start">
        {/* Each clause starts its own line at every width; the split is the design */}
        <h1 className="text-[clamp(34px,5.6vw,80px)] font-medium leading-[1.02] tracking-[-0.05em]">
          <span className="block text-balance text-ink">buttons you want to press,</span>
          <span className="block text-balance text-ink-faint">fields you want to fill in.</span>
        </h1>
        <p className="mt-7 max-w-[44ch] text-[17px] leading-[1.55] text-ink-body text-pretty sm:text-[18px]">
          every part is cut from the same few materials and lit by the same light, so whatever you build with them
          feels made, not assembled.
        </p>
      </div>

      <div className="mt-16 sm:mt-24">
        <Instrument />
      </div>
    </section>
  );
}
