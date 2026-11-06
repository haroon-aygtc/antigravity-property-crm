import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Star, TrendingUp, Shield, Home as HomeIcon, CheckCircle, Mail, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MortgageCalculator } from '@/components/tools/MortgageCalculator';
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel';
import { PropertyCard, Property } from '@/components/properties/PropertyCard';
import { AiRecommendationModal } from '@/components/ai/AiRecommendationModal';

export default function HomePage() {
  const featuredProperties: Property[] = [
    {
      id: 101,
      title: "Modern Luxury Villa",
      location: "Beverly Hills, CA",
      price: "$4,500,000",
      beds: 5,
      baths: 4,
      sqft: 4200,
      type: "Villa",
      status: "Featured",
      images: [
        "https://images.unsplash.com/photo-1600596542815-2495db98dada?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      id: 102,
      title: "Waterfront Mansion",
      location: "Miami Beach, FL",
      price: "$6,200,000",
      beds: 6,
      baths: 5,
      sqft: 5500,
      type: "Mansion",
      status: "For Sale",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-2495db98dada?q=80&w=800&auto=format&fit=crop"
      ]
    },
    {
      id: 103,
      title: "Penthouse Suite",
      location: "New York, NY",
      price: "$3,800,000",
      beds: 3,
      baths: 3,
      sqft: 2800,
      type: "Penthouse",
      status: "New",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop"
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Modern Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <Badge variant="secondary" className="px-4 py-2 text-sm uppercase tracking-widest bg-white/10 text-white backdrop-blur-md border-white/20">
              The Future of Real Estate
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Discover Your <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Dream Home</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Experience the pinnacle of luxury living with our curated collection of exclusive properties.
            </p>

            <div className="flex justify-center pt-8">
              <AiRecommendationModal />
            </div>

            {/* Search Box */}
            <div className="bg-background/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl max-w-3xl mx-auto mt-12 border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative col-span-2">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by location, property type..."
                    className="pl-10 h-12 bg-transparent border-muted"
                  />
                </div>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="lg" className="h-12 text-lg font-semibold">
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Properties Sold', value: '1,200+', icon: HomeIcon },
              { label: 'Happy Clients', value: '98%', icon: Star },
              { label: 'Years Experience', value: '15+', icon: TrendingUp },
              { label: 'Awards Won', value: '24', icon: Shield },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-2 p-6 rounded-2xl hover:bg-muted/50 transition-colors"
              >
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-4xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-muted-foreground font-medium uppercase tracking-wide text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Featured Properties</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Explore our hand-picked selection of premium properties available for sale.
              </p>
            </div>
            <Button variant="outline" className="hidden md:flex gap-2">
              View All Properties <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((prop, i) => (
              <PropertyCard key={i} property={prop} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Button variant="outline" className="w-full gap-2">
              View All Properties <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your journey to homeownership made simple and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Search", desc: "Browse our extensive list of properties with advanced filters.", icon: Search },
              { title: "Connect", desc: "Schedule viewings and connect with our expert agents.", icon: Mail },
              { title: "Close", desc: "Secure your dream home with our seamless closing process.", icon: CheckCircle },
            ].map((step, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-muted/20 border hover:border-primary/50 transition-colors text-center group">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mortgage Calculator Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">Calculate Your Mortgage</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Use our advanced mortgage calculator to estimate your monthly payments. Adjust the loan amount, down payment, interest rate, and loan term to see how they affect your monthly costs.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time payment estimation",
                  "Adjustable interest rates",
                  "Down payment flexibility",
                  "Tax and insurance inclusion options"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-4">
                Get Pre-Approved
              </Button>
            </div>
            <div>
              <MortgageCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* AI Valuation CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/90">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <Sparkles className="h-12 w-12 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What's Your Home Worth?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Get an instant AI-powered valuation of your property based on current market trends and data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              placeholder="Enter your property address"
              className="bg-white text-foreground h-12"
            />
            <Button size="lg" variant="secondary" className="h-12 font-bold">
              Get Estimate
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Client Success Stories</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from our satisfied clients who found their perfect match with Antigravity.
            </p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="text-muted-foreground">
              Subscribe to our newsletter to receive the latest property listings, market insights, and exclusive offers directly to your inbox.
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email address" className="bg-background" />
              <Button type="submit">Subscribe</Button>
            </form>
            <p className="text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to Find Your Dream Home?</h2>
            <p className="text-xl text-muted-foreground">
              Let our expert team guide you through the process of finding the perfect property that matches your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 h-14">
                Browse Properties
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                Contact an Agent
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
