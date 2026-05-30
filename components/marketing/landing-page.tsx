"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Cloud,
  Shield,
  Zap,
  Lock,
  Share2,
  Users,
  ChevronRight,
  Check,
  Star,
  ArrowRight,
  Play,
  HardDrive,
  Globe,
  Cpu,
  FileText,
  Image,
  Video,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingNav } from "./marketing-nav";
import { MarketingFooter } from "./marketing-footer";

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "End-to-end encryption, zero-knowledge architecture, and SOC 2 compliance keep your data safe.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Global CDN with 200+ edge nodes ensures sub-100ms response times anywhere in the world.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Share2,
    title: "Smart Sharing",
    description:
      "Granular permissions, expiring links, and password-protected shares for total control.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Real-time collaboration, version history, and team workspaces built for modern teams.",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Globe,
    title: "Access Anywhere",
    description:
      "Web, mobile, and desktop apps. Your files sync seamlessly across all your devices.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Cpu,
    title: "AI-Powered Search",
    description:
      "Find anything instantly with AI-powered semantic search across all your files.",
    color: "from-cyan-500 to-blue-500",
  },
];

const plans = [
  {
    name: "Free",
    price: "0",
    storage: "5 GB",
    description: "Perfect for personal use",
    features: [
      "5 GB storage",
      "Basic file sharing",
      "Mobile apps",
      "2 devices",
      "Standard support",
    ],
    cta: "Get Started Free",
    popular: false,
    gradient: "from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
  },
  {
    name: "Pro",
    price: "9",
    storage: "30 GB",
    description: "For professionals & creators",
    features: [
      "30 GB storage",
      "Advanced sharing & permissions",
      "All devices & apps",
      "Video streaming",
      "Priority support",
      "File versioning",
      "Password-protected links",
    ],
    cta: "Start Free Trial",
    popular: true,
    gradient: "from-blue-600 to-blue-700",
  },
  {
    name: "Enterprise",
    price: "29",
    storage: "Unlimited",
    description: "For large teams & businesses",
    features: [
      "Unlimited storage",
      "Team collaboration",
      "Admin dashboard",
      "SSO & SAML",
      "24/7 dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Audit logs",
    ],
    cta: "Contact Sales",
    popular: false,
    gradient: "from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechFlow",
    avatar: "SC",
    content:
      "Soft Drive replaced Google Drive and Dropbox for our entire team. The speed and security are unmatched.",
    rating: 5,
  },
  {
    name: "Marcus Williams",
    role: "Creative Director",
    avatar: "MW",
    content:
      "Finally a cloud storage that handles 4K video without breaking a sweat. The video streaming is incredible.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Startup Founder",
    avatar: "PP",
    content:
      "The sharing features are exactly what my distributed team needed. We share files with clients daily.",
    rating: 5,
  },
];

