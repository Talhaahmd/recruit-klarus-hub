
import React from 'react';

const ClientsSection: React.FC = () => {
  const companies = [
    {
      name: "SPS Commerce",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192783/sps_commerce_corp_2015_logo-removebg-preview_bz5mrn.png"
    },
    {
      name: "Sigma",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192783/sigmalogo-removebg-preview_mbt651.png"
    },
    {
      name: "IOS",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192781/IOS_xmnnfn.svg"
    },
    {
      name: "OneScreen",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192782/onescreen-logo__1_-removebg-preview_boih9e.png"
    },
    {
      name: "Company 1",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192781/images-removebg-preview__2__kfratu.png"
    },
    {
      name: "Company 2",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192781/images-removebg-preview__1__zijyzh.png"
    },
    {
      name: "Company 3",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192780/images__1_-removebg-preview_360_jttkma.png"
    },
    {
      name: "Drilldown",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192780/drilldown_ewf032.png"
    }
  ];

  // Duplicate the companies array to create seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-200/50 bg-[size:20px_20px] opacity-30"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-6">
            Companies we are working with
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Trusted by industry leaders worldwide to transform their recruitment processes
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-6 rounded-full"></div>
        </div>
        
        {/* Marquee container */}
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Scrolling container */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee hover:pause-animation">
              {duplicatedCompanies.map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 mx-8 lg:mx-12"
                >
                  <div className="flex items-center justify-center p-6 lg:p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:scale-105">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="h-16 lg:h-20 xl:h-24 w-auto object-contain transition-all duration-300 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-16 lg:mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-gray-600 font-medium">Partner Companies</div>
            </div>
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">10k+</div>
              <div className="text-gray-600 font-medium">Successful Placements</div>
            </div>
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
              <div className="text-gray-600 font-medium">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
