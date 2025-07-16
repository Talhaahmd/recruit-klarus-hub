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
    <section className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Companies We Work With
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Trusted by forward-thinking teams — 12 partner companies, 88+ successful placements, and 6000+ jobs supported.
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-8 items-center justify-items-center opacity-60">
          {companies.map((company, index) => (
            <div key={index} className="hover:opacity-100 transition-opacity duration-300">
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-8 sm:h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            And many more innovative companies trust Klarus HR
          </p>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
