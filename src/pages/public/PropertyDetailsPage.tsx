import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, ArrowLeft, Share2, Heart, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PropertyMap } from '@/components/maps/PropertyMap';
import { ContactForm } from '@/components/forms/ContactForm';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

// Mock Data (In a real app, fetch based on ID)
const getProperty = (id: string) => ({
    id,
    title: "Modern Luxury Villa",
    location: "Beverly Hills, CA",
    price: "$4,500,000",
    description: "Experience the pinnacle of luxury living in this stunning modern villa located in the heart of Beverly Hills. Featuring panoramic city views, a private infinity pool, and state-of-the-art smart home technology, this property offers an unparalleled lifestyle.",
    beds: 5,
    baths: 4,
    sqft: 4200,
    images: [
        "https://images.unsplash.com/photo-1600596542815-2495db98dada?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
    ],
    features: [
        "Smart Home System", "Infinity Pool", "Home Theater", "Wine Cellar",
        "Gourmet Kitchen", "Spa & Gym", "3-Car Garage", "Security System"
    ],
    agent: {
        name: "Sarah Johnson",
        phone: "+1 (555) 123-4567",
        email: "sarah@antigravity.com",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
    }
});

export default function PropertyDetailsPage() {
    const { id } = useParams();
    const property = getProperty(id || '1');
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb & Actions */}
                <div className="flex justify-between items-center mb-6">
                    <Link to="/properties">
                        <Button variant="ghost" className="gap-2 hover:bg-muted/50">
                            <ArrowLeft className="h-4 w-4" /> Back to Properties
                        </Button>
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="hover:bg-muted/50">
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="hover:bg-muted/50">
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 h-[500px]">
                    <div className="lg:col-span-2 h-full rounded-2xl overflow-hidden relative group shadow-sm">
                        <img
                            src={property.images[activeImage]}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                            View All Photos
                        </div>
                    </div>
                    <div className="hidden lg:grid grid-rows-2 gap-4 h-full">
                        {property.images.slice(1, 3).map((img, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl overflow-hidden cursor-pointer relative group shadow-sm"
                                onClick={() => setActiveImage(idx + 1)}
                            >
                                <img
                                    src={img}
                                    alt={`View ${idx + 2}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2 tracking-tight">{property.title}</h1>
                                    <div className="flex items-center gap-2 text-muted-foreground text-lg">
                                        <MapPin className="h-5 w-5 text-primary" /> {property.location}
                                    </div>
                                </div>
                                <div className="text-left md:text-right">
                                    <h2 className="text-3xl font-bold text-primary">{property.price}</h2>
                                    <Badge variant="secondary" className="mt-2 text-lg px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 border-0">For Sale</Badge>
                                </div>
                            </div>

                            <div className="flex gap-12 border-y py-8">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-2">
                                        <Bed className="h-6 w-6 text-primary" />
                                        <span className="text-2xl font-bold">{property.beds}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Beds</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-2">
                                        <Bath className="h-6 w-6 text-primary" />
                                        <span className="text-2xl font-bold">{property.baths}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Baths</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-2">
                                        <Square className="h-6 w-6 text-primary" />
                                        <span className="text-2xl font-bold">{property.sqft.toLocaleString()}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Sq Ft</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">About this home</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {property.description}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">Features & Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {property.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                                        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                                        <span className="font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold">Location</h3>
                            <PropertyMap location={{ lat: 34.0736, lng: -118.4004 }} className="h-[400px] w-full rounded-2xl shadow-sm" />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="relative h-full">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-card p-6 rounded-2xl border shadow-lg">
                                <div className="flex items-center gap-4 mb-6">
                                    <img
                                        src={property.agent.image}
                                        alt={property.agent.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                                    />
                                    <div>
                                        <h4 className="font-bold text-lg">{property.agent.name}</h4>
                                        <p className="text-sm text-muted-foreground">Listing Agent</p>
                                    </div>
                                </div>

                                <ContactForm />

                                <div className="mt-6 pt-6 border-t space-y-4">
                                    <Button variant="outline" className="w-full gap-2 h-12 text-base font-medium">
                                        <Calendar className="h-4 w-4" /> Schedule Tour
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
