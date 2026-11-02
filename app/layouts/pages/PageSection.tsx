export default function PageSection({ name }: {name:string}) {
  return (
    <div className="flex flex-col my-3">
      <h1 className="text-3xl">{name}</h1>
    </div>
  )
}
