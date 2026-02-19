// import React from 'react';
import { Button } from "../ui/button";
import imageHero from "../../assets/shine.jpg";

const Hero = () => {
  // Static data for cards
  const heritageAssets = [
    {
      id: 1,
      title: "Commercial Bank of Ethiopia",
      amount: "48,245 ETB",
      icon: "🏦",
      description: "Traditional banking assets",
      growth: "+5.2% this year",
    },
    {
      id: 2,
      title: "Farming Land",
      amount: "$500,900",
      icon: "🌱",
      description: "Agricultural heritage lands",
      growth: "+12.7% appreciation",
    },
    {
      id: 3,
      title: "Coffee-Arabica",
      amount: "$500,900",
      icon: "☕",
      description: "Premium coffee bean holdings",
      growth: "+8.3% market value",
    },
    {
      id: 4,
      title: "Real Estate",
      amount: "$45,900",
      icon: "🏠",
      description: "Urban and rural properties",
      growth: "+15.1% ROI",
    },
  ];

  return (
    <section className="text-white min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        {/* Header Button */}
        <Button className="bg-linear-to-r from-yellow-500 to-orange-600 text-gray-900 font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl mb-8">
          ESX Index +28% YTD • $5.7B Remittances
        </Button>

        {/* Hero Title */}
        <div className="text-left mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-linear-to-r from-yellow-300 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Bridge Your Heritage
            </span>
            <br />
            <span className="bg-linear-to-r from-orange-500 via-yellow-500 to-orange-700 bg-clip-text text-transparent">
              to Prosperity
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mt-4 max-w-2xl">
            Transform traditional Ethiopian assets into modern investment
            opportunities. Your legacy, amplified by technology.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <img
              src={imageHero}
              alt="Heritage to Prosperity"
              className="rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent rounded-2xl"></div>

            {/* Stats Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-sm rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-yellow-400 text-2xl font-bold">+28%</div>
                  <div className="text-gray-300 text-sm">ESX Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 text-2xl font-bold">
                    $5.7B
                  </div>
                  <div className="text-gray-300 text-sm">Remittances</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Cards */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-300">
              Your Heritage Portfolio
            </h2>

            <div className="space-y-4">
              {heritageAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-linear-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{asset.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-yellow-300 transition-colors">
                          {asset.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {asset.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">
                        {asset.amount}
                      </div>
                      <div className="text-green-400 text-sm font-semibold">
                        {asset.growth}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Growth Potential</span>
                      <span>{asset.growth}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-yellow-500 to-orange-500 rounded-full"
                        style={{
                          width:
                            asset.id === 1
                              ? "80%"
                              : asset.id === 2
                                ? "90%"
                                : asset.id === 3
                                  ? "75%"
                                  : "85%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Portfolio Summary */}
            <div className="mt-8 bg-linear-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Generate Endless Value
                  </h3>
                  <p className="text-gray-300">Traditional + Modern Assets</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-yellow-400">
                    $1,095,954
                  </div>
                  <div className="text-green-400 font-semibold">
                    +18.4% Annual Growth
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-3 text-lg">
                Bridge Now →
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join 25,000+ Ethiopians transforming their heritage into global
            prosperity
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-linear-to-r from-yellow-500 to-yellow-700 text-black font-bold px-8 py-3">
              Start Bridging
            </Button>
            <Button className="bg-transparent border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 font-bold px-8 py-3">
              Explore Assets
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

// // Future API integration 
// const [assets, setAssets] = useState([]);
// useEffect(() => {
//   fetch('/api/heritage-assets')
//     .then(res => res.json())
//     .then(data => setAssets(data));
// }, []);