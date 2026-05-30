"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    storage: "5 GB",
    description: "Perfect for personal use",
    features: [
      "5 GB storage",
      "Basic file sharing",
      "Mobile apps",
      "2 devices",
      "Standard support",
      "File preview",
    ],
    cta: "Get Started Free",
    href: "/signup",
    popular: false,
    highlight: false,
  },
  {
    name: "Pro",
    price: "9",
    period: "per month",
    storage: "30 GB",
    description: "For professionals & small teams",
    features: [
      "30 GB storage",
      "Advanced sharing & permissions",
      "Unlimited devices",
      "Video streaming",
      "Priority support",
      "File versioning (30 days)",
      "Password-protected links",
      "Expiring share links",
      "Activity logs",
    ],
    cta: "Start 14-Day Free Trial",
    href: "/signup",
    popular: true,
    highlight: true,
  },
  {
    name: "Business",
    price: "29",
    period: "per user/month",
    storage: "1 TB",
    description: "For teams and organizations",
    features: [
      "1 TB storage per user",
      "Team collaboration",
      "Admin dashboard",
      "SSO & SAML",
      "24/7 dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Audit logs",
      "Advanced analytics",
      "Priority processing",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    highlight: false,
  },
];

const faqs = [
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can change your plan at any time. Upgrades take effect immediately, downgrades at your next billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Pro plan comes with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What happens to my files if I downgrade?",
    a: "Your files remain safe. If you exceed the storage limit, uploads will be paused until you free up space.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 radial-gradient-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Simple Pricing
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              Start free, grow at your pace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. No surprises. Pick the plan that works for you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-8 ${
                  plan.highlight
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl scale-105"
                    : "border bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-white text-blue-600 font-semibold px-4 shadow">Most Popular</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? "text-white" : ""}`}>{plan.name}</h3>
                  <p className={`text-sm ${plan.highlight ? "text-blue-100" : "text-muted-foreground"}`}>{plan.description}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-bold ${plan.highlight ? "text-white" : ""}`}>${plan.price}</span>
                    <span className={plan.highlight ? "text-blue-200" : "text-muted-foreground"}>/{plan.period}</span>
                  </div>
                  <p className={`text-sm font-semibold mt-1 ${plan.highlight ? "text-blue-200" : "text-primary"}`}>
                    {plan.storage} storage
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-blue-200" : "text-primary"}`} />
                      <span className={plan.highlight ? "text-blue-50" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className={`w-full ${plan.highlight ? "bg-white text-blue-600 hover:bg-blue-50 font-bold" : ""}`}
                    variant={plan.highlight ? "ghost" : "outline"}
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

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border bg-card"
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
