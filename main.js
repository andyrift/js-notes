"use strict"

function initApp() {
    var pageContentContainer = /** @type {HTMLElement} */ (document.getElementsByClassName('page-content').item(0))
    if (!pageContentContainer || !(pageContentContainer instanceof HTMLElement)) {
        throw "Page content container not found"
    }

    var noteContainer = /** @type {HTMLElement} */ (pageContentContainer.firstElementChild)

    var noteEditor = /** @type {HTMLElement} */ (pageContentContainer.lastElementChild)

    var noteEditorCancel = /** @type {HTMLElement} */ (noteEditor.lastElementChild.firstElementChild)
    var noteEditorSubmit = /** @type {HTMLElement} */ (noteEditor.lastElementChild.lastElementChild)

    var noteEditorTitle = /** @type {HTMLInputElement} */ (noteEditor.firstElementChild)
    var noteEditorBody = /** @type {HTMLTextAreaElement} */ (noteEditorTitle.nextElementSibling)

    var newNoteButton = document.getElementById('new-note')
    if (!newNoteButton) {
        throw "New note button not found"
    }

    noteEditor.classList.add("hidden")

    function showEditor() {
        noteEditor.classList.remove("hidden")
        noteContainer.classList.add("hidden")
    }

    function hideEditor() {
        noteEditor.classList.add("hidden")
        noteContainer.classList.remove("hidden")
    }

    newNoteButton.addEventListener('click', () => {
        noteEditorTitle.value = ""
        noteEditorBody.value = ""
        showEditor()
    })

    noteEditorCancel.addEventListener('click', () => {
        hideEditor()
    })

    var notes = []

    noteEditorSubmit.addEventListener('click', () => {
        var newNote = {
            title: noteEditorTitle.value,
            body: noteEditorBody.value,
        }
        notes.unshift(newNote)
        updateNotes(noteContainer, notes)

        noteEditor.classList.add("hidden")
        noteContainer.classList.remove("hidden")
    })

    /**
     * @param {CustomEvent} e
    */
    function handleNoteUpdate(e) {
        const index = parseInt(e.detail["index"])
        var note = notes.splice(index, 1)[0]
        notes.unshift(note)
        updateNotes(noteContainer, notes)
    }

    noteContainer.addEventListener('noteupdate', handleNoteUpdate)
}

initApp()

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
    var title = createElement('h3', 'note-card__title')
    title.innerText = text
    return title
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
 * @param {HTMLElement} noteContainer
 * @param {Object[]} notes
*/
function updateNotes(noteContainer, notes) {
    var noteCards = createNoteCards(notes)
    addClickEventsToNoteCards(noteCards)
    replaceNoteCards(noteContainer, noteCards)
}
