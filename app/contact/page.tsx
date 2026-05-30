"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you shortly.");
    setName(""); setEmail(""); setMessage("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <section className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Contact</Badge>
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-muted-foreground text-lg">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              {[
                { icon: Mail, title: "Email", value: "hello@softdrive.app", desc: "For general inquiries" },
                { icon: MessageSquare, title: "Sales", value: "sales@softdrive.app", desc: "For business plans" },
                { icon: Phone, title: "Phone", value: "+1 (555) 000-0000", desc: "Mon-Fri, 9AM-5PM EST" },
                { icon: MapPin, title: "Office", value: "San Francisco, CA", desc: "United States" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-foreground">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <form onSubmit={handleSubmit} className="p-8 rounded-2xl border bg-card space-y-5">
                <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" required />
                <div>
                  <label className="block text-sm font-medium mb-1.5">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your needs..."
                    rows={5}
                    required
                    className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                  />
                </div>
                <Button type="submit" variant="premium" className="w-full gap-2" loading={loading}>
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
