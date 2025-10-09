
import React from 'react';
import { LineChart, Bell, Bug, Satellite, MessagesSquare } from 'lucide-react';
import farmProduce from '@/assets/farm-produce.jpg';

const AdditionalFeaturesSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 mb-3">
<<<<<<< HEAD
              More Features
=======
              More Features Coming Soon
>>>>>>> 64f66eb (updating the website)
            </div>
            <h2 className="text-3xl font-bold mb-6">Advanced Tools for Modern Agriculture</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              AgriAssist provides a comprehensive suite of tools to help you optimize every aspect of your farming operation, from planning to harvest.
            </p>
            
            <div className="space-y-4">
              <FeatureItem 
                icon={<LineChart className="h-5 w-5 text-primary" />}
                title="Market Price Tracker"
                description="Stay updated on crop prices across different markets to sell your produce at the most profitable rates."
              />
              
              <FeatureItem 
                icon={<Bell className="h-5 w-5 text-primary" />}
                title="Automated Alerts & Reminders"
                description="Receive timely notifications for irrigation, fertilization, pest control, and harvesting schedules."
              />
              
              <FeatureItem 
                icon={<Bug className="h-5 w-5 text-primary" />}
                title="Pest & Disease Detection"
                description="Upload images of your plants and let our AI detect early signs of crop diseases or pest infestations."
              />
              
              <FeatureItem 
                icon={<Satellite className="h-5 w-5 text-primary" />}
                title="Satellite & Drone Integration"
                description="Utilize satellite imagery and drone monitoring for comprehensive aerial field analysis and crop health tracking."
              />
              
              <FeatureItem 
                icon={<MessagesSquare className="h-5 w-5 text-primary" />}
                title="Community Forum & Expert Advice"
                description="Connect with other farmers, share experiences, and get guidance from agricultural experts."
              />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-sky-500/20 blur-xl rounded-2xl"></div>
            <div className="relative glass-card p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <img 
                    src={farmProduce} 
                    alt="Various agricultural crops and fresh farm produce including corn, wheat, tomatoes and leafy vegetables" 
                    className="rounded-lg w-full h-48 object-cover"
                  />
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1559122998-808ac5ba14d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Crop disease detection" 
                    className="rounded-lg w-full h-32 object-cover"
                  />
                </div>
                <div>
                  <img 
                    src="https://images.unsplash.com/photo-1494599948593-3dafe8338d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                    alt="Market prices" 
                    className="rounded-lg w-full h-32 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AdditionalFeaturesSection;
