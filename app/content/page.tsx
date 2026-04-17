import { FileTextIcon } from "lucide-react";

import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata = {
  title: "Content · Coming Soon",
};

export default function ContentPage() {
  return <ComingSoon title="Content" icon={FileTextIcon} />;
}
