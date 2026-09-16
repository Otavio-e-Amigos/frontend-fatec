export default function StatusBadge({value, status}: {value:string, status: "green" | "yellow" | "red" | "gray"}) {
  const badgeColors = {
    green: "bg-hint-success border-green-900/30",
    yellow: "bg-hint-progress border-orange-800/30",
    red: "bg-hint-warning border-rose-900/70",
    gray: "bg-hint-unknown border-gray-900/30"
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      <span className={`min-w-3 min-h-3 rounded-2xl border-2 ${badgeColors[status]}`} />
      <p>{value}</p>
    </div>
  )
}
