import React from 'react';

const SlidingTextSection: React.FC = () => {
  return (
    <section className="sliding-text-one">
      <div className="sliding-text-one__wrap">
        <ul className="sliding-text__list list-unstyled marquee_mode">
          <li>
            <h2 data-hover="AI-Powered Recruitment" className="sliding-text__title">AI-Powered Recruitment
              <img src="/fistudy-assets/images/shapes/sliding-text-shape-1.png" alt="" />
            </h2>
          </li>
          <li>
            <h2 data-hover="LinkedIn Integration" className="sliding-text__title">LinkedIn Integration
              <img src="/fistudy-assets/images/shapes/sliding-text-shape-1.png" alt="" />
            </h2>
          </li>
          <li>
            <h2 data-hover="Automated Hiring" className="sliding-text__title">Automated Hiring
              <img src="/fistudy-assets/images/shapes/sliding-text-shape-1.png" alt="" />
            </h2>
          </li>
          <li>
            <h2 data-hover="Smart Candidate Matching" className="sliding-text__title">Smart Candidate Matching
              <img src="/fistudy-assets/images/shapes/sliding-text-shape-1.png" alt="" />
            </h2>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default SlidingTextSection;
