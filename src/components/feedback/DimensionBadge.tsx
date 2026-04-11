import { getDimension } from "@/lib/dimensions";
import type { DimensionId } from "@/types";

const COLOR_CLASSES: Record<string, string> = {
  green: "bg-green-50 text-green-700 border-green-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
};

interface Props {
  id: DimensionId;
}

export default function DimensionBadge({ id }: Props) {
  const dim = getDimension(id);
  if (!dim) return null;
  const cls = COLOR_CLASSES[dim.color] ?? COLOR_CLASSES.blue;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium ${cls}`}>
      {dim.label}
    </span>
  );
}
