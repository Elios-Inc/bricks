import { BarChart3Icon } from "lucide-react";

import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata = {
  title: "Reports · Coming Soon",
};

export default function ReportsPage() {
  return <ComingSoon title="Reports" icon={BarChart3Icon} />;
}
