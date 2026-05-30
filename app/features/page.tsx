"use client";

import { motion } from "framer-motion";
import {
  Shield, Zap, Share2, Users, Globe, Cpu, Video, Lock, HardDrive, Clock, Star, FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const features = [
  {
    category: "Security & Privacy",
    icon: Shield,
    color: "from-blue-500 to-blue-600",
    items: [
      "End-to-end encryption",
      "Zero-knowledge architecture",
      "SOC 2 Type II compliant",
      "GDPR compliant",
      "Two-factor authentication",
      "Audit logs",
    ],
  },
  {
    category: "File Management",
    icon: HardDrive,
    color: "from-green-500 to-emerald-600",
    items: [
      "Drag & drop upload",
      "Bulk file operations",
      "Folder organization",
      "File versioning",
      "Trash & recovery",
      "Advanced search",
    ],
  },
  {
    category: "Sharing & Collaboration",
    icon: Share2,
    color: "from-purple-500 to-violet-600",
    items: [
      "Shareable links",
      "Password protection",
      "Expiring links",
      "Permission controls",
      "Team workspaces",
      "Real-time collaboration",
    ],
  },
  {
    category: "Media & Streaming",
    icon: Video,
    color: "from-orange-500 to-red-500",
    items: [
      "Video streaming",
      "Image preview",
      "Audio player",
      "PDF viewer",
      "Video thumbnails",
      "Adaptive streaming",
    ],
  },
  {
    category: "Performance",
    icon: Zap,
    color: "from-yellow-500 to-amber-500",
    items: [
      "Global CDN (200+ locations)",
      "Chunked uploads",
      "Background uploads",
      "Resumable transfers",
      "Fast preview loading",
      "Edge caching",
    ],
  },
  {
    category: "AI Features",
    icon: Cpu,
    color: "from-cyan-500 to-blue-500",
    items: [
      "AI-powered search",
      "Smart file categorization",
      "Duplicate detection",
      "Content tagging",
      "Auto-thumbnail generation",
      "Smart suggestions",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 radial-gradient-bg opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="outline" className="mb-4">All Features</Badge>
            <h1 className="text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">store and share</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              A complete cloud storage platform with enterprise-grade security, lightning-fast performance, and beautiful design.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border bg-card hover:shadow-premium transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-4">{feature.category}</h3>
                <ul className="space-y-2.5">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
