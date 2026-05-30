import { redirect } from "next/navigation";

// Redirect to settings profile tab
export default function ProfilePage() {
  redirect("/dashboard/settings");
}
