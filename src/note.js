export class Note {
    body

    set name(value) {
        if (typeof value !== 'string')
            throw new Error('A note name should be a string')
        if (value.length === 0)
            throw new Error('A note name can not be empty')
        this._name = value
    }

    get name() {
        return this._name
    }

    constructor(name) {
        this.name = name
        this.body = ''
    }
}
