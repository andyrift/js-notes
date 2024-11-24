"use strict"

initApp()

function initApp() {
    var { editorElement, noteContainer, createNoteButton } = findPageElements()

    var editor = Editor(editorElement)
    var notes = Notes(noteContainer)
    var mode = Mode({ editor, notes })

    setupActions()
    addPlaceholderNotes()

    function addPlaceholderNotes() {
        for (let i = 1; i <= 5; i += 1) {
            notes.add({
                title: `Note ${i}`,
                body: `Note ${i} body`,
            })
        }
        notes.update()
    }

    function setupActions() {
        setupCreateNoteAction()
        setupNoteActions()
        setupEditorActions()
    }

    function setupCreateNoteAction() {
        createNoteButton.addEventListener('click', beginCreateNote)
    }

    function setupNoteActions() {
        notes.setEditHandler(editNote)
    }

    function setupEditorActions() {
        editor.setDeleteHandler(deleteCurrentNote)
        editor.setCancelHandler(cancelEditing)
        editor.setSubmitHandler(submitNote)
    }

    function beginCreateNote() {
        if (mode.isEditing()) return
        notes.unselect()
        editor.create()
        mode.edit()
    }

    /**
     * @param {number} index
     */
    function editNote(index) {
        if (mode.isEditing()) return
        notes.select(index)
        editor.edit(notes.getSelected())
        mode.edit()
    }

    function deleteCurrentNote() {
        notes.deleteSelected()
        notes.update()
        mode.normal()
    }

    function cancelEditing() {
        notes.unselect()
        mode.normal()
    }

    function submitNote() {
        notes.deleteSelected()
        notes.add(editor.getContent())
        notes.update()
        mode.normal()
    }
}

function findPageElements() {
    var pageContentContainer =
        /** @type {HTMLElement} */
        (document.getElementsByClassName('page-content').item(0))
    if (!pageContentContainer || !(pageContentContainer instanceof HTMLElement)) {
        throw "Page content container not found"
    }

    var noteContainer = /** @type {HTMLElement} */ (pageContentContainer.firstElementChild)
    var editorElement = /** @type {HTMLElement} */ (pageContentContainer.lastElementChild)

    var createNoteButton = document.getElementById('new-note')

    return {
        noteContainer,
        editorElement,
        createNoteButton,
    }
}

function Mode({ editor, notes }) {
    var editing = false

    editor.hide()
    notes.show()

    return {
        isEditing() {
            return editing
        },

        edit() {
            editing = true
            editor.show()
            notes.hide()
        },

        normal() {
            editing = false
            editor.hide()
            notes.show()
        }
    }
}

/**
 * @param {HTMLElement} editorElement
 */
function Editor(editorElement) {
    var editorActions = editorElement.lastElementChild
    var deleteButton =
        /** @type {HTMLElement} */
        (editorActions.firstElementChild)
    var cancelButton =
        /** @type {HTMLElement} */
        (deleteButton.nextElementSibling)
    var submitButton =
        /** @type {HTMLElement} */
        (cancelButton.nextElementSibling)

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
        setDeleteHandler(handler) {
            deleteButton.addEventListener('click', handler)
        },

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
            this.setContent({ title: "", body: "" })
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

        hide() {
            editorElement.classList.add("hidden")
        },

        show() {
            editorElement.classList.remove("hidden")
        },

        hideDeleteButton() {
            deleteButton.classList.add("hidden")
        },

        showDeleteButton() {
            deleteButton.classList.remove("hidden")
        },

        /**
         * @param {{title: String, body: String}} note
         */
        edit(note) {
            this.setContent(note)
            this.showDeleteButton()
        },

        create() {
            this.clear()
            this.hideDeleteButton()
        },
    }
}

/**
 * @param {HTMLElement} noteContainer
 */
function Notes(noteContainer) {
    var notes = []

    /** @type {number | undefined} */
    var selected = undefined

    return {
        /**
         * @param {(index: number) => void} handler
         */
        setEditHandler(handler) {
            noteContainer.addEventListener('noteupdate',
                /** @param {CustomEvent} event */
                (event) => {
                    const index = parseInt(event.detail["index"])
                    handler(index)
                }
            )
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

        unselect() {
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
                this.unselect()
            }
        },

        hide() {
            noteContainer.classList.add("hidden")
        },

        show() {
            noteContainer.classList.remove("hidden")
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
    replaceNoteCardsInContainer(noteContainer, noteCards)
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
function replaceNoteCardsInContainer(noteContainer, noteCards) {
    noteContainer.replaceChildren(...noteCards)
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
    var title = createElement('h1', 'note-card__title')
    if (text) {
        title.innerText = text
    } else {
        title.innerText = "Untitled"
    }
    return title
}

/**
 * @param {string} text
 * @returns {HTMLElement}
 */
function createNoteBody(text) {
    var body = createElement('div', 'note-card__body')
    var textBody = createElement('p', 'note-card__text-body')
    textBody.innerText = text
    body.appendChild(textBody)
    return body
}

/**
 * @param {string} tag - the HTML tag.
 * @param {string} classes - space-delimited list of classes.
 * @returns {HTMLElement} the resulting element
 */
function createElement(tag, classes) {
    const element = document.createElement(tag)
    if (classes)
        element.classList.add(classes)
    return element
}
