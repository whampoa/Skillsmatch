import React from 'react';
import { Scale, AlertTriangle, ExternalLink, Mail, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-legal-navy text-white mt-auto">
      {/* Legal Disclaimer */}
      <div className="bg-amber-900/30 border-t border-amber-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-amber-300 mb-1">Important Legal Disclaimer</h4>
              <p className="text-sm text-amber-100/90 leading-relaxed">
                LegalConnect is a directory service only and does not provide legal advice. 
                The information on this website is for general informational purposes only and 
                should not be construed as legal advice on any subject matter. No reader should 
                act or refrain from acting on the basis of any information included on this site 
                without seeking appropriate legal or other professional advice. The lawyer listings 
                and associated information are provided "as is" without any representations or 
                warranties, express or implied. Always verify credentials and qualifications 
                directly with the legal professional before engaging their services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Scale className="text-white" size={22} />
              </div>
              <span className="font-display text-xl font-bold">
                Legal<span className="text-primary-400">Connect</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-md">
              LegalConnect helps Australians find qualified legal professionals 
              based on their specific needs. Browse, compare, and shortlist lawyers 
              with confidence.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a
                href="mailto:hello@legalconnect.com.au"
                className="hover:text-white transition-colors"
                aria-label="Email us"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://github.com/whampoa/Skillsmatch"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="View source on GitHub (opens in new tab)"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#browse" className="text-slate-400 hover:text-white transition-colors">
                  Browse Lawyers
                </a>
              </li>
              <li>
                <a href="#map" className="text-slate-400 hover:text-white transition-colors">
                  Map View
                </a>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Australian Legal Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.lawsociety.com.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Law Society of NSW
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mara.gov.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  MARA (Migration Agents)
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.familycourt.gov.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Family Court of Australia
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.legalaid.nsw.gov.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Legal Aid NSW
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© {currentYear} LegalConnect. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

