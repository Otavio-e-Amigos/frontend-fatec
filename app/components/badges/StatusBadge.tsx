export default function StatusBadge({value, status}: {value:string, status: "green" | "yellow" | "red" | "gray"}) {
  const badgeColors = {
    green: "bg-green-400 border-green-300/75",
    yellow: "bg-amber-400 border-amber-300/75",
    red: "bg-rose-400 border-rose-300/75",
    gray: "bg-gray-400 border-gray-300/75"
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      <span className={`min-w-3 min-h-3 rounded-2xl border-2 ${badgeColors[status]}`} />
      <p>{value}</p>
    </div>
  )
}
