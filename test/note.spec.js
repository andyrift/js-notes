import { Note } from '../src/note'

describe('new note', () => {

    it('has name given to it', () => {
        const note = new Note('Note')

        expect(note.name).toBe('Note')
    })

    it('has empty body', () => {
        const note = new Note('Note')

        expect(note.body).toBe('')
    })
})

describe('note name', () => {

    it('can be set and read', () => {
        const note = new Note('Note')

        note.name = 'New name'

        expect(note.name).toBe('New name')
    })

    it('can not be empty', () => {
        const note = new Note('Note')

        function setName() { note.name = '' }

        expect(setName).toThrow(/name.*empty/)
    })

    it('can only be a string', () => {
        const note = new Note('Note')

        function setName() { note.name = 0 }

        expect(setName).toThrow(/name.*string/)
    })

    it('can not be initialized automatically', () => {
        function createNote() { new Note() }

        expect(createNote).toThrow(/name.*string/i)
    })
})

describe('note body', () => {

    it('can be set and read', () => {
        const note = new Note('Note')

        note.body = 'note body'

        expect(note.body).toBe('note body')
    })

    it('can only be a string', () => {
        const note = new Note('Note')
        function setBody() { note.body = 0 }

        expect(setBody).toThrow(/body.*string/)
    })

    it('can be set upon creation', () => {
        const note = new Note('Note', { body: 'note body' })

        expect(note.body).toBe('note body')
    })

})

describe('note timestamp', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('is initialized as now', () => {
        const note = new Note('Note')

        expect(note.timestamp).toEqual(Date.now())
    })

    it('can be set upon creation', () => {
        const note = new Note('Note', { timestamp: 1 })

        expect(note.timestamp).toEqual(1)
    })

    it('can be set', () => {
        const note = new Note('Note')

        note.timestamp = 1

        expect(note.timestamp).toEqual(1)
    })
})
