interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-gray-500 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
