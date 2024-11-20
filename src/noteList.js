export class NoteList {
    map
    order

    constructor() {
        this.map = new Map()
        this.order = []
    }

    addNote(note) {
        if (note === undefined)
            throw new Error('no note provided')
        if (note.id === undefined)
            throw new Error('note id can not be undefined')
        if (this.map.has(note.id))
            throw new Error('a note with such id already exists')

        this.map.set(note.id, note)
        this.order.push(note.id)
    }

    insertNote(note, index) {

    }

    deleteNote(id) {

    }

    moveNote(id, index) {

    }

    getNoteOrder() {
        return this.order.slice()
    }

    getNotesInOrder() {
        return this.order.map(id => this.map.get(id))
    }

    getNote(id) {
        const note = this.map.get(id)
        if (note === undefined)
            throw new Error(`no note with id "${id}"`)
        return note
    }
}
