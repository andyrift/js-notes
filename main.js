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
 * @param {Element} noteContainer
 * @param {Array<Object>} notes
*/
function updateNotes(noteContainer, notes) {
    var noteElements = []
    for (const [index, note] of notes.entries()) {
        var noteCard = createNoteCard(note.title, note.body)
        noteCard.addEventListener("click", () => {
            var customEvent = new CustomEvent("updatenote", { bubbles: true, detail: { index } })
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
    var pageContentContainer = document.getElementsByClassName('page-content').item(0)
    if (!pageContentContainer) {
        throw "Page content container not found"
    }

    if (pageContentContainer.childElementCount != 1) {
        throw "Page content container does not have exactly one child"
    }

    var noteContainer = pageContentContainer.firstElementChild
    if (!noteContainer) {
        throw "Note container not found"
    }

    var newNoteButton = document.getElementById('new-note')
    if (!newNoteButton) {
        throw "New note button not found"
    }

    var notes = []

    newNoteButton.addEventListener('click', () => {
        var newNote = {
            title: `Title ${notes.length + 1}`,
            body: "Body",
        }
        notes.unshift(newNote)
        updateNotes(noteContainer, notes)
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

    noteContainer.addEventListener('updatenote', handleNoteUpdate)
}

initApp()
