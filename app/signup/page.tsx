import { SignupForm } from "@/components/auth/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Soft Drive account",
};

export default function SignupPage() {
  return <SignupForm />;
}
