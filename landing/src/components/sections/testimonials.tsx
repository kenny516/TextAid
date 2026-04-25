const testimonials = [
  {
    quote:
      "I use it to turn scattered notes into client-ready copy before I even leave the original tab.",
    name: "Sarah Chen",
    role: "Product Marketer, Luminary",
  },
  {
    quote:
      "The summarizer saves me from reading the same long internal brief three times. It gets to the point fast.",
    name: "Marcus Webb",
    role: "Growth Lead, Arcline",
  },
  {
    quote:
      "It feels like a smart editor that follows me around the browser without ever getting in the way.",
    name: "Elena Voss",
    role: "Brand Director, Helix",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <div className="liquid-glass inline-flex rounded-full px-3.5 py-1">
          <span className="font-body text-xs font-medium text-white">What People Say</span>
        </div>
        <h2 className="mt-6 font-heading text-4xl italic leading-[0.9] tracking-tight text-white md:text-5xl lg:text-6xl">
          The browser feels lighter when the writing does.
        </h2>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.name} className="liquid-glass rounded-2xl p-8">
            <p className="font-body text-sm font-light italic leading-7 text-white/80">
              “{testimonial.quote}”
            </p>
            <div className="mt-10">
              <p className="font-body text-sm font-medium text-white">{testimonial.name}</p>
              <p className="font-body text-xs font-light text-white/50">{testimonial.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
