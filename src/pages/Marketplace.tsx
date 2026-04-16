import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Search, MapPin, Phone, Star, Plus, Tractor, Users, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ListingCategory = 'seeds' | 'tools' | 'equipment' | 'labor' | 'tractor';

interface Listing {
  id: string;
  title: string;
  category: ListingCategory;
  price: string;
  unit: string;
  seller: string;
  location: string;
  rating: number;
  available: boolean;
  description: string;
  image: string;
}

const listings: Listing[] = [
  { id: '1', title: 'Hybrid Wheat Seeds (HD-2967)', category: 'seeds', price: '₹1,200', unit: '/bag (30kg)', seller: 'Ramesh Agro Store', location: 'Ludhiana, Punjab', rating: 4.5, available: true, description: 'High-yielding certified wheat seeds. Resistant to rust and lodging.', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80' },
  { id: '2', title: 'Rotavator (48 Blades)', category: 'equipment', price: '₹800', unit: '/day rental', seller: 'Singh Equipment', location: 'Amritsar, Punjab', rating: 4.8, available: true, description: 'Heavy-duty rotavator for soil preparation. Fits 45-55 HP tractors.', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&q=80' },
  { id: '3', title: 'Mahindra 575 DI Tractor', category: 'tractor', price: '₹1,500', unit: '/day rental', seller: 'Verma Tractors', location: 'Bhopal, MP', rating: 4.6, available: true, description: '47 HP tractor available for rent. Includes operator. Fuel extra.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80' },
  { id: '4', title: 'Harvesting Labor Team (5 workers)', category: 'labor', price: '₹2,500', unit: '/day', seller: 'Amit Labor Contractor', location: 'Indore, MP', rating: 4.3, available: true, description: 'Experienced harvesting team. Available for wheat, rice, and soybean.', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&q=80' },
  { id: '5', title: 'Drip Irrigation Kit (1 acre)', category: 'tools', price: '₹8,500', unit: '/set', seller: 'AquaTech Agri', location: 'Nashik, Maharashtra', rating: 4.7, available: true, description: 'Complete drip irrigation kit with pipes, emitters, and filter. Easy installation.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80' },
  { id: '6', title: 'BT Cotton Seeds (Bollgard II)', category: 'seeds', price: '₹950', unit: '/packet (450g)', seller: 'Kaveri Seeds Dealer', location: 'Nagpur, Maharashtra', rating: 4.4, available: false, description: 'Bollworm resistant BT cotton seeds. High ginning percentage.', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80' },
  { id: '7', title: 'Sprayer (16L Battery)', category: 'tools', price: '₹3,200', unit: '/unit', seller: 'Kisan Tools Hub', location: 'Jaipur, Rajasthan', rating: 4.2, available: true, description: 'Battery-powered knapsack sprayer. 16L capacity, 8-hour battery life.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80' },
  { id: '8', title: 'Sowing Labor (2 workers)', category: 'labor', price: '₹700', unit: '/day', seller: 'Priya Labor Services', location: 'Varanasi, UP', rating: 4.1, available: true, description: 'Skilled sowing workers for vegetable and field crops.', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&q=80' },
];

const categoryIcons: Record<ListingCategory, React.ReactNode> = {
  seeds: <span>🌱</span>,
  tools: <Wrench className="h-4 w-4" />,
  equipment: <span>⚙️</span>,
  labor: <Users className="h-4 w-4" />,
  tractor: <Tractor className="h-4 w-4" />,
};

const categoryColors: Record<ListingCategory, string> = {
  seeds: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  tools: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  equipment: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  labor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  tractor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
};

const Marketplace = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { toast } = useToast();

  const filtered = listings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || l.category === category;
    return matchSearch && matchCat;
  });

  const handleContact = (seller: string) => {
    toast({ title: 'Contact Request Sent', description: `Your inquiry has been sent to ${seller}. They will contact you shortly.` });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-3 py-1 text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-3">
              <ShoppingBag className="h-4 w-4" />
              <span>Farmer Marketplace</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Farm Marketplace & Resource Sharing</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Buy/sell seeds, tools, equipment. Rent tractors, hire labor, and share farm resources.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="glass-card rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-9" placeholder="Search seeds, tools, tractors, labor..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="seeds">Seeds</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="labor">Labor</SelectItem>
                <SelectItem value="tractor">Tractor Rental</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Post Listing
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {(['seeds', 'tools', 'equipment', 'labor', 'tractor'] as ListingCategory[]).map(cat => (
              <div key={cat} className={`rounded-xl p-3 text-center ${categoryColors[cat]}`}>
                <div className="flex justify-center mb-1">{categoryIcons[cat]}</div>
                <p className="text-lg font-bold">{listings.filter(l => l.category === cat).length}</p>
                <p className="text-xs capitalize">{cat}</p>
              </div>
            ))}
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(listing => (
              <Card key={listing.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${!listing.available ? 'opacity-60' : ''}`}>
                <div className="h-36 overflow-hidden">
                  <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="font-semibold text-sm leading-tight">{listing.title}</h3>
                    {!listing.available && <Badge variant="secondary" className="text-xs shrink-0">Sold Out</Badge>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 mb-2 ${categoryColors[listing.category]}`}>
                    {categoryIcons[listing.category]} {listing.category}
                  </span>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-green-600">{listing.price}<span className="text-xs font-normal text-gray-500">{listing.unit}</span></span>
                    <div className="flex items-center gap-0.5 text-xs text-yellow-500">
                      <Star className="h-3 w-3 fill-current" /> {listing.rating}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {listing.location}</div>
                    <div className="mt-0.5">{listing.seller}</div>
                  </div>
                  <Button size="sm" className="w-full text-xs" disabled={!listing.available} onClick={() => handleContact(listing.seller)}>
                    <Phone className="h-3 w-3 mr-1" /> Contact Seller
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No listings found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Marketplace;
