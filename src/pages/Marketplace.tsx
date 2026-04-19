import React, { useState, useRef, useCallback } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingBag, Search, MapPin, Star, Plus, Tractor, Users, Wrench, MessageCircle, X, Upload, ImageIcon, Trash2 } from 'lucide-react';
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
  whatsapp?: string;
}

const defaultListings: Listing[] = [
  { id: '1', title: 'Hybrid Wheat Seeds (HD-2967)', category: 'seeds', price: '₹1,200', unit: '/bag (30kg)', seller: 'Ramesh Agro Store', location: 'Ludhiana, Punjab', rating: 4.5, available: true, description: 'High-yielding certified wheat seeds. Resistant to rust and lodging.', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80', whatsapp: '919876543210' },
  { id: '2', title: 'Rotavator (48 Blades)', category: 'equipment', price: '₹800', unit: '/day rental', seller: 'Singh Equipment', location: 'Amritsar, Punjab', rating: 4.8, available: true, description: 'Heavy-duty rotavator for soil preparation. Fits 45-55 HP tractors.', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&q=80', whatsapp: '919812345678' },
  { id: '3', title: 'Mahindra 575 DI Tractor', category: 'tractor', price: '₹1,500', unit: '/day rental', seller: 'Verma Tractors', location: 'Bhopal, MP', rating: 4.6, available: true, description: '47 HP tractor available for rent. Includes operator. Fuel extra.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', whatsapp: '919823456789' },
  { id: '4', title: 'Harvesting Labor Team (5 workers)', category: 'labor', price: '₹2,500', unit: '/day', seller: 'Amit Labor Contractor', location: 'Indore, MP', rating: 4.3, available: true, description: 'Experienced harvesting team. Available for wheat, rice, and soybean.', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&q=80', whatsapp: '919834567890' },
  { id: '5', title: 'Drip Irrigation Kit (1 acre)', category: 'tools', price: '₹8,500', unit: '/set', seller: 'AquaTech Agri', location: 'Nashik, Maharashtra', rating: 4.7, available: true, description: 'Complete drip irrigation kit with pipes, emitters, and filter. Easy installation.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80', whatsapp: '919845678901' },
  { id: '6', title: 'BT Cotton Seeds (Bollgard II)', category: 'seeds', price: '₹950', unit: '/packet (450g)', seller: 'Kaveri Seeds Dealer', location: 'Nagpur, Maharashtra', rating: 4.4, available: false, description: 'Bollworm resistant BT cotton seeds. High ginning percentage.', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80' },
  { id: '7', title: 'Sprayer (16L Battery)', category: 'tools', price: '₹3,200', unit: '/unit', seller: 'Kisan Tools Hub', location: 'Jaipur, Rajasthan', rating: 4.2, available: true, description: 'Battery-powered knapsack sprayer. 16L capacity, 8-hour battery life.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80', whatsapp: '919856789012' },
  { id: '8', title: 'Sowing Labor (2 workers)', category: 'labor', price: '₹700', unit: '/day', seller: 'Priya Labor Services', location: 'Varanasi, UP', rating: 4.1, available: true, description: 'Skilled sowing workers for vegetable and field crops.', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&q=80', whatsapp: '919867890123' },
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

const CATEGORY_IMAGE_FALLBACKS: Record<ListingCategory, string> = {
  seeds: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=80',
  tools: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80',
  equipment: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&q=80',
  labor: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&q=80',
  tractor: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
};

// Normalize WhatsApp number: strip non-digits, ensure country code
function normalizeWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // If starts with 0, replace with 91 (India default)
  if (digits.startsWith('0')) return '91' + digits.slice(1);
  // If 10 digits (no country code), prepend 91
  if (digits.length === 10) return '91' + digits;
  return digits;
}

function buildWhatsAppUrl(whatsapp: string, productTitle: string): string {
  const number = normalizeWhatsApp(whatsapp);
  const message = encodeURIComponent(`Hi! I'm interested in your listing: "${productTitle}" on Farm Marketplace. Is it still available?`);
  return `https://wa.me/${number}?text=${message}`;
}

interface PostFormState {
  title: string;
  category: ListingCategory | '';
  price: string;
  unit: string;
  seller: string;
  location: string;
  description: string;
  whatsapp: string;
  imageFile: File | null;
  imagePreview: string; // base64 data URL or empty
}

const emptyForm: PostFormState = {
  title: '',
  category: '',
  price: '',
  unit: '',
  seller: '',
  location: '',
  description: '',
  whatsapp: '',
  imageFile: null,
  imagePreview: '',
};

const Marketplace = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [listings, setListings] = useState<Listing[]>(defaultListings);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<PostFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PostFormState, string>>>({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image file (JPG, PNG, WEBP, etc.)', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Image must be under 5MB.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setForm(prev => ({ ...prev, imageFile: file, imagePreview: preview }));
      setFormErrors(prev => ({ ...prev, imagePreview: undefined }));
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processImageFile(file);
  }, [processImageFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
    // reset so same file can be re-selected
    e.target.value = '';
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, imageFile: null, imagePreview: '' }));
  };

  const filtered = listings.filter(l => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      l.seller.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || l.category === category;
    return matchSearch && matchCat;
  });

  const handleWhatsApp = (listing: Listing) => {
    if (!listing.whatsapp) return;
    window.open(buildWhatsAppUrl(listing.whatsapp, listing.title), '_blank', 'noopener,noreferrer');
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof PostFormState, string>> = {};
    if (!form.title.trim()) errors.title = 'Product name is required';
    if (!form.category) errors.category = 'Please select a category';
    if (!form.price.trim()) errors.price = 'Price is required';
    if (!form.seller.trim()) errors.seller = 'Seller name is required';
    if (!form.location.trim()) errors.location = 'Location is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (!form.whatsapp.trim()) {
      errors.whatsapp = 'WhatsApp number is required';
    } else {
      const digits = form.whatsapp.replace(/\D/g, '');
      if (digits.length < 10) errors.whatsapp = 'Enter a valid WhatsApp number (min 10 digits)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePostListing = () => {
    if (!validateForm()) return;

    const newListing: Listing = {
      id: Date.now().toString(),
      title: form.title.trim(),
      category: form.category as ListingCategory,
      price: form.price.trim().startsWith('₹') ? form.price.trim() : `₹${form.price.trim()}`,
      unit: form.unit.trim() || '/unit',
      seller: form.seller.trim(),
      location: form.location.trim(),
      rating: 0,
      available: true,
      description: form.description.trim(),
      image: form.imagePreview || CATEGORY_IMAGE_FALLBACKS[form.category as ListingCategory],
      whatsapp: form.whatsapp.trim(),
    };

    setListings(prev => [newListing, ...prev]);
    setShowModal(false);
    setForm(emptyForm);
    setFormErrors({});
    toast({
      title: '✅ Listing Posted!',
      description: `"${newListing.title}" is now live. Buyers can reach you on WhatsApp.`,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm(emptyForm);
    setFormErrors({});
  };

  const field = (key: keyof PostFormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (formErrors[key]) setFormErrors(prev => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full px-3 py-1 text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-3">
              <ShoppingBag className="h-4 w-4" />
              <span>Farmer Marketplace</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Farm Marketplace & Resource Sharing</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Buy/sell seeds, tools, equipment. Rent tractors, hire labor, and share farm resources.
              Connect directly with sellers via WhatsApp.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="glass-card rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder="Search seeds, tools, tractors, labor..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="seeds">Seeds</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="labor">Labor</SelectItem>
                <SelectItem value="tractor">Tractor Rental</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => setShowModal(true)}
            >
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
              <Card
                key={listing.id}
                className={`overflow-hidden hover:shadow-lg transition-shadow ${!listing.available ? 'opacity-60' : ''}`}
              >
                <div className="h-36 overflow-hidden">
                  <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="font-semibold text-sm leading-tight">{listing.title}</h3>
                    {!listing.available && (
                      <Badge variant="secondary" className="text-xs shrink-0">Sold Out</Badge>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 mb-2 ${categoryColors[listing.category]}`}>
                    {categoryIcons[listing.category]} {listing.category}
                  </span>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-green-600">
                      {listing.price}
                      <span className="text-xs font-normal text-gray-500">{listing.unit}</span>
                    </span>
                    {listing.rating > 0 && (
                      <div className="flex items-center gap-0.5 text-xs text-yellow-500">
                        <Star className="h-3 w-3 fill-current" /> {listing.rating}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {listing.location}
                    </div>
                    <div className="mt-0.5 font-medium">{listing.seller}</div>
                    {listing.whatsapp && (
                      <div className="flex items-center gap-1 mt-0.5 text-green-600">
                        <MessageCircle className="h-3 w-3" />
                        <span>WhatsApp available</span>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp button (primary) or disabled state */}
                  {listing.whatsapp ? (
                    <Button
                      size="sm"
                      className="w-full text-xs bg-green-500 hover:bg-green-600 text-white"
                      disabled={!listing.available}
                      onClick={() => handleWhatsApp(listing)}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Chat on WhatsApp
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      disabled={!listing.available}
                    >
                      Contact Seller
                    </Button>
                  )}
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

      {/* Post Listing Modal */}
      <Dialog open={showModal} onOpenChange={open => { if (!open) handleCloseModal(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-yellow-600" />
              Post New Listing
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Product Name */}
            <div className="space-y-1">
              <Label htmlFor="title">Product / Service Name <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="e.g. Hybrid Tomato Seeds, Tractor Rental..."
                value={form.title}
                onChange={e => field('title', e.target.value)}
              />
              {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <Label>Category <span className="text-red-500">*</span></Label>
              <Select value={form.category} onValueChange={v => field('category', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seeds">🌱 Seeds</SelectItem>
                  <SelectItem value="tools">🔧 Tools</SelectItem>
                  <SelectItem value="equipment">⚙️ Equipment</SelectItem>
                  <SelectItem value="labor">👥 Labor</SelectItem>
                  <SelectItem value="tractor">🚜 Tractor Rental</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
            </div>

            {/* Price & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                <Input
                  id="price"
                  placeholder="e.g. 1200 or ₹1,200"
                  value={form.price}
                  onChange={e => field('price', e.target.value)}
                />
                {formErrors.price && <p className="text-xs text-red-500">{formErrors.price}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="unit">Unit / Period</Label>
                <Input
                  id="unit"
                  placeholder="e.g. /bag, /day, /set"
                  value={form.unit}
                  onChange={e => field('unit', e.target.value)}
                />
              </div>
            </div>

            {/* Seller Name */}
            <div className="space-y-1">
              <Label htmlFor="seller">Your Name / Shop Name <span className="text-red-500">*</span></Label>
              <Input
                id="seller"
                placeholder="e.g. Ramesh Agro Store"
                value={form.seller}
                onChange={e => field('seller', e.target.value)}
              />
              {formErrors.seller && <p className="text-xs text-red-500">{formErrors.seller}</p>}
            </div>

            {/* Location */}
            <div className="space-y-1">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Input
                id="location"
                placeholder="e.g. Ludhiana, Punjab"
                value={form.location}
                onChange={e => field('location', e.target.value)}
              />
              {formErrors.location && <p className="text-xs text-red-500">{formErrors.location}</p>}
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1">
              <Label htmlFor="whatsapp" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4 text-green-500" />
                WhatsApp Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">+</span>
                <Input
                  id="whatsapp"
                  className="pl-6"
                  placeholder="91XXXXXXXXXX or 10-digit mobile"
                  value={form.whatsapp}
                  onChange={e => field('whatsapp', e.target.value)}
                  type="tel"
                />
              </div>
              <p className="text-xs text-gray-400">
                Buyers will contact you directly on WhatsApp. Enter with country code (e.g. 919876543210) or just 10-digit number.
              </p>
              {formErrors.whatsapp && <p className="text-xs text-red-500">{formErrors.whatsapp}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Describe your product or service, quality, quantity available..."
                rows={3}
                value={form.description}
                onChange={e => field('description', e.target.value)}
              />
              {formErrors.description && <p className="text-xs text-red-500">{formErrors.description}</p>}
            </div>

            {/* Product Image Upload */}
            <div className="space-y-1">
              <Label className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4 text-blue-500" />
                Product Image <span className="text-gray-400 text-xs">(optional — max 5MB)</span>
              </Label>

              {form.imagePreview ? (
                /* Preview */
                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={form.imagePreview}
                    alt="Product preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-3 py-1.5 truncate">
                    {form.imageFile?.name}
                  </div>
                </div>
              ) : (
                /* Drop zone */
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                    ${dragOver
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10'
                    }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 5MB</p>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={handleCloseModal}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handlePostListing}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Post with WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
