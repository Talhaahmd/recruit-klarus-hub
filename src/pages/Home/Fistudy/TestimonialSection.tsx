import React from 'react';

const TestimonialSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "HR Director",
      image: "/fistudy-assets/images/testimonial/testimonial-1-1.jpg",
      text: "Klarus transformed our recruitment process completely. We've reduced our time-to-hire by 60% and improved candidate quality significantly. The AI-powered matching is incredibly accurate."
    },
    {
      name: "James Thompson",
      role: "Talent Acquisition Manager",
      image: "/fistudy-assets/images/testimonial/testimonial-1-2.jpg",
      text: "The LinkedIn integration is seamless and the automated workflows save us countless hours. Our team can now focus on building relationships with candidates rather than administrative tasks."
    },
    {
      name: "Emily Chen",
      role: "Recruiting Lead",
      image: "/fistudy-assets/images/testimonial/testimonial-1-3.jpg",
      text: "Best investment we've made in our hiring process. The platform is intuitive, the support team is phenomenal, and the results speak for themselves. Highly recommended!"
    }
  ];

  return (
    <section className="testimonial-one">
      <div className="testimonial-one__shape-1 float-bob-x">
        <img src="/fistudy-assets/images/shapes/testimonial-one-shape-1.png" alt="" />
      </div>
      <div className="testimonial-one__shape-2">
        <img src="/fistudy-assets/images/shapes/testimonial-one-shape-2.png" alt="" />
      </div>
      <div className="container">
        <div className="section-title text-left sec-title-animation animation-style2">
          <div className="section-title__tagline-box">
            <div className="section-title__tagline-shape"></div>
            <span className="section-title__tagline">Client Success</span>
          </div>
          <h2 className="section-title__title title-animation">What Our Customers <br />
            <span>Are Saying <img src="/fistudy-assets/images/shapes/section-title-shape-1.png" alt="" /></span>
          </h2>
        </div>
        <div className="testimonial-one__inner">
          <div className="testimonial-one__carousel owl-theme owl-carousel">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="item">
                <div className="testimonial-one__single">
                  <div className="testimonial-one__img-inner">
                    <div className="testimonial-one__img">
                      <img src={testimonial.image} alt={testimonial.name} />
                      <div className="testimonial-one__icon">
                        <span className="icon-graduation-cap"></span>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-one__content">
                    <div className="testimonial-one__client-info">
                      <h3 className="testimonial-one__client-name"><a href="#">{testimonial.name}</a></h3>
                      <p className="testimonial-one__client-sub-title">{testimonial.role}</p>
                    </div>
                    <p className="testimonial-one__text">{testimonial.text}</p>
                    <div className="testimonial-one__ratting-and-social">
                      <ul className="testimonial-one__ratting list-unstyled">
                        <li><span className="icon-star"></span></li>
                        <li><span className="icon-star"></span></li>
                        <li><span className="icon-star"></span></li>
                        <li><span className="icon-star"></span></li>
                        <li><span className="icon-star"></span></li>
                      </ul>
                      <div className="testimonial-one__social">
                        <a href="#"><span className="fab fa-linkedin-in"></span></a>
                        <a href="#"><span className="fab fa-twitter"></span></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;

