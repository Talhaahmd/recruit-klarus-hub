import React, { useEffect, useMemo, useRef } from 'react';

const BrandsSection: React.FC = () => {
  const brands = useMemo(
    () => [
      '/poze-assets/img/brand_1.svg',
      '/poze-assets/img/brand_2.svg',
      '/poze-assets/img/brand_3.svg',
      '/poze-assets/img/brand_4.svg',
      '/poze-assets/img/brand_5.svg',
      '/poze-assets/img/brand_6.svg',
    ], []
  );

  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const track = trackRef.current;
    if (!track) return;
    if (reduce) { track.classList.add('is-paused'); return; }
    // Restart animation when images load to ensure width is correct
    const imgs = track.querySelectorAll('img');
    let loaded = 0;
    imgs.forEach((img) => {
      if (img.complete) { loaded++; return; }
      img.addEventListener('load', () => {
        loaded++;
        if (loaded === imgs.length) {
          track.classList.remove('is-ready');
          // force reflow then re-add
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          track.offsetHeight;
          track.classList.add('is-ready');
        }
      });
    });
    track.classList.add('is-ready');
  }, []);

  return (
    <section aria-label="Trusted by brands">
      <div className="container">
        <div className="cs_section_heading cs_style_2 text-center">
          <h2 className="cs_section_subtitle mb-0 wow fadeInUp" data-wow-duration="0.8s" data-wow-delay="0.2s">
            Our worldwide reputed partner
          </h2>
        </div>
        <div className="cs_height_45 cs_height_lg_45"></div>
        <div className="cs_brands_marquee" onMouseEnter={() => trackRef.current?.classList.add('is-paused')} onMouseLeave={() => trackRef.current?.classList.remove('is-paused')}>
          <div ref={trackRef} className="cs_brands_track">
            {[...brands, ...brands].map((brand, index) => (
              <div key={index} className="cs_brand">
                <img src={brand} alt="Brand" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="cs_height_150 cs_height_lg_80"></div>
    </section>
  );
};

export default BrandsSection;

