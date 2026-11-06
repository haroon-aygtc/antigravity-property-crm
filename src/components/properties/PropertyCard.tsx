import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PropertyMap } from '@/components/maps/PropertyMap';

export interface Property {
    id: number | string;
    title: string;
    location: string;
    price: number | string;
    beds: number;
    baths: number;
    sqft: number;
    images: string[];
    type: string;
    status: string;
}

interface PropertyCardProps {
    property: Property;
    viewMode?: 'grid' | 'list';
    index?: number;
}

export function PropertyCard({ property, viewMode = 'grid', index = 0 }: PropertyCardProps) {
    // Ensure price is formatted
    const formattedPrice = typeof property.price === 'number'
        ? `$${property.price.toLocaleString()}`
        : property.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            layout
            className="h-full"
        >
            <Card className={`group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col ${viewMode === 'list' ? 'md:flex-row' : ''}`}>
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-full md:w-1/3 h-64 md:h-auto' : 'h-64'}`}>
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-primary/90 hover:bg-primary text-white border-0 backdrop-blur-sm">
                            {property.status}
                        </Badge>
                    </div>

                    {/* Quick View Trigger */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <Eye className="h-4 w-4" /> Quick View
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-xl">
                                <DialogHeader>
                                    <DialogTitle>{property.title}</DialogTitle>
                                    <DialogDescription>{property.location}</DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                                    <div className="space-y-4">
                                        <div className="aspect-video rounded-lg overflow-hidden">
                                            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                                        </div>
                                        <PropertyMap location={{ lat: 34.0736, lng: -118.4004 }} />
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-3xl font-bold text-primary">{formattedPrice}</h3>
                                            <p className="text-lg text-muted-foreground mt-2">
                                                Experience luxury living in this stunning {property.type.toLowerCase()} located in the heart of {property.location}.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                                                <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <span className="font-bold block">{property.beds}</span>
                                                <span className="text-xs text-muted-foreground">Beds</span>
                                            </div>
                                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                                                <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <span className="font-bold block">{property.baths}</span>
                                                <span className="text-xs text-muted-foreground">Baths</span>
                                            </div>
                                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                                                <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <span className="font-bold block">{property.sqft}</span>
                                                <span className="text-xs text-muted-foreground">Sq Ft</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex gap-4">
                                            <Button className="flex-1" size="lg">Schedule Viewing</Button>
                                            <Link to={`/properties/${property.id}`} className="flex-1">
                                                <Button variant="outline" className="w-full" size="lg">Full Details</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Link to={`/properties/${property.id}`}>
                            <Button variant="secondary" className="gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">
                                <ArrowRight className="h-4 w-4" /> Details
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col flex-1">
                    <CardContent className="p-6 space-y-4 flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{property.title}</h3>
                                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="text-sm">{property.location}</span>
                                </div>
                            </div>
                            <Badge variant="outline">{property.type}</Badge>
                        </div>
                        <p className="text-2xl font-bold text-primary">{formattedPrice}</p>
                    </CardContent>

                    <CardFooter className="p-6 pt-0 border-t bg-muted/5 mt-auto">
                        <div className="flex justify-between w-full text-sm text-muted-foreground pt-4">
                            <div className="flex items-center gap-1">
                                <Bed className="h-4 w-4" /> {property.beds} Beds
                            </div>
                            <div className="flex items-center gap-1">
                                <Bath className="h-4 w-4" /> {property.baths} Baths
                            </div>
                            <div className="flex items-center gap-1">
                                <Square className="h-4 w-4" /> {property.sqft} sqft
                            </div>
                        </div>
                    </CardFooter>
                </div>
            </Card>
        </motion.div>
    );
}
