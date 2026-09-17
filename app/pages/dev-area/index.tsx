import { Form, Link } from "react-router";
import DefaultTableModel from "~/classes/TableModel/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import SimpleTableModelView from "~/components/tables/SimpleTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";
import StatusBadge from "~/components/badges/StatusBadge";
import FormInput from "~/components/forms/FormInput";


const defaultTableTest = new DefaultTableModel(
  [
    [{ value: "data01", display: (<Link className="text-rose-500" to={"/"}>data01</Link>)}, 0, "data03"],
    ["data04", {value: 2, display: <p className="text-amber-500 cursor-help">2</p>}, "data06"],
    ["data07", 4, "data09"],
    ["data10", 6, { value: "data12", display: <span className="flex flex-row gap-2 items-center"><img src="/favicon.ico"/> <p>data12</p></span> }],
    ["data00", 1, { value: "data13", display: <span className="flex flex-row gap-2 items-center"><img src="/favicon.ico"/> <p>data13</p></span> }]
  ],
  ["column01", "column02", "column03"]
)

function StepBadge({step, description, final, concluded, active }: {step: number, description?: string, final?: boolean, concluded?: boolean, active?:boolean }) {
	const concludedColor = concluded ? "bg-hint-success" : "bg-hint-success-inactive"
	const activeColor = concluded ? "bg-hint-success" : active ? "bg-hint-success" : "bg-hint-success-inactive"
	return (
		<div className="flex flex-col">
			<div className="flex flex-row items-center gap-2">
				<div className={`rounded-full ${activeColor} size-15 flex items-center justify-center`}>
					{step}
				</div>
				{!final && <span className={`max-h-1.5 size-15 ${concludedColor} rounded-full`} />}
			</div>
			<p className="overflow-hidden wrap-break-word flex-wrap w-15">{description}</p>
		</div>
	)
}


export default function Page() {
  return (
  // <main className="bg-cps min-h-full">
    <main>
      <Header activeItem="dev-area"/>
			<section className="mt-5 flex flex-col mx-5">
        <PageSection name="Dynamic table layouts with same table model"/>


        {/*<SimpleTableModelView data={defaultTableTest} />*/}
        {/*<br/>*/}
        <ComplexTableModelView data={defaultTableTest} />

				<PageSection name="Components Area" />



				<p className="mb-3">Buttons</p>
        <section className="grid grid-cols-3 gap-3 w-fit">
          <button className="btn btn-normal">Normal button</button>
          <button className="btn btn-cancel">Cancel button</button>
          <button className="btn btn-success">Create</button>
          <button className="btn btn-disabled" disabled>Inactive</button>
        </section>
        <br />

        <p className="mb-3">Badges</p>
        <section className="flex flex-col gap-1 w-fit">
          <StatusBadge value={"Completed"} status={"green"} />
          <StatusBadge value={"Pending"} status={"yellow"} />
          <StatusBadge value={"Not Completed"} status={"red"} />
          <StatusBadge value={"Unknown"} status={"gray"} />
        </section>
        <br />

				<PageSection name={"Forms"} />

				<h1 className="mb-2">Random</h1>
        <section className="flex flex-col gap-1 w-fit">
          <Form className="flex flex-col gap-2">
            <FormInput name={"textField"} label="Text Field" type={"text"} placeholder="" />
            
            <FormInput required name={"requiredField"} label="Requirement Field" type={"text"} placeholder="" />

            <FormInput name={"timeRangeField"} label="Period Range Field" type={"time-range"} />

            <FormInput name={"numberField"} label="Number Field" labelAlign="left" type={"number"} />

            <FormInput name={"searchField"} placeholder="Search..." labelAlign="left" type={"search"} />


            <FormInput name={"checkboxField"} label="Check?" type={"checkbox"} />
          </Form>
        </section>
        <br />

        <PageSection name={"Random Tests Area"} />

        {/*<p>as components</p>
				<section className="flex flex-row items-start gap-2 mb-5">
					<StepBadge step={1} description={'undefinedasdiojasiojiasdjioasdjasdiojasdiojasdjioisddjsidsoosjiosiojsiosiojd'} concluded />
					<StepBadge step={2} description={'undefined'} active />
					<StepBadge step={3} description={'undefined3'} final />
				</section>

				<p>as pure HTML and using grid system</p>
				<section className="grid grid-cols-5 grid-rows-1 items-center w-fit gap-2 my-3">
						<div className="rounded-full bg-green-500 size-15 flex items-center justify-center">
							1
						</div>
						<span className="max-h-1.5 size-15 bg-green-950 rounded-full" />
						<div className="rounded-full bg-green-500 size-15 flex items-center justify-center">
							2
						</div>
						<span className="max-h-1.5 size-15 bg-green-950 rounded-full" />
						<div className="rounded-full bg-green-500 size-15 flex items-center justify-center">
							3
						</div>
						<p className="w-min overflow-hidden wrap-break-word text-wrap">descriptionopsfdokpopskdopfkdfopkfopksdfopksfdoppdposkapko</p>
						<span />

				</section>*/}
      </section>
    </main>
  )
}
