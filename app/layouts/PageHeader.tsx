export default function PageHeader({ subTitle, title, description, headerItems }: { subTitle?: string, title: string, description?: string, headerItems?:any }) {
    return (
        <header className="flex flex-wrap items-end justify-between gap-3 w-full">
            <div className="flex flex-row w-full h-full">
                <div className="flex flex-col w-3/4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                        {subTitle}
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold text-ink">{title}</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {description}
                    </p>
                </div>
                <div className="flex flex-col w-1/4 justify-end items-end">
                    {headerItems}
                </div>
            </div>
            {/* <Link className="btn" data-variant="outline" to="/professor">
                    Ver professores
                </Link> */}
            <div className="flex flex-row w-full h-fit items-center">
                <div className="min-h-3 bg-brand-shade/75 rounded-xl w-1/4" />
                <div className="min-h-1 bg-brand-shade/50 rounded-xl  rounded-s-none w-full" />

            </div>


            {/* <div className="flex flex-col gap-2 w-full">
                    <h1 className="text-3xl font-semibold">{title}</h1>
                    <div className="flex flex-row w-full h-fit items-center">
                        <div className="min-h-3 bg-brand-shade/75 rounded-xl w-1/4" />
                        <div className="min-h-1 bg-brand-shade/50 rounded-xl  rounded-s-none w-full" />
    
                    </div>
                </div> */}
        </header>
    )
}