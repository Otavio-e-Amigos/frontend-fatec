interface BasicTableProperties extends Record<string, any> {
	acceptSorting?: boolean
	mode?: "read-only" | "edit"
	acceptNewValues?: boolean
}

interface BasicColumnProperties extends Record<string, any> {
	acceptSorting?: boolean
}


type TablePropertiesConstructorProps = {
	columnProperties?: BasicColumnProperties,
	tableProperties?: BasicTableProperties
}

export default class TableProperties {
	private columnProperties: BasicColumnProperties
	private properties: BasicTableProperties

	constructor(props: TablePropertiesConstructorProps) {
		this.columnProperties = props.columnProperties ?? {}
		this.properties = props.tableProperties ?? {}
	}

	getProperty(name: string) {
		return this.properties[name]
	}

	getColumnProperty(name: string) {
		return this.columnProperties[name]
	}

	setProperty(name: string, value: any) {
		this.properties[name] = value
	}

	setColumnProperty(name: string, value: any) {
		this.columnProperties[name] = value
	}
}
