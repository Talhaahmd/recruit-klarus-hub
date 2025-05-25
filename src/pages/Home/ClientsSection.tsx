
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

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
            Companies we are working with
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted by industry leaders worldwide to transform their recruitment processes
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12 items-center justify-items-center">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 lg:p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
            >
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-12 lg:h-16 xl:h-20 w-auto object-contain animate-spin group-hover:animate-none transition-all duration-300 filter grayscale hover:grayscale-0"
                style={{
                  animationDuration: '8s',
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
