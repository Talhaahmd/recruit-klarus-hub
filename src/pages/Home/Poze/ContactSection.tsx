import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <div className="cs_contact" id="contact">
      <div className="cs_height_80 cs_height_lg_50"></div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6 wow fadeInLeft" data-wow-duration="0.8s" data-wow-delay="0.2s">
            <div className="cs_contact_thumb text-center">
              <img src="https://res.cloudinary.com/dt93sahp2/image/upload/v1761248944/Smartphone_on_laptop_keyboard_mockup_d041vf.png" alt="Contact Klarus HR" />
            </div>
          </div>
          <div className="col-xl-6 wow fadeIn" data-wow-duration="0.8s" data-wow-delay="0.2s">
            <div className="cs_section_heading cs_style_1">
              <p className="cs_section_subtitle cs_text_accent">Contact Us</p>
              <h2 className="cs_section_title mb-0">Get in Touch! Reach <br /> Out to Us Today</h2>
            </div>
            <div className="cs_height_30 cs_height_lg_25"></div>
            <form action="https://api.web3forms.com/submit" method="POST" id="cs_form" className="row">
              <input type="hidden" name="access_key" value="cd98bsf256-0db3-478c-acsb28-1ec94fwf80447c" />
              <div className="col-sm-6">
                <input type="text" name="name" className="cs_form_field" placeholder="Full Name*" required />
                <div className="cs_height_20 cs_height_lg_20"></div>
              </div>
              <div className="col-sm-6">
                <input type="email" name="email" className="cs_form_field" placeholder="Email*" required />
                <div className="cs_height_20 cs_height_lg_20"></div>
              </div>
              <div className="col-sm-6">
                <input type="text" name="phone" className="cs_form_field" placeholder="Mobile*" required />
                <div className="cs_height_20 cs_height_lg_20"></div>
              </div>
              <div className="col-sm-6">
                <input type="text" name="subject" className="cs_form_field" placeholder="Subject*" required />
                <div className="cs_height_20 cs_height_lg_20"></div>
              </div>
              <div className="col-lg-12">
                <textarea name="message" rows={5} className="cs_form_field m-0" placeholder="Write Project Details*" required></textarea>
                <div className="cs_height_20 cs_height_lg_20"></div>
              </div>
              <div className="col-lg-12">
                <button className="cs_btn cs_type_1 cs_bg_accent cs_dark_hover" type="submit" aria-label="Submit button">Send Message</button>
                <div id="cs_result"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="cs_height_60 cs_height_lg_40"></div>
    </div>
  );
};

export default ContactSection;

