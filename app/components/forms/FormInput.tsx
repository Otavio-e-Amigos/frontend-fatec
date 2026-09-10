type FormInputTypesSupported = React.HTMLInputTypeAttribute | "time-range"
type FormInputProps = {
  name: string,
  label?: string,
  type?: FormInputTypesSupported,
  disabled?: boolean,
  labelAlign?: "top" | "left"
}
export default function FormInput({ name, label, type = "text", disabled, labelAlign = "top" }: FormInputProps) {
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
    case 'time-range': {
      SelectedInputElement = (
        <div className="form-input flex flex-row justify-between w-fit gap-5">
          <input name={name} type="time" disabled={disabled} />
          <input name={name} type="time" disabled={disabled} />
        </div>
      )
      break
    }

    case "checkbox": {
      SelectedInputElement = (
        <input name={name} type={"checkbox"} disabled={disabled} className="form-input input-checkbox"/>
      )
      DefaultWrapper = (
        <div className={`flex flex-row gap-2 items-center justify-center}`}>
          {SelectedInputElement}
          {label && <label htmlFor={name}>{label}</label>}
        </div>
      )
      break
    }
  }


  return (
    <>{DefaultWrapper}</>
  )
}
