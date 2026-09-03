import { Form, Link } from "react-router";
import DefaultTableModel from "~/classes/TableModel/DefaultTableModel";
import ComplexTableModelView from "~/components/tables/ComplexTableView";
import SimpleTableModelView from "~/components/tables/SimpleTableView";
import Header from "~/layouts/Header";
import PageSection from "~/layouts/PageSection.layout";

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

function StatusBadge({value, status}: {value:string, status: "green" | "yellow" | "red" | "gray"}) {
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

type FormInputTypesSupported = React.HTMLInputTypeAttribute | "time-range"
type FormInputProps = {
  name: string,
  label?: string,
  type?: FormInputTypesSupported,
  disabled?: boolean,
  labelAlign?: "top" | "left"
}
function FormInput({ name, label, type = "text", disabled, labelAlign = "top" }: FormInputProps) {
  const DefaultInputElement = <input name={name} type={type} disabled={disabled} className="form-input"/>
  let SelectedInputElement = DefaultInputElement

  const labelAlignLookup = {
    top: "flex-col",
    left: "flex-row gap-2 items-center",
    right: "flex-row-reverse gap-2 items-center"
  }

  let DefaultWrapper = (
    <div className={`flex ${labelAlignLookup[labelAlign]}`}>
      {label && <label htmlFor={name}>{label}</label>}
      {SelectedInputElement}
    </div>
  )

  switch (type) {
    case 'time-range':
      SelectedInputElement = (
        <div className="form-input flex flex-row justify-between w-fit gap-5">
          <input name={name} type="time" disabled={disabled} />
          <input name={name} type="time" disabled={disabled} />
        </div>
      )
      break

    case "checkbox":
      DefaultWrapper = (
        <div className={`flex flex-row gap-2 items-center justify-center}`}>
          {SelectedInputElement}
          {label && <label htmlFor={name}>{label}</label>}
        </div>
      )
      SelectedInputElement = (
        <input name={name} type={"checkbox"} disabled={disabled} className="form-input input-checkbox"/>
      )
      break
  }


  return (
    <>{DefaultWrapper}</>
  )
}

export default function Page() {
  return (
  // <main className="bg-cps min-h-full">
    <main>
      <Header/>
      <section className="mt-5 flex flex-col mx-5">
        <PageSection name="Dynamic table layouts with same table model"/>

        {/*<SimpleTableModelView data={defaultTableTest} />*/}
        <br/>
        <ComplexTableModelView data={defaultTableTest} />

        <PageSection name="Components Area" />

        <p className="mb-3">Buttons</p>
        <section className="grid grid-cols-3 gap-3 w-fit">
          <button className="btn btn-normal">Normal button</button>
          <button className="btn btn-cancel">Cancel button</button>
          <button className="btn btn-success">Create</button>
          <button className="btn btn-inactive" disabled>Inactive</button>
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

        <p className="mb-3">Forms</p>
        <section className="flex flex-col gap-1 w-fit">
          <Form className="flex flex-col gap-2">
            <FormInput name={"textField"} label="Text Field" type={"text"} />

            <FormInput name={"timeRangeField"} label="Period Range Field" type={"time-range"} />

            <FormInput name={"numberField"} label="Number Field" labelAlign="left" type={"number"} />

            <FormInput name={"checkboxField"} label="Check?" type={"checkbox"} />
          </Form>
        </section>
        <br />


      </section>
    </main>
  )
}
