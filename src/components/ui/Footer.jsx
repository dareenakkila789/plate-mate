import { Link } from 'react-router-dom'
import { UtensilsCrossed} from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-secondary border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="md:col-span-2">
            <Link to="/" className="text-3xl font-bold text-text-dark flex items-center mb-4">
                        <UtensilsCrossed className="h-10 w-10 text-primary" />

              <span className="text-primary">Plate</span>
              <span>Mate</span>
            </Link>
            <p className="text-base text-text-light max-w-md">
              Share what you can. Find what you need. Join our community and help reduce food waste while connecting with neighbors.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg text-text-dark mb-4">About</h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link to="/about" className="text-text-light hover:text-primary transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-light hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-light hover:text-primary transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg text-text-dark mb-4">Support</h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link to="/faq" className="text-text-light hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-light hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-text-light hover:text-primary transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-text-light text-base">
          <p>© 2025 PlateMate. Built with love.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
