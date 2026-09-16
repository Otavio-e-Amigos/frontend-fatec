export default class Professor {
	id?: number
	name: string
	registry: string
	govID: string
	courses: string[]
	courseClass: number

	constructor(name: string, govID: string, registry: string, courses: string[], courseClass: number, id?: number) {
		this.id = id
		this.name = name
		this.registry = registry
		this.courses = courses
		this.courseClass = courseClass
		this.govID = govID
	}

	// TODO GETTER and SETTER here
}
