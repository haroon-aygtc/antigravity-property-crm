import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Sarah Thompson",
        role: "Home Buyer",
        content: "Antigravity made finding our dream home an absolute breeze. Their AI-powered recommendations were spot on!",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
    },
    {
        name: "James Wilson",
        role: "Property Investor",
        content: "The market insights provided by this platform are unmatched. I've closed 3 deals this year thanks to their data.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
        name: "Emily Chen",
        role: "Seller",
        content: "Sold my property in record time above asking price. The marketing tools available here are incredible.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop"
    },
    {
        name: "Michael Brown",
        role: "First-time Buyer",
        content: "I was overwhelmed by the process until I found Antigravity. Their team guided me every step of the way.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    }
];

export function TestimonialCarousel() {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
        >
            <CarouselContent className="-ml-2 md:-ml-4">
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm h-full">
                                <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                                    <Quote className="h-8 w-8 text-primary/20" />
                                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                                    <div className="flex items-center gap-3 mt-auto pt-4">
                                        <Avatar className="h-10 w-10 border-2 border-primary">
                                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="text-left">
                                            <p className="font-semibold text-sm">{testimonial.name}</p>
                                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
