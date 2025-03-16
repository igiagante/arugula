import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="flex items-center justify-between">
        <span className="text-xl font-medium text-black">{value}</span>
        <Icon className="size-5 text-gray-500" />
      </div>
    </div>
  );
}
