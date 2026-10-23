import { requireGroup } from "@/lib/auth";
import WrappedStory from "@/components/WrappedStory";

export const dynamic = "force-dynamic";

export default async function WrappedPage() {
  await requireGroup();
  return <WrappedStory />;
}
