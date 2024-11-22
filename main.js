"use strict"

function initApp() {
    var pageContentContainer = /** @type {HTMLElement} */ (document.getElementsByClassName('page-content').item(0))
    if (!pageContentContainer || !(pageContentContainer instanceof HTMLElement)) {
        throw "Page content container not found"
    }

    var noteContainer = /** @type {HTMLElement} */ (pageContentContainer.firstElementChild)
    var editorElement = /** @type {HTMLElement} */ (pageContentContainer.lastElementChild)

    var createNoteButton = document.getElementById('new-note')

    var editor = newEditor(editorElement)
    var mode = newMode({ editorElement, noteContainer })
    var notes = newNoteCollection(noteContainer)

    createNoteButton.addEventListener('click', () => {
        notes.clearSelected()
        editor.clear()
        mode.edit()
    })

    notes.setEditRequestHandler((event) => {
        const index = parseInt(event.detail["index"])
        notes.select(index)
        editor.setContent(notes.getSelected())
        mode.edit()
    })

    editor.setCancelHandler(() => {
        notes.clearSelected()
        mode.normal()
    })

    editor.setSubmitHandler(() => {
        var note = editor.getContent()

        notes.deleteSelected()
        notes.add(note)
        notes.update()

        mode.normal()
    })
}

initApp()

function newMode({
    /** @type {HTMLElement} */
    editorElement,
    /** @type {HTMLElement} */
    noteContainer
}) {
    var editing = false

    editorElement.classList.add("hidden")

    return {
        editing,

        edit() {
            editorElement.classList.remove("hidden")
            noteContainer.classList.add("hidden")
        },

        normal() {
            editorElement.classList.add("hidden")
            noteContainer.classList.remove("hidden")
        }
    }
}

/**
 * @param {HTMLElement} editorElement
 */
function newEditor(editorElement) {
    var cancelButton =
        /** @type {HTMLElement} */
        (editorElement.lastElementChild.firstElementChild)
    var submitButton =
        /** @type {HTMLElement} */
        (editorElement.lastElementChild.lastElementChild)

    var titleField =
        /** @type {HTMLInputElement} */
        (editorElement.firstElementChild)
    var bodyField =
        /** @type {HTMLTextAreaElement} */
        (titleField.nextElementSibling)

    return {
        /**
         * @param {() => void} handler
         */
        setCancelHandler(handler) {
            cancelButton.addEventListener('click', handler)
        },

        /**
         * @param {() => void} handler
         */
        setSubmitHandler(handler) {
            submitButton.addEventListener('click', handler)
        },

        clear() {
            titleField.value = ""
            bodyField.value = ""
        },

        /**
         * @param {{title: String, body: String}} note
         */
        setContent(note) {
            titleField.value = note.title
            bodyField.value = note.body
        },

        getContent() {
            var note = {
                title: titleField.value,
                body: bodyField.value,
            }
            return note
        },
    }
}

/**
 * @param {HTMLElement} noteContainer
 */
function newNoteCollection(noteContainer) {
    var notes = []

    /** @type {number | undefined} */
    var selected = undefined

    return {
        /**
         * @param {(e: CustomEvent) => void} handler
         */
        setEditRequestHandler(handler) {
            noteContainer.addEventListener('noteupdate', handler)
        },

        /**
         * @param {{title: string, body: string}} note
         */
        add(note) {
            notes.unshift(note)
        },

        update() {
            updateNotes(noteContainer, notes)
        },

        /**
         * @param {number} index
         */
        select(index) {
            if (index < 0 || index >= notes.length) {
                return
            }
            selected = index
        },

        clearSelected() {
            selected = undefined
        },

        isSomeSelected() {
            return selected !== undefined
        },

        getSelected() {
            if (this.isSomeSelected()) {
                return notes[selected]
            } else {
                return undefined
            }
        },

        deleteSelected() {
            if (this.isSomeSelected()) {
                notes.splice(selected, 1)
                this.clearSelected()
            }
        }
    }
}

/**
 * @param {HTMLElement} noteContainer
 * @param {Object[]} notes
*/
function updateNotes(noteContainer, notes) {
    var noteCards = createNoteCards(notes)
    addClickEventsToNoteCards(noteCards)
    replaceNoteCards(noteContainer, noteCards)
}

/**
 * @param {Object[]} notes
 * @returns {HTMLElement[]}
*/
function createNoteCards(notes) {
    var noteCards = []
    for (const note of notes) {
        noteCards.push(createNoteCard(note.title, note.body))
    }
    return noteCards
}

/**
 * @param {HTMLElement[]} noteCards
 */
function addClickEventsToNoteCards(noteCards) {
    for (const [index, noteCard] of noteCards.entries()) {
        noteCard.addEventListener("click", () => {
            var customEvent = new CustomEvent("noteupdate", { bubbles: true, detail: { index } })
            noteCard.dispatchEvent(customEvent)
        })
    }
}

/**
 * @param {HTMLElement} noteContainer
 * @param {HTMLElement[]} noteCards
 */
function replaceNoteCards(noteContainer, noteCards) {
    noteContainer.replaceChildren(...[])
    for (let note of noteCards) {
        noteContainer.appendChild(note)
    }
}

/**
 * @param {string} titleText
 * @param {string} bodyText
 * @returns {HTMLElement}
 */
function createNoteCard(titleText = "Unnamed", bodyText = "") {
    var note = createElement('div', 'note-card')
    var noteContent = createElement('div', 'note-card__content')
    var title = createNoteTitle(titleText)
    var body = createNoteBody(bodyText)

    noteContent.appendChild(title)
    noteContent.appendChild(body)
    note.appendChild(noteContent)

    return note
}

/**
 * @param {string} text
 * @returns {HTMLElement}
 */
function createNoteTitle(text) {
    var title = createElement('h3', 'note-card__title')
    title.innerText = text
    return title
}

/**
 * @param {string} text
 * @returns {HTMLElement}
 */
function createNoteBody(text) {
    var body = createElement('p', 'note-card__body')
    body.innerText = text
    return body
}

/**
 * @param {string} tag - the HTML tag.
 * @param {string} classes - space-delimited list of classes.
 * @returns {HTMLElement}
 */
function createElement(tag, classes) {
    const element = document.createElement(tag)
    if (classes)
        element.classList.add(classes)
    return element
}
