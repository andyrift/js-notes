"use strict"

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
 * @param {string} titleText
 * @param {string} bodyText
 * @returns {HTMLElement}
 */
function createNoteCard(titleText = "Unnamed", bodyText = "") {
    const note = createElement('div', 'note-card')
    const noteContent = createElement('div', 'note-card__content')
    const title = createElement('h3', 'note-card__title')
    const body = createElement('p', 'note-card__body')

    title.innerText = titleText
    body.innerText = bodyText

    note.appendChild(noteContent)
    noteContent.appendChild(title)
    noteContent.appendChild(body)

    return note
}

/**
 * @param {HTMLElement} noteContainer
 * @param {Array<Object>} notes
*/
function updateNotes(noteContainer, notes) {
    var noteElements = []
    for (const [index, note] of notes.entries()) {
        var noteCard = createNoteCard(note.title, note.body)
        noteCard.addEventListener("click", () => {
            var customEvent = new CustomEvent("noteupdate", { bubbles: true, detail: { index } })
            noteCard.dispatchEvent(customEvent)
        })
        noteElements.push(noteCard)
    }
    noteContainer.replaceChildren()
    for (let note of noteElements) {
        noteContainer.appendChild(note)
    }
}

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

    var notes = []

    newNoteButton.addEventListener('click', () => {
        noteEditor.classList.remove("hidden")
        noteContainer.classList.add("hidden")
        noteEditorTitle.value = ""
        noteEditorBody.value = ""
    })

    noteEditorCancel.addEventListener('click', () => {
        noteEditor.classList.add("hidden")
        noteContainer.classList.remove("hidden")
    })

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
