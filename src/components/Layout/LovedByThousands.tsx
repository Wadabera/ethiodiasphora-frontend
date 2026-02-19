// import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      rating: "★★★★★",
      quote:
        "Saved $2,400 in remittance fees last year. The ESX trading is a game-changer—up 15% in 6 months!",
      initials: "FA",
      name: "Femi A.",
      role: "Expert Engineer, Dubai",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      id: 2,
      rating: "★★★★",
      quote:
        "Funded 3 Addis properties through the platform. ROI tracking is crystal clear. Best decision ever.",
      initials: "WA",
      name: "Wadi A.",
      role: "Real Estate Investor, Toronto",
      gradient: "from-orange-500 to-yellow-600",
    },
    {
      id: 3,
      rating: "★★★★★",
      quote:
        "The coffee co-op investment paid dividends in 8 months. Support team is fantastic. Highly recommend!",
      initials: "WD",
      name: "Wodi D.",
      role: "Small Business Owner, London",
      gradient: "from-yellow-500 to-orange-600",
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-orange-500 via-yellow-500 to-orange-700 bg-clip-text text-transparent">
              Real Stories, Real Success
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hear from diaspora investors who are building wealth and making an
            impact back home
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Rating */}
              <div className="text-yellow-400 text-2xl mb-6">
                {testimonial.rating}
              </div>

              {/* Quote */}
              <div className="mb-8 relative">
                <div className="text-6xl text-gray-800 absolute -top-4 -left-2">
                  "
                </div>
                <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                  {testimonial.quote}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-4 pt-6 border-t border-gray-800">
                {/* Avatar */}
                <div
                  className={`w-14 h-14 rounded-full bg-linear-to-r ${testimonial.gradient} flex items-center justify-center text-white font-bold text-xl`}
                >
                  {testimonial.initials}
                </div>

                {/* Details */}
                <div>
                  <h4 className="font-bold text-white text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
