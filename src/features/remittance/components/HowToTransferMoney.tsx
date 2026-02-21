import React from "react";

// Sample image URLs - replace these with your actual image URLs
const stepImages = {
  step1:
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  step2:
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  step3:
    "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  step4:
    "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  step5:
    "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
};

const HowToTransferMoney = () => {
  const steps = [
    {
      number: "01",
      title: "Create an account",
      description:
        "This is simple. Just sign up using your email address on our app or website. And keep things secure by choosing a strong password.",
      image: stepImages.step1,
    },
    {
      number: "02",
      title: "We'll verify your details",
      description:
        "For even better security, we'll verify who you are. But this should only take a few minutes.",
      image: stepImages.step2,
    },
    {
      number: "03",
      title: "Start your transfer",
      description:
        "Select the receive country and method, and enter the amount you want to send. Our fees and exchange rates are shown upfront.",
      image: stepImages.step3,
    },
    {
      number: "04",
      title: "Enter your receiver's details",
      description:
        "Have your receiver's details to hand. These may vary depending on how you're sending them the money.",
      image: stepImages.step4,
    },
    {
      number: "05",
      title: "Pay for your transfer",
      description: "Choose how you'd like to pay.",
      image: stepImages.step5,
    },
  ];

  return (
    <div className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            How to Transfer Money
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Follow these simple steps to transfer money internationally
          </p>
          <div className="mt-4 w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>

                {/* Step Number Badge */}
                <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-sm">
                  Step {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-500 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Decorative Element */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button className="bg-yellow-500 text-black font-semibold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors inline-flex items-center gap-2 group">
            <span>Start Your Transfer Now</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToTransferMoney;
