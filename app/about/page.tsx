"use client";

import { motion } from "framer-motion";
import { Cloud, Shield, Zap, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 radial-gradient-bg opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="outline" className="mb-4">About Us</Badge>
            <h1 className="text-5xl font-bold mb-6">
              Built for the future of{" "}
              <span className="gradient-text">cloud storage</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Soft Drive was founded with a simple mission: make enterprise-grade cloud storage
              accessible to every team, regardless of size. We believe great software should be
              both powerful and beautiful.
            </p>
          </motion.div>
        </div>
      </section>
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Shield, title: "Security First", description: "We built security into every layer of our platform. Your data is encrypted, protected, and under your control at all times." },
              { icon: Zap, title: "Performance Obsessed", description: "Our global CDN ensures your files load instantly, no matter where you or your team is in the world." },
              { icon: Users, title: "Team Focused", description: "We design every feature with collaboration in mind, making it easy for teams to share and work together." },
              { icon: Cloud, title: "Always Available", description: "99.99% uptime SLA with redundant infrastructure across multiple regions for maximum reliability." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border bg-card"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
