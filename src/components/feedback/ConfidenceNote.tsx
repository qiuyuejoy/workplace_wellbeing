interface Props {
  note: string | null;
}

export default function ConfidenceNote({ note }: Props) {
  if (!note) return null;

  return (
    <p className="text-xs text-gray-400 italic leading-relaxed border-t border-gray-100 pt-3">
      Note: {note}
    </p>
  );
}
