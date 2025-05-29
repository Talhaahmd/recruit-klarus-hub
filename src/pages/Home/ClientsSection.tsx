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
    },
    {
      name: "New Company 1",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192778/download_ogsq3o.png"
    },
    {
      name: "DACI Utilities",
      logo: "https://res.cloudinary.com/dt3ufcdjs/image/upload/v1748192777/daci_utilities_engineering_consultancy_logo-removebg-preview_cfhekk.png"
    }
  ];

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Companies We Work With
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Trusted by forward-thinking teams — 12 partner companies, 88+ successful placements, and 6000+ jobs supported.
          </p>
        </div>

        {/* Logo Row */}
        <div className="flex flex-wrap justify-between items-center gap-6">
          {companies.map((company, index) => (
            <img
              key={index}
              src={company.logo}
              alt={company.name}
              className="h-10 sm:h-12 object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
