import { STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${STATUS_COLORS[status] || "bg-gray-100 text-gray-600"}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
