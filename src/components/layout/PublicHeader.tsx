import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Bell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AiRecommendationModal } from '@/components/ai/AiRecommendationModal';

export function PublicHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/home' },
        { name: 'Properties', path: '/properties' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-background/80 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/home" className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xl">A</span>
                        </div>
                        <span className={cn(
                            "text-2xl font-bold tracking-tight transition-colors",
                            isScrolled ? "text-foreground" : "text-white"
                        )}>
                            Antigravity
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary relative group",
                                    location.pathname === link.path
                                        ? "text-primary"
                                        : isScrolled ? "text-foreground/80" : "text-white/90"
                                )}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary"
                                    />
                                )}
                                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className={cn(
                            "relative transition-colors",
                            isScrolled ? "text-foreground" : "text-white"
                        )}>
                            <Search className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
                        </div>

                        <ThemeToggle />

                        <Button
                            variant={isScrolled ? "default" : "secondary"}
                            className="font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        >
                            Book a Call
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu className={isScrolled ? "text-foreground" : "text-white"} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-background border-t"
                >
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="block text-lg font-medium py-2 hover:text-primary transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 border-t flex flex-col gap-4">
                            <Button className="w-full">Book a Call</Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}
