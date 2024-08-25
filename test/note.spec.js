import { Note } from '../src/note'

describe('note name', () => {

    it('is set in the constructor', () => {
        const note = new Note('Note')

        expect(note.name).toBe('Note')
    })

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

    it('is empty by default', () => {
        const note = new Note('Note')

        expect(note.body).toBe('')
    })

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

describe('note id', () => {

    it('is 0 by default', () => {
        const note = new Note('Note')

        expect(note.id).toBe(0)
    })

    it('can be set upon creation', () => {
        const note = new Note('Note', { id: 1 })

        expect(note.id).toBe(1)
    })

    it('can be set', () => {
        const note = new Note('Note')

        note.id = ''

        expect(note.id).toBe('')
    })

    it('can not be undefined', () => {
        const note = new Note('Note')

        function setId() { note.id = undefined }

        expect(setId).toThrow(/id.*undefined/)
    })
})
