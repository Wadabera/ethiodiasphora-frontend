// import React from 'react';

const Footer = () => {
  const footerLinks = {
    product: ["Features", "How it Works", "Pricing", "API Docs"],
    company: ["About us", "Careers", "Press Kit", "API Docs"],
    legal: ["Privacy Policy", "Terms of Service", "KYC/AML", "Security"],
    resources: ["Blog", "Help Center", "Community", "ESX Data"],
  };

  return (
    <footer className="bg-black text-white border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        {/* Brand & Tagline */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-linear-to-r from-orange-500 via-yellow-500 to-orange-700 bg-clip-text text-transparent">
            EthioDiaspora
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Bridging 3.5M diaspora to Ethiopia's $130B economy
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h3 className="font-bold mb-3">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 EthioDiaspora. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
