export default function PainPoints({ heading, items }) {
  return (
    <section className="bg-white py-16 md:py-24 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-inter-display font-bold text-3xl md:text-5xl text-black leading-tight mb-12 max-w-3xl">
          {heading}
        </h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8"
            >
              <h3 className="font-inter-display font-bold text-xl md:text-2xl text-black mb-3">
                {item.title}
              </h3>
              <p className="font-manrope text-base md:text-lg text-gray-700 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
