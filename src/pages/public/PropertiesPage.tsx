import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyCard, Property } from '@/components/properties/PropertyCard';

// Enhanced Mock Data Generator with High Quality Images
const generateProperties = (startId: number, count: number): Property[] => {
  const images = [
    "https://images.unsplash.com/photo-1600596542815-2495db98dada?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513584685908-2274653fa36f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop"
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: startId + i,
    title: `Luxury Estate ${startId + i}`,
    location: 'Beverly Hills, CA',
    price: 2500000 + ((startId + i) * 100000),
    beds: 4 + (i % 3),
    baths: 3 + (i % 2),
    sqft: 2500 + (i * 100),
    images: [
      images[(startId + i) % images.length],
      images[(startId + i + 1) % images.length],
      images[(startId + i + 2) % images.length]
    ],
    type: i % 2 === 0 ? 'House' : 'Villa',
    status: 'For Sale'
  }));
};

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [properties, setProperties] = useState<Property[]>(generateProperties(1, 9));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) return;
    loadMore();
  }, [isLoading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newProperties = generateProperties(properties.length + 1, 6);
      setProperties(prev => [...prev, ...newProperties]);
      setIsLoading(false);
      if (properties.length > 30) setHasMore(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Properties Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Our Properties
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Discover our exclusive collection of luxury homes and estates.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Header & Filters */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">All Listings</h2>
              <p className="text-muted-foreground mt-2">Showing {properties.length} properties</p>
            </div>
            <div className="flex items-center gap-2 bg-background p-1 rounded-lg border">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-background p-6 rounded-xl shadow-sm border sticky top-24 z-30"
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search location..." className="pl-9" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Price Range</span>
                <span className="text-muted-foreground">${(priceRange[0] / 1000)}k - ${(priceRange[1] / 1000)}k</span>
              </div>
              <Slider
                defaultValue={[0, 5000000]}
                max={5000000}
                step={10000}
                onValueChange={setPriceRange}
                className="py-2"
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Filter className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
          </motion.div>
        </div>

        {/* Property Grid/List */}
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          : "flex flex-col gap-6"
        }>
          <AnimatePresence>
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                viewMode={viewMode}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!hasMore && (
          <div className="text-center py-12 text-muted-foreground">
            You've reached the end of the list.
          </div>
        )}
      </div>
    </div>
  );
}
