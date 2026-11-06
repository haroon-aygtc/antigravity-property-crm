import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function PublicFooter() {
    return (
        <footer className="bg-card text-card-foreground border-t">
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-xl">A</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Antigravity</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Redefining luxury real estate with cutting-edge technology and unparalleled service. Find your dream home with us.
                        </p>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                                <Facebook className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                                <Linkedin className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/home" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/properties" className="text-muted-foreground hover:text-primary transition-colors">Properties</Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Market Insights</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold uppercase tracking-wider">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-muted-foreground">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span>123 Luxury Lane, Beverly Hills,<br />CA 90210, USA</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>contact@antigravity.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold uppercase tracking-wider">Newsletter</h3>
                        <p className="text-muted-foreground">
                            Subscribe to our newsletter for the latest market trends and exclusive listings.
                        </p>
                        <form className="space-y-2">
                            <Input placeholder="Enter your email" className="bg-background" />
                            <Button className="w-full">Subscribe</Button>
                        </form>
                    </div>
                </div>

                <Separator className="my-12" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
                    <p>© 2024 Antigravity Real Estate. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link to="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