const fileTypes = [
  { icon: FileText, label: "Documents", color: "text-blue-500" },
  { icon: Image, label: "Images", color: "text-green-500" },
  { icon: Video, label: "Videos", color: "text-purple-500" },
  { icon: Music, label: "Audio", color: "text-orange-500" },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 radial-gradient-bg" />
        <div className="absolute inset-0 grid-pattern opacity-40" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Now with AI-Powered Search
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            Professional Cloud Storage
            <br />
            <span className="gradient-text">for Modern Business</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Store, share, and collaborate on files with enterprise-grade security.
            Built for teams that demand speed, reliability, and control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup">
              <Button variant="premium" size="xl" className="gap-2 font-semibold">
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="xl" className="gap-2 font-semibold">
                <Play className="w-4 h-4" />
                See how it works
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Free 30 GB · No credit card required · Cancel anytime
          </motion.p>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none h-full bottom-0" style={{ top: "60%" }} />
            <div className="rounded-2xl border border-border/60 shadow-2xl overflow-hidden bg-background">
              <DashboardMockup />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-8 font-medium uppercase tracking-widest">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-60">
            {["Acme Corp", "Vercel", "Linear", "Notion", "Stripe", "Figma"].map((company) => (
              <span key={company} className="text-lg font-semibold text-foreground/60">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Everything you need,{" "}
              <span className="gradient-text">nothing you don't</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete cloud storage platform with professional tools built for
              teams that want to move fast without compromising security.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group p-6 rounded-2xl border bg-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* File Types */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">File Support</Badge>
              <h2 className="text-4xl font-bold mb-4">
                Store any file type with{" "}
                <span className="gradient-text">zero limits</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                From 4K videos to CAD files, Soft Drive handles everything. Preview, stream, and share any file type directly in your browser.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {fileTypes.map((type) => (
                  <div key={type.label} className="flex items-center gap-3 p-4 rounded-xl border bg-card">
                    <type.icon className={`w-5 h-5 ${type.color}`} />
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl border border-border/60 overflow-hidden shadow-2xl bg-card p-6">
                <StorageMockup />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free. Upgrade when you need more. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? "bg-gradient-to-br " + plan.gradient + " text-white shadow-glow"
                    : "border bg-card hover:border-primary/30 hover:shadow-premium transition-all"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-white text-blue-600 font-semibold px-4 shadow-md">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <div>
                  <h3 className={`text-lg font-semibold mb-1 ${plan.popular ? "text-white" : ""}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.popular ? "text-blue-100" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-5xl font-bold ${plan.popular ? "text-white" : ""}`}>
                      ${plan.price}
                    </span>
                    <span className={plan.popular ? "text-blue-100" : "text-muted-foreground"}>
                      /mo
                    </span>
                  </div>
                  <p className={`text-sm font-medium mb-6 ${plan.popular ? "text-blue-100" : "text-muted-foreground"}`}>
                    {plan.storage} storage
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm">
                      <Check className={`w-4 h-4 shrink-0 ${plan.popular ? "text-blue-200" : "text-primary"}`} />
                      <span className={plan.popular ? "text-blue-50" : ""}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                        : ""
                    }`}
                    variant={plan.popular ? "ghost" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Loved by teams worldwide
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border bg-card hover:shadow-premium transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-16 bg-gradient-to-br from-blue-600 to-blue-700"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to transform your workflow?
              </h2>
              <p className="text-blue-100 text-lg mb-10">
                Join thousands of professionals who trust Soft Drive with their most important files.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="xl" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold gap-2">
                    Start for Free
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="xl" variant="glass" className="font-semibold">
                    Talk to Sales
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-blue-200 text-sm">
                No credit card required · Free 30 GB storage
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="bg-background flex h-[400px] overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 border-r border-border flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">Soft Drive</span>
        </div>
        {["My Drive", "Shared", "Recent", "Favorites", "Trash"].map((item, i) => (
          <div key={item} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mb-1 ${i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"}`}>
            <div className="w-3 h-3 rounded-sm bg-current opacity-60" />
            {item}
          </div>
        ))}
        <div className="mt-auto">
          <div className="text-xs text-muted-foreground mb-2 font-medium">Storage</div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-2/5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
          </div>
          <div className="text-xs text-muted-foreground mt-1.5">12 GB of 30 GB</div>
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-8 bg-muted rounded-xl" />
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg" />
        </div>
        <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-widest">Recent Files</div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { color: "from-blue-400 to-blue-500", type: "PDF" },
            { color: "from-green-400 to-green-500", type: "IMG" },
            { color: "from-purple-400 to-purple-500", type: "VID" },
            { color: "from-orange-400 to-orange-500", type: "DOC" },
          ].map((file, i) => (
            <div key={i} className="rounded-xl border bg-card p-3">
              <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${file.color} mb-2 flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{file.type}</span>
              </div>
              <div className="h-2 bg-muted rounded-full mb-1" />
              <div className="h-2 bg-muted rounded-full w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StorageMockup() {
  const files = [
    { name: "Project Brief.pdf", size: "2.4 MB", type: "PDF", color: "bg-red-100 text-red-600" },
    { name: "Brand Assets.zip", size: "48 MB", type: "ZIP", color: "bg-yellow-100 text-yellow-600" },
    { name: "Demo Video.mp4", size: "1.2 GB", type: "MP4", color: "bg-purple-100 text-purple-600" },
    { name: "Spreadsheet.xlsx", size: "340 KB", type: "XLS", color: "bg-green-100 text-green-600" },
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-sm">My Drive</span>
        <span className="text-xs text-muted-foreground">4 files</span>
      </div>
      {files.map((file) => (
        <div key={file.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
          <div className={`w-9 h-9 rounded-lg ${file.color} flex items-center justify-center font-bold text-xs shrink-0`}>
            {file.type}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{file.size}</p>
          </div>
          <div className="w-4 h-4 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}
