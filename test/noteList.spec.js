import { NoteList } from '../src/noteList'

describe('note list', () => {
    it('has no notes by default', () => {
        const list = new NoteList()

        expect(list.getNoteOrder()).toHaveLength(0)
        expect(list.getNotesInOrder()).toHaveLength(0)
    })
})

describe('adding note', () => {

    it('adds the note', () => {
        const list = new NoteList()
        const note = { id: 0 }

        list.addNote(note)

        expect(list.getNote(note.id)).toBe(note)
    })

    it('throws when note with such id already exists', () => {
        const list = new NoteList()
        const note1 = { id: 0 }
        const note2 = { id: 0 }

        list.addNote(note1)

        function addSecondNote() { list.addNote(note2) }

        expect(addSecondNote).toThrow(/note.*exists/)
    })

    it('adds it to the end', () => {

    })
})
