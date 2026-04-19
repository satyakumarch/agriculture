
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import SeedRecommendation from '@/components/SeedRecommendation';
import SeedQuantityCalculator from '@/components/SeedQuantityCalculator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, Search, Filter, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface SeedInfo {
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
}

// Sample seed data
const initialSeeds: SeedInfo[] = [
  {
    id: 'seed-1',
    name: 'Premium Hybrid Corn',
    image: 'https://images.unsplash.com/photo-1551817958-c5b51e7b4a33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    season: 'Summer',
    soilType: ['Loamy', 'Sandy Loam'],
    waterNeeds: 'Medium',
    growthPeriod: '90-120 days',
    idealTemp: '20-30°C',
    yieldEstimate: '8-10 tons/hectare',
    description: 'A high-yielding corn hybrid suitable for various soil types with excellent drought resistance and disease tolerance.',
    matchScore: 92,
  },
  {
    id: 'seed-2',
    name: 'Organic Wheat Variety',
    image: 'https://images.unsplash.com/photo-1481713160429-bd6f6e47add4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    season: 'Winter',
    soilType: ['Clay Loam', 'Silt Loam'],
    waterNeeds: 'Low',
    growthPeriod: '180-240 days',
    idealTemp: '15-25°C',
    yieldEstimate: '3-5 tons/hectare',
    description: 'An organic winter wheat variety with excellent cold tolerance and exceptional baking quality.',
    matchScore: 87,
  },
  {
    id: 'seed-3',
    name: 'High-Yield Soybean',
    image: 'https://images.unsplash.com/photo-1595412017587-b3e9911ae0bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80',
    season: 'Summer',
    soilType: ['Loamy', 'Clay'],
    waterNeeds: 'Medium',
    growthPeriod: '100-140 days',
    idealTemp: '18-30°C',
    yieldEstimate: '2-4 tons/hectare',
    description: 'A high protein soybean variety with resistance to common diseases and adaptability to various growing conditions.',
    matchScore: 85,
  },
  {
    id: 'seed-4',
    name: 'Drought-Resistant Sorghum',
    image: 'https://images.unsplash.com/photo-1536241616557-3a2e23a2fda4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    season: 'Summer',
    soilType: ['Sandy', 'Loamy'],
    waterNeeds: 'Low',
    growthPeriod: '90-120 days',
    idealTemp: '20-35°C',
    yieldEstimate: '3-6 tons/hectare',
    description: 'A drought-tolerant sorghum variety perfect for arid and semi-arid regions with minimal water requirements.',
    matchScore: 90,
  },
];

