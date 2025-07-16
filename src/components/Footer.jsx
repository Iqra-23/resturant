import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1c1c1c] text-white py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-red-600 text-white px-2 py-1 text-sm font-bold rounded rotate-[-20deg]">
              Food
            </div>
            <span className="text-2xl font-bold">.chow</span>
          </div>
          <p className="text-sm text-gray-300">
            Food Ordering is a Premium HTML Template. Best choice for your online store.
            <br />
            Let purchase it to enjoy now
          </p>
          <div className="flex space-x-3 mt-4 text-gray-400">
            <i className="fab fa-facebook-f hover:text-white cursor-pointer" />
            <i className="fab fa-google-plus-g hover:text-white cursor-pointer" />
            <i className="fab fa-twitter hover:text-white cursor-pointer" />
            <i className="fab fa-pinterest hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-semibold mb-4">INFORMATION</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>› Careers</li>
            <li>› Investor Relations</li>
            <li>› Press Releases</li>
            <li>› Shop with Points</li>
            <li>› More Branches</li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-semibold mb-4">CUSTOMER CARE</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>› Returns</li>
            <li>› Shipping Info</li>
            <li>› Gift Cards</li>
            <li>› Size Guide</li>
            <li>› Money Back</li>
          </ul>
        </div>

        {/* Get in Touch */}
        <div>
          <h4 className="font-semibold mb-4">GET IN TOUCH</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start space-x-2">
              <MapPin className="w-5 h-5 text-red-500 mt-1" />
              <span>
                123 New Design Str, ABC Building, <br />
                Melbourne, Australia.
              </span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-red-500" />
              <span>(0044) 8647 1234 587</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-red-500" />
              <span>hello@yourdomain.com</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
