import { getSetlistPerformanceData } from "@/lib/api";
import { SetlistPerformer } from "@/components/setlist-performer";

export default async function PerformSetlistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { setlist, songs } = await getSetlistPerformanceData(id);

  return (
    <SetlistPerformer
      name={setlist.name}
      songs={songs}
      backHref={`/setlists/${id}`}
    />
  );
}
