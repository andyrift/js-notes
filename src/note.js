export class Note {
    _body

    // milliseconds
    _timestamp

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

    set body(value) {
        if (typeof value !== 'string')
            throw new Error('A note body should be a string')
        this._body = value
    }

    get body() {
        return this._body
    }

    set timestamp(value) {
        if (typeof value !== 'number')
            throw new Error('A timestamp body should be a number')
        this._timestamp = value
    }

    get timestamp() {
        return this._timestamp
    }

    constructor(name, opts) {
        this.name = name
        this.body = opts && opts.body || ''
        this.timestamp = opts && opts.timestamp || Date.now()
    }
}
