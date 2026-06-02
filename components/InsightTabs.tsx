import Link from "next/link";

export function InsightTabs({ active }: { active: "daily" | "weekly" | "monthly" }) {
  const items = [
    { key: "daily", href: "/insights/daily", label: "Daily" },
    { key: "weekly", href: "/insights", label: "Weekly" },
    { key: "monthly", href: "/insights/monthly", label: "Monthly" }
  ] as const;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {items.map((item) => (
        <Link key={item.key} href={item.href} className={active === item.key ? "btn" : "btn-secondary"}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
