import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-16 pb-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo + Description */}
          <div>
            <Link to="/" className="flex items-center mb-6">
              <img 
                src="https://res.cloudinary.com/dt93sahp2/image/upload/v1761244578/freepik__background__64708_1_ilskfj.png" 
                alt="Klarus HR Logo" 
                className="w-auto object-contain"
                style={{ height: '100px' }}
              />
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
              Everything for rapid growth on LinkedIn, hiring and recruitment with AI chatbots and gamification
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Solutions</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/linkedin-recruiting" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn Recruiting</Link></li>
              <li><Link to="/ats-integration" className="text-muted-foreground hover:text-foreground transition-colors">ATS Integration</Link></li>
              <li><Link to="/interview-automation" className="text-muted-foreground hover:text-foreground transition-colors">Interview Automation</Link></li>
              <li><Link to="/ai-agent" className="text-muted-foreground hover:text-foreground transition-colors">AI Agent</Link></li>
              <li><Link to="/gamification" className="text-muted-foreground hover:text-foreground transition-colors">Gamification</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/help-center" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link to="/hiring-strategy" className="text-muted-foreground hover:text-foreground transition-colors">Hiring Strategy</Link></li>
              <li><Link to="/templates" className="text-muted-foreground hover:text-foreground transition-colors">Templates</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()}. Klarus HR®
            </p>
            <p className="text-muted-foreground text-sm">
              We respect your privacy
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;