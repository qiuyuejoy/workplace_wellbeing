import PageHeader from "@/components/layout/PageHeader";
import SessionTable from "@/components/log/SessionTable";

export default function LogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Session Log"
        subtitle="Browse your saved reviews and reflections. Export all sessions as JSON for research analysis."
      />
      <SessionTable />
    </div>
  );
}
