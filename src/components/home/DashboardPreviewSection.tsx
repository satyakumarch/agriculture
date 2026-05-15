
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseChart from '@/components/ExpenseChart';
import SeedRecommendation from '@/components/SeedRecommendation';
import { Button } from '@/components/ui/button';

interface DashboardPreviewSectionProps {
  seedData: {
    id: string;
    name: string;
    image: string;
    season: string;
    soilType: string[];
    waterNeeds: 'Low' | 'Medium' | 'High';
    growthPeriod: string;
    idealTemp: string;
    yieldEstimate: string;
    description: string;
    matchScore: number;
  };
}

const DashboardPreviewSection = ({ seedData }: DashboardPreviewSectionProps) => {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-green-50 dark:bg-green-950/10 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 mb-3">
            Live Dashboard
          </div>
          <h2 className="text-3xl font-bold mb-4">Everything at Your Fingertips</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor your farm's performance, track expenses, check weather, and receive recommendations all in one place.
          </p>
        </div>

        <div className="space-y-8">
          {/* Full-width Expense Chart */}
          <ExpenseChart />

          {/* Seed Recommendations */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Recommended Seeds for This Season</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/seed-guide')}>View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SeedRecommendation seed={seedData} />
              <SeedRecommendation seed={{
                ...seedData,
                id: 'seed-2',
                name: 'Drought-Resistant Wheat',
                image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
                season: 'Winter',
                soilType: ['Clay', 'Loamy'],
                waterNeeds: 'Low' as const,
                matchScore: 88,
                description: 'A hardy winter wheat variety that can thrive with minimal water, making it ideal for regions with limited rainfall or drought-prone areas.'
              }} />
              <SeedRecommendation seed={{
                ...seedData,
                id: 'seed-3',
                name: 'Organic Soybeans',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Soybeanvarieties.jpg/640px-Soybeanvarieties.jpg',
                season: 'Spring',
                soilType: ['Loamy', 'Clayey'],
                waterNeeds: 'Medium' as const,
                matchScore: 85,
                description: 'Non-GMO soybean variety perfect for organic farming operations. High in protein content and excellent nitrogen fixation for soil improvement.'
              }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
