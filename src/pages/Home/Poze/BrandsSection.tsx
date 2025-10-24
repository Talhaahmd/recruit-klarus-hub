import React from 'react';

const BrandsSection: React.FC = () => {
  const brands = [
    '/poze-assets/img/brand_1.svg',
    '/poze-assets/img/brand_2.svg',
    '/poze-assets/img/brand_3.svg',
    '/poze-assets/img/brand_4.svg',
    '/poze-assets/img/brand_5.svg',
    '/poze-assets/img/brand_6.svg'
  ];

  return (
    <>
      <div className="container">
        <div className="cs_section_heading cs_style_2 text-center">
          <h2 className="cs_section_subtitle mb-0 wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.2s">
            Our worldwide reputed partner
          </h2>
        </div>
        <div className="cs_height_45 cs_height_lg_45"></div>
        <div className="cs_partners wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
          {brands.map((brand, index) => (
            <div key={index} className="cs_partner">
              <img src={brand} alt="Brand" />
            </div>
          ))}
        </div>
      </div>
      <div className="cs_height_150 cs_height_lg_80"></div>
    </>
  );
};

export default BrandsSection;

