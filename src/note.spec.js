import { Note } from './note'

describe('new note', () => {

    it('has name given to it', () => {
        const note = new Note('Note name')

        expect(note.name).toBe('Note name')
    })

    it('has empty body', () => {
        const note = new Note('Note name')

        expect(note.body).toBe('')
    })
})

describe('note constructor', () => {

    it('throws error when given no name', () => {
        function createNote() { new Note() }

        expect(createNote).toThrowError(/name.*string/i)
    })

    it('throws error when given name of non-string type', () => {
        function createNote() { new Note(0) }

        expect(createNote).toThrowError(/name.*string/i)
    })

    it('throws error when given empty string as name', () => {
        function createNote() { new Note('') }

        expect(createNote).toThrowError(/name.*empty/i)
    })
})
