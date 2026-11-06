import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, MapPin, Bed, Bath, Square, Calendar, Eye, Share2, Heart,
  Phone, Mail, ArrowLeft, Check, Maximize2
} from 'lucide-react';
import { propertiesAPI, leadsAPI } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const response = await propertiesAPI.getById(id!);
      setProperty(response.data);
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leadsAPI.create({
        ...formData,
        propertyId: id,
      });
      toast({ title: 'Inquiry sent successfully!' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast({ title: 'Failed to send inquiry', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Property not found</h2>
          <Link to="/properties">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images.length > 0 ? property.images : [
    `https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80`,
    `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80`,
    `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80`,
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RealEstate Pro</span>
          </Link>
          <Link to="/properties">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>
      </header>

      <div className="container py-8">
        {/* Image Gallery */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden"
            >
              <img
                src={images[selectedImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="secondary">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {images.slice(0, 4).map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 rounded overflow-hidden ${
                    selectedImage === i ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Inquiry Form */}
          <Card className="h-fit sticky top-24">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-4">
                ${property.price.toLocaleString()}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="I'm interested in this property..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={property.agent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${property.agent.name}`}
                    alt={property.agent.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{property.agent.name}</div>
                    <div className="text-sm text-muted-foreground">Property Agent</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  {property.agent.phone || 'Call Agent'}
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Details */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </div>
                </div>
                <Badge>{property.propertyType}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-xs text-muted-foreground">Bedrooms</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-xs text-muted-foreground">Bathrooms</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{property.area}</div>
                    <div className="text-xs text-muted-foreground">Sq Ft</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Eye className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{property.views}</div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">About This Property</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {property.description}
                    </p>
                    {property.yearBuilt && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Year Built:</span>
                            <span className="ml-2 font-semibold">{property.yearBuilt}</span>
                          </div>
                          {property.parking && (
                            <div>
                              <span className="text-muted-foreground">Parking:</span>
                              <span className="ml-2 font-semibold">{property.parking} spaces</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Property Features</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {property.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Location</h3>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>{property.address}</p>
                      <p>{property.city}, {property.state} {property.zipCode}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {property.virtualTour && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Virtual Tour</h3>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <Maximize2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
