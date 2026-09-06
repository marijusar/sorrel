import { redirect } from "next/navigation";
import { BillingServer } from "@/lib/http/billing-server";

export default async function GatedLayout({ children }: LayoutProps<"/dashboard">) {
  const res = await BillingServer.getCurrentSubscription();
  if (res.status === 401) redirect("/login");
  if (!res.data) redirect("/dashboard/billing");

  return children;
}
