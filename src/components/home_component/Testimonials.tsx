const TESTIMONIALS = [
  {
    quote:
      "StudioSpace replaced our home office shoots overnight. The lighting alone elevated our brand to a level we couldn't reach on our own.",
    name: "Amara Bennett",
    role: "Founder, Northwave Studio",
  },
  {
    quote:
      "I record three podcasts a week here. Walk in, sit down, hit record. The acoustic treatment is genuinely studio-grade.",
    name: "Daniel Okafor",
    role: "Host, The Long Game",
  },
  {
    quote:
      "The team treats every booking like a real production. It's the difference between a rental and a creative partner.",
    name: "Lina Park",
    role: "Creative Director, Atelier",
  },
];

const Testimonials = () => (
  <section
    id="testimonials"
    aria-labelledby="testimonials-heading"
    className="bg-[#f7f5f0] dark:bg-[#14100c] px-5 py-14 sm:px-8 sm:py-20"
  >
    <div className="mx-auto max-w-6xl">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#927d72] dark:text-[#a4987f]">
          <span aria-hidden>&bull; </span>Loved by creators
        </p>
        <h2
          id="testimonials-heading"
          className="mt-3 text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl"
        >
          Words from the people
          <br />
          <span className="font-normal italic text-[#806049] dark:text-[#c8ab7f]">
            who shoot here.
          </span>
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex h-full flex-col rounded-xl bg-card p-7 shadow-sm ring-1 ring-black/8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-8 sm:last:col-span-2 lg:last:col-span-1"
          >
            <span
              aria-hidden
              className="font-serif text-6xl leading-[0.55] text-[#CFC7B9] dark:text-[#3a332a]"
            >
              &rdquo;
            </span>
            <blockquote className="mt-6 text-[15px] leading-7 text-foreground">
              <p>{testimonial.quote}</p>
            </blockquote>
            <div className="mt-auto">
              <figcaption className="mt-7 border-t border-border pt-5">
                <p className="text-sm font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {testimonial.role}
                </p>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
