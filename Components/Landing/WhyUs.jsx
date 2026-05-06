export default function WhyUs({ heading, items }) {
  return (
    <section className="bg-[#050505] py-16 md:py-24 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-inter-display font-bold text-3xl md:text-5xl text-white leading-tight mb-12 max-w-3xl">
          {heading}
        </h2>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-[#1e1e1e] rounded-2xl p-6 md:p-8 border border-white/10"
            >
              <h3 className="font-inter-display font-bold text-xl md:text-2xl text-white mb-3">
                {item.title}
              </h3>
              <p className="font-manrope text-base md:text-lg text-white/70 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
