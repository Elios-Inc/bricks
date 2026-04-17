import { ConstructionIcon } from "lucide-react";

import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata = {
  title: "Members · Coming Soon",
};

export default function MembersPage() {
  return <ComingSoon title="Members" icon={ConstructionIcon} />;
}
