type FormInputTypesSupported = React.HTMLInputTypeAttribute | "time-range"
type FormInputProps = {
  name: string,
  label?: string,
  type?: FormInputTypesSupported,
  disabled?: boolean,
	labelAlign?: "top" | "left",
	placeholder?: string
}

// TODO optimize and refactor component returnings
export default function FormInput({ name, label, type = "text", disabled, labelAlign = "top", placeholder }: FormInputProps) {

	const basicInputParameters = {
		name: name,
		disabled: disabled,
		placeholder: placeholder
	}

  const DefaultInputElement = <input {...basicInputParameters} type={type} className="form-input"/>
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
          <input {...basicInputParameters} type="time"/>
          <input {...basicInputParameters} type="time"/>
        </div>
      )
      break
    }

    case "checkbox": {
      SelectedInputElement = (
        <input {...basicInputParameters} type={"checkbox"} className="form-input input-checkbox"/>
      )
      DefaultWrapper = (
        <div className={`flex flex-row gap-2 items-center`}>
          {SelectedInputElement}
          {label && <label htmlFor={name}>{label}</label>}
        </div>
      )
      break
		}

		case "search": {
			DefaultWrapper = (
				<div className="form-input flex flex-row gap-3 items-center">
					<img src="/favicon.ico" className="size-5"/>
					<input {...basicInputParameters} type="search" className="w-full" />

				</div>
			)
			break
		}
	}


  return DefaultWrapper
}
