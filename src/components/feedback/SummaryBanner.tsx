interface Props {
  summary: string;
}

export default function SummaryBanner({ summary }: Props) {
  return (
    <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
      <p className="text-sm text-gray-800 leading-relaxed">{summary}</p>
    </div>
  );
}
