import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Trophy, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Modern Office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto text-white/80"
          >
            Redefining the luxury real estate experience through innovation, integrity, and unparalleled service.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">A Legacy of Excellence</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded in 2010, Antigravity has established itself as the premier destination for luxury real estate. We believe that finding a home is more than just a transaction; it's about finding a space that reflects your aspirations and lifestyle.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our team of dedicated professionals combines deep market knowledge with cutting-edge technology to deliver results that exceed expectations. Whether you're buying, selling, or investing, we are your trusted partners in the journey.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Shield, title: 'Integrity', desc: 'Trust is our foundation' },
                { icon: Users, title: 'Client Focus', desc: 'Your success is ours' },
                { icon: Trophy, title: 'Excellence', desc: 'Setting the standard' },
                { icon: Target, title: 'Innovation', desc: 'Future-forward approach' },
              ].map((item, i) => (
                <Card key={i} className="border-0 shadow-lg bg-muted/30">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The industry's best and brightest, dedicated to your real estate success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
              { name: 'Michael Chen', role: 'Head of Sales', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop' },
              { name: 'Emily Davis', role: 'Lead Broker', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop' },
            ].map((member, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[3/4]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-white/80">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
