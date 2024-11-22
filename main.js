"use strict"

function initApp() {
    var pageContentContainer = /** @type {HTMLElement} */ (document.getElementsByClassName('page-content').item(0))
    if (!pageContentContainer || !(pageContentContainer instanceof HTMLElement)) {
        throw "Page content container not found"
    }

    var noteContainer = /** @type {HTMLElement} */ (pageContentContainer.firstElementChild)

    var editorElement = /** @type {HTMLElement} */ (pageContentContainer.lastElementChild)

    var newNoteButton = document.getElementById('new-note')
    if (!newNoteButton) {
        throw "New note button not found"
    }

    editorElement.classList.add("hidden")

    function showEditor() {
        editorElement.classList.remove("hidden")
        noteContainer.classList.add("hidden")
    }

    function hideEditor() {
        editorElement.classList.add("hidden")
        noteContainer.classList.remove("hidden")
    }

    var editor = newEditor(editorElement)

    /** @type {{title: String, body: String}[]} */
    var notes = []

    /** @type {number | undefined} */
    var selectedNote = undefined

    newNoteButton.addEventListener('click', () => {
        editor.clear()
        showEditor()
    })

    noteContainer.addEventListener('noteupdate',
        /** @param {CustomEvent} e */
        (e) => {
            const index = parseInt(e.detail["index"])
            selectedNote = index
            editor.setContent(notes[selectedNote])
            showEditor()
        }
    )

    editor.cancelButton.addEventListener('click', () => {
        selectedNote = undefined
        hideEditor()
    })

    editor.submitButton.addEventListener('click', () => {
        var note = editor.getContent()
        if (selectedNote !== undefined) {
            notes.splice(selectedNote, 1)
        }
        notes.unshift(note)
        updateNotes(noteContainer, notes)

        selectedNote = undefined
        hideEditor()
    })
}

initApp()

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
        cancelButton,
        submitButton,

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