const SeedGuide = () => {
  const [seeds, setSeeds] = useState<SeedInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [selectedSeed, setSelectedSeed] = useState<SeedInfo | null>(null);
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    
    // Load seeds from localStorage or use initial data
    const savedSeeds = localStorage.getItem('seeds');
    if (savedSeeds) {
      setSeeds(JSON.parse(savedSeeds));
    } else {
      setSeeds(initialSeeds);
      localStorage.setItem('seeds', JSON.stringify(initialSeeds));
    }
  }, []);

  const handleRemoveSeed = (seedId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to remove seeds.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedSeeds = seeds.filter(seed => seed.id !== seedId);
    setSeeds(updatedSeeds);
    localStorage.setItem('seeds', JSON.stringify(updatedSeeds));
    
    toast({
      title: "Seed removed",
      description: "The seed has been successfully removed from the guide.",
    });
  };

  const filteredSeeds = seeds.filter(seed => {
    const matchesSearch = seed.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         seed.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason = seasonFilter === 'all' || seed.season === seasonFilter;
    
    return matchesSearch && matchesSeason;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300 mb-3">
              <Leaf className="h-4 w-4" />
              <span>Seed Guide</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Find the Perfect Seeds for Your Farm</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse our comprehensive collection of seeds optimized for different regions, soils, and climates.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="recommendations" className="mb-12">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="calculator">Seed Calculator</TabsTrigger>
                <TabsTrigger value="catalog">Full Catalog</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommendations">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div className="w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search seeds..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Season:</span>
                      <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="All Seasons" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Seasons</SelectItem>
                          <SelectItem value="Spring">Spring</SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                          <SelectItem value="Fall">Fall</SelectItem>
                          <SelectItem value="Winter">Winter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {filteredSeeds.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSeeds.map(seed => (
                      <div key={seed.id} className="relative group">
                        <SeedRecommendation seed={seed} />
                        {isAuthenticated && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove {seed.name} from your seed guide. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemoveSeed(seed.id)}>
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No seeds found matching your criteria.</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSearchTerm('');
                        setSeasonFilter('all');
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="calculator">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <SeedQuantityCalculator />
                  
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Seed Planting Guidelines</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Planting Depth</h4>
                        <p className="text-sm">A general rule is to plant seeds at a depth that is 2-3 times their diameter. Larger seeds like corn should be planted deeper (1-2 inches) than smaller seeds like lettuce (¼ inch).</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Seed Spacing</h4>
                        <p className="text-sm">Proper spacing ensures plants have enough room to grow. Follow the recommended spacing on the seed packet or use our calculator for common crops.</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Seed Quality Considerations</h4>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          <li>Germination rate: Adjust quantities for seeds with lower germination rates</li>
                          <li>Seed size: Larger varieties may require different seeding rates</li>
                          <li>Production goal: Higher density for smaller fruits, wider spacing for larger produce</li>
                          <li>Climate conditions: Some conditions may require overseeding</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="catalog">
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">🌱 Full Catalog – Seed Guide</h3>
                    <p className="text-muted-foreground">Complete collection of seeds for all your farming needs</p>
                  </div>

                  {/* Vegetables Section */}
                  <div className="glass-card p-6">
                    <h4 className="text-xl font-semibold mb-6 text-green-600 dark:text-green-400">1. Vegetables</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&q=80"
                          alt="Tomato Hybrid Red King"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Tomato (Hybrid Red King)</h5>
                          <p className="text-sm text-muted-foreground mb-3">High-yield hybrid variety with firm, bright red fruits.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 70–80 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Well-drained loamy soil, warm climate</div>
                            <div><span className="font-medium">Yield Potential:</span> 25–30 tons/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Requires staking; regular watering needed</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80"
                          alt="Spinach Green Glory"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Spinach (Green Glory)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Fast-growing leafy vegetable, rich in iron.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 35–40 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Prefers cool climate, moist sandy-loam soil</div>
                            <div><span className="font-medium">Yield Potential:</span> 10–12 tons/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Continuous harvesting possible by cutting outer leaves</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80"
                          alt="Potato"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Potato (Kufri Jyoti)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Popular table variety with smooth skin and high starch content.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 90–110 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Cool climate, well-drained loamy soil</div>
                            <div><span className="font-medium">Yield Potential:</span> 15–20 tons/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Earthing up required; avoid waterlogging</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1566842600175-97dca489844f?w=600&q=80"
                          alt="Onion"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Onion (Nasik Red)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Deep red bulbs with pungent flavour, excellent shelf life.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 120–130 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Dry climate, well-drained sandy loam</div>
                            <div><span className="font-medium">Yield Potential:</span> 12–18 tons/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Reduce irrigation 2 weeks before harvest</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Fruits Section */}
                  <div className="glass-card p-6">
                    <h4 className="text-xl font-semibold mb-6 text-orange-600 dark:text-orange-400">2. Fruits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80"
                          alt="Watermelon Sugar Star"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Watermelon (Sugar Star)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Sweet, large-sized fruits with bright red flesh.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 90–100 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Hot climate, sandy-loam soil with good drainage</div>
                            <div><span className="font-medium">Yield Potential:</span> 30–35 tons/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Requires full sun; avoid waterlogging</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=600&q=80"
                          alt="Papaya Golden Sunrise"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Papaya (Golden Sunrise)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Medium-height variety with yellow-orange pulp, good for table use.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 9–11 months for fruiting</div>
                            <div><span className="font-medium">Climate/Soil:</span> Tropical climate, well-drained sandy loam soil</div>
                            <div><span className="font-medium">Yield Potential:</span> 40–60 kg per plant annually</div>
                            <div><span className="font-medium">Care Tips:</span> Protect from frost; irrigation at regular intervals</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=80"
                          alt="Mango Alphonso"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Mango (Alphonso)</h5>
                          <p className="text-sm text-muted-foreground mb-3">King of mangoes — rich aroma, sweet pulp, premium export quality.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 3–5 years (first fruit)</div>
                            <div><span className="font-medium">Climate/Soil:</span> Tropical, deep well-drained alluvial soil</div>
                            <div><span className="font-medium">Yield Potential:</span> 100–200 fruits/tree/year</div>
                            <div><span className="font-medium">Care Tips:</span> Prune after harvest; apply potash before flowering</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80"
                          alt="Banana"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Banana (Grand Naine)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Dwarf Cavendish type, high bunch weight, disease resistant.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 11–13 months</div>
                            <div><span className="font-medium">Climate/Soil:</span> Humid tropical, rich loamy soil</div>
                            <div><span className="font-medium">Yield Potential:</span> 25–35 tons/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Remove suckers; prop bunches to prevent lodging</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Flowers Section */}
                  <div className="glass-card p-6">
                    <h4 className="text-xl font-semibold mb-6 text-pink-600 dark:text-pink-400">3. Flowers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=80"
                          alt="Marigold Orange Delight"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Marigold (Orange Delight)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Popular ornamental flower with bright orange blooms.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 60–70 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Grows well in sandy-loam soil; moderate climate</div>
                            <div><span className="font-medium">Yield Potential:</span> 12–15 tons of flowers/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Pinching improves branching and flower size</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&q=80"
                          alt="Sunflower Golden Shine"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Sunflower (Golden Shine)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Large, bright yellow flowers, also grown for seeds.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 90–100 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Warm climate, fertile loam soil with good drainage</div>
                            <div><span className="font-medium">Yield Potential:</span> 8–10 quintals seeds/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Ensure spacing for large flower heads</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=600&q=80"
                          alt="Rose"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Rose (Hybrid Tea)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Classic cut flower with large blooms and long stems.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 45–60 days (first flush)</div>
                            <div><span className="font-medium">Climate/Soil:</span> Mild climate, well-drained fertile loam</div>
                            <div><span className="font-medium">Yield Potential:</span> 80,000–1,00,000 stems/acre/year</div>
                            <div><span className="font-medium">Care Tips:</span> Prune after each flush; spray for black spot</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                          alt="Jasmine"
                          className="w-full h-44 object-cover object-top"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Jasmine (Mogra)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Fragrant white flowers, high demand for garlands and perfume.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 6–8 months (first bloom)</div>
                            <div><span className="font-medium">Climate/Soil:</span> Warm humid climate, well-drained loamy soil</div>
                            <div><span className="font-medium">Yield Potential:</span> 3–5 tons/acre/year</div>
                            <div><span className="font-medium">Care Tips:</span> Prune after flowering season; apply organic manure</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Field Crops Section */}
                  <div className="glass-card p-6">
                    <h4 className="text-xl font-semibold mb-6 text-yellow-600 dark:text-yellow-400">4. Field Crops</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80"
                          alt="Wheat"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Wheat (HD-2967)</h5>
                          <p className="text-sm text-muted-foreground mb-3">High-yielding certified wheat, resistant to rust and lodging.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 120–130 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Cool dry climate, loamy soil</div>
                            <div><span className="font-medium">Yield Potential:</span> 18–22 quintals/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Irrigate at crown root initiation stage</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80"
                          alt="Rice"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Rice (Pusa Basmati 1121)</h5>
                          <p className="text-sm text-muted-foreground mb-3">Premium long-grain basmati with excellent aroma and export demand.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 140–145 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Humid, clay or clay-loam soil</div>
                            <div><span className="font-medium">Yield Potential:</span> 15–18 quintals/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Maintain 2–5 cm standing water; weed at 20 days</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80"
                          alt="Corn Maize"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Corn / Maize (DKC 9144)</h5>
                          <p className="text-sm text-muted-foreground mb-3">High-yield hybrid maize with strong stalk and disease tolerance.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 95–105 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Warm climate, well-drained fertile loam</div>
                            <div><span className="font-medium">Yield Potential:</span> 25–30 quintals/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Top-dress urea at knee-height stage</div>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-xl overflow-hidden bg-background/50 hover:shadow-md transition-shadow">
                        <img
                          src="https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?w=600&q=80"
                          alt="Soybean"
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4">
                          <h5 className="font-medium text-lg mb-1">Soybean (JS 335)</h5>
                          <p className="text-sm text-muted-foreground mb-3">High protein content, suitable for oil extraction and animal feed.</p>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Growth Duration:</span> 95–100 days</div>
                            <div><span className="font-medium">Climate/Soil:</span> Warm humid, well-drained black cotton soil</div>
                            <div><span className="font-medium">Yield Potential:</span> 10–14 quintals/acre</div>
                            <div><span className="font-medium">Care Tips:</span> Seed treatment with Rhizobium culture improves yield</div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SeedGuide;
