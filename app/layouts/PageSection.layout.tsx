export default function PageSection({ name }: {name:string}) {
  return (
    <div className="flex flex-1 flex-col mb-10 mt-5">
      <h1 className="text-3xl mb-2.5">{name}</h1>
      <div className="flex flex-1 flex-row justify-center">
        <span className="flex flex-1 rounded-4xl min-h-2 bg-amber-500" />
        <span className="flex flex-1 max-h-1 bg-amber-400" />
      </div>
    </div>
  )
}
