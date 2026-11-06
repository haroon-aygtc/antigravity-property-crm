import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, DollarSign, Home, Palette, Check, ArrowRight, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock Data for Recommendations
const recommendedProperties = [
    {
        id: 1,
        title: "Modern Minimalist Villa",
        location: "Beverly Hills, CA",
        price: "$3,200,000",
        matchScore: 98,
        image: "https://images.unsplash.com/photo-1600596542815-2495db98dada?q=80&w=800&auto=format&fit=crop",
        tags: ["Modern", "Pool", "View"]
    },
    {
        id: 2,
        title: "Urban Loft Penthouse",
        location: "Downtown LA",
        price: "$1,850,000",
        matchScore: 92,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
        tags: ["Luxury", "City View", "Smart Home"]
    },
    {
        id: 3,
        title: "Seaside Contemporary",
        location: "Malibu, CA",
        price: "$5,500,000",
        matchScore: 88,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
        tags: ["Beachfront", "Private", "Spacious"]
    }
];

const steps = [
    {
        id: 'location',
        title: "Where are you looking to live?",
        icon: MapPin,
        options: ["Los Angeles", "New York", "Miami", "San Francisco", "Chicago", "Austin"]
    },
    {
        id: 'budget',
        title: "What is your budget range?",
        icon: DollarSign,
        options: ["$500k - $1M", "$1M - $3M", "$3M - $5M", "$5M+", "Flexible"]
    },
    {
        id: 'type',
        title: "What type of property?",
        icon: Home,
        options: ["House", "Apartment", "Villa", "Condo", "Penthouse"]
    },
    {
        id: 'style',
        title: "Preferred architectural style?",
        icon: Palette,
        options: ["Modern", "Contemporary", "Traditional", "Mediterranean", "Industrial"]
    }
];

export function AiRecommendationModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleOptionSelect = (option: string) => {
        setAnswers(prev => ({ ...prev, [steps[currentStep].id]: option }));
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            analyzePreferences();
        }
    };

    const analyzePreferences = () => {
        setIsAnalyzing(true);
        // Simulate AI analysis
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowResults(true);
        }, 2000);
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers({});
        setShowResults(false);
        setIsAnalyzing(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) resetQuiz();
        }}>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white shadow-lg shadow-blue-500/25 border-0"
                >
                    <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                    AI Property Match
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/10">
                <div className="relative h-[600px] flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle>AI Concierge</DialogTitle>
                                <p className="text-xs text-muted-foreground">Powered by Antigravity AI</p>
                            </div>
                        </div>
                        <DialogClose className="rounded-full p-2 hover:bg-muted transition-colors">
                            <X className="h-4 w-4" />
                        </DialogClose>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {!showResults && !isAnalyzing && (
                                <motion.div
                                    key="quiz"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                            <span>Step {currentStep + 1} of {steps.length}</span>
                                            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                                        </div>
                                        <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
                                    </div>

                                    <div className="text-center space-y-4 py-4">
                                        {React.createElement(steps[currentStep].icon, { className: "h-12 w-12 mx-auto text-primary opacity-80" })}
                                        <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {steps[currentStep].options.map((option) => (
                                            <Button
                                                key={option}
                                                variant="outline"
                                                className="h-14 text-lg hover:border-primary hover:bg-primary/5 transition-all justify-start px-6"
                                                onClick={() => handleOptionSelect(option)}
                                            >
                                                {option}
                                            </Button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {isAnalyzing && (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-full space-y-6 text-center"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full" />
                                        <Sparkles className="h-16 w-16 text-primary animate-spin-slow" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Analyzing Market Data...</h3>
                                    <p className="text-muted-foreground max-w-xs">
                                        Our AI is scanning thousands of properties to find your perfect match based on {answers.location} preferences.
                                    </p>
                                </motion.div>
                            )}

                            {showResults && (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Top Matches for You</h3>
                                        <Button variant="ghost" size="sm" onClick={resetQuiz} className="text-muted-foreground">
                                            Retake Quiz
                                        </Button>
                                    </div>

                                    <ScrollArea className="h-[400px] pr-4">
                                        <div className="space-y-4">
                                            {recommendedProperties.map((property, index) => (
                                                <motion.div
                                                    key={property.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all group cursor-pointer">
                                                        <div className="flex flex-col sm:flex-row">
                                                            <div className="relative w-full sm:w-40 h-32">
                                                                <img
                                                                    src={property.image}
                                                                    alt={property.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <div className="absolute top-2 left-2">
                                                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0 shadow-lg">
                                                                        {property.matchScore}% Match
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <CardContent className="flex-1 p-4 flex flex-col justify-between">
                                                                <div>
                                                                    <div className="flex justify-between items-start">
                                                                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                                            {property.title}
                                                                        </h4>
                                                                        <span className="font-bold text-primary">{property.price}</span>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                                        <MapPin className="h-3 w-3" /> {property.location}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center justify-between mt-3">
                                                                    <div className="flex gap-2">
                                                                        {property.tags.map(tag => (
                                                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                                                {tag}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                    <Button size="sm" variant="ghost" className="group-hover:translate-x-1 transition-transform">
                                                                        View <ArrowRight className="ml-1 h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </ScrollArea>

                                    <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <MessageSquare className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Want to refine these results?</p>
                                            <p className="text-xs text-muted-foreground">Chat with our AI assistant for more specific needs.</p>
                                        </div>
                                        <Button size="sm">Start Chat</Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
