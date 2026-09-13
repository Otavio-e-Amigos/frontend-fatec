export default class Professor {
	name: string
	registry: string
	govID: string
	courses: string[]
	courseClass: number

	constructor(name: string, govID: string, registry: string, courses: string[], courseClass: number) {
		this.name = name
		this.registry = registry
		this.courses = courses
		this.courseClass = courseClass
		this.govID = govID
	}

	// TODO GETTER and SETTER here
}
