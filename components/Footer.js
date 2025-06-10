import Link from 'next/link';
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Kent Of Kids</h3>
            <p className="text-gray-300 mb-4">
              Konfor, dayanıklılık ve stil odaklı kaliteli çocuk giyim mağazası.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/p/KENT-of-K%C4%B0DS-100064203037395/" className="text-gray-300 hover:text-primary transition-colors duration-200">
                <FaFacebook size={20} />
              </a>
              <a href="https://www.instagram.com/kentoffkids" className="text-gray-300 hover:text-primary transition-colors duration-200">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary transition-colors duration-200">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-primary transition-colors duration-200">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-gray-300 hover:text-primary transition-colors duration-200">
                  Randevu Al
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary transition-colors duration-200">
                  Hakkımızda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-primary" />
                <span className="text-gray-300">Zafer, Gazi Cd. No:101, 55100 İlkadım/Samsun</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary" />
                <span className="text-gray-300">+90 532 702 88 59</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary" />
                <span className="text-gray-300">info@kentofkids.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} Kent Of Kids. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
