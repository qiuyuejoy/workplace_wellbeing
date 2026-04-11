interface Props {
  tips: string[];
}

export default function NextTimeTips({ tips }: Props) {
  if (tips.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Next Time
      </h3>
      <ul className="space-y-1.5">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
            <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
