
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-green-50 dark:bg-green-900/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500">AgriAssist</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{t.footer.tagline}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>
          <div>
            <h6 className="text-lg font-semibold mb-4">{t.footer.quickLinks}</h6>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors">{t.footer.home}</Link></li>
              <li><Link to="/seed-guide" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors">{t.footer.seedGuide}</Link></li>
              <li><Link to="/expense-tracker" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors">{t.footer.expenseTracker}</Link></li>
              <li><Link to="/weather" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors">{t.footer.weatherForecast}</Link></li>
              <li><Link to="/iot-monitoring" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors">{t.footer.iotMonitoring}</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="text-lg font-semibold mb-4">{t.footer.resources}</h6>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors">{t.footer.cropGuidelines}</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors">{t.footer.pestControl}</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors">{t.footer.marketTrends}</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors">{t.footer.expertAdvice}</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 transition-colors">{t.footer.communityForum}</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-lg font-semibold mb-4">{t.footer.contactUs}</h6>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3"><MapPin size={20} className="text-primary mt-0.5" /><span className="text-gray-600 dark:text-gray-300">123 Farm Road, Agriville</span></li>
              <li className="flex items-center space-x-3"><Phone size={20} className="text-primary" /><span className="text-gray-600 dark:text-gray-300">+1 (123) 456-7890</span></li>
              <li className="flex items-center space-x-3"><Mail size={20} className="text-primary" /><span className="text-gray-600 dark:text-gray-300">support@agriassist.com</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} AgriAssist. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
