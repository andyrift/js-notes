"use strict"

startApp()

function startApp() {
    var {
        signupElement,
        loginElement,
        accountElement,
        editorElement,
        noteContainer,
        homeButton,
        createNoteButton,
        accountButton
    } = findPageElements()

    var defaultMode = 'signup'

    var signup = Signup(signupElement)
    var login = Login(loginElement)
    var account = Account(accountElement)
    var editor = Editor(editorElement)
    var notes = Notes(noteContainer)

    var mode = Mode({ editor, normal: notes, login, signup, account }, defaultMode)

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
        setupTopBarActions()
        setupNoteActions()
        setupEditorActions()
        setupSignupActions()
        setupLoginActions()
    }

    function setupTopBarActions() {
        homeButton.addEventListener('click', home)
        createNoteButton.addEventListener('click', beginCreateNote)
        accountButton.addEventListener('click', openAccount)
    }

    function setupNoteActions() {
        notes.setEditHandler(editNote)
    }

    function setupEditorActions() {
        editor.setDeleteHandler(deleteCurrentNote)
        editor.setCancelHandler(cancelEditing)
        editor.setSubmitHandler(submitNote)
    }

    function setupSignupActions() {
        signup.setSubmitHandler(submitSignup)
        signup.setLoginHandler(signupToLogin)
    }

    function setupLoginActions() {
        login.setSubmitHandler(submitLogin)
        login.setSignupHandler(loginToSignup)
    }

    function beginCreateNote() {
        if (mode.is('editor')) {
            cancelEditing()
        }
        notes.unselect()
        editor.create()
        mode.switch('editor')
    }

    /**
     * @param {number} index
     */
    function editNote(index) {
        if (mode.is('editor')) return
        notes.select(index)
        editor.edit(notes.getSelected())
        mode.switch('editor')
    }

    function deleteCurrentNote() {
        notes.deleteSelected()
        notes.update()
        mode.switch('normal')
    }

    function cancelEditing() {
        notes.unselect()
        mode.switch('normal')
    }

    function submitNote() {
        notes.deleteSelected()
        notes.add(editor.getContent())
        notes.update()
        mode.switch('normal')
    }

    function submitSignup() {
        console.log(signup.getInput())
    }

    function signupToLogin() {
        mode.switch('login')
    }

    function submitLogin() {
        console.log("login submitted")
    }

    function loginToSignup() {
        mode.switch('signup')
    }

    function openAccount() {
        // check if logged in
        var loggedIn = true
        if (loggedIn) {
            mode.switch('account')
        }
    }

    function home() {
        // check if logged in
        var loggedIn = false
        if (loggedIn) {
            mode.switch('normal')
        } else {
            mode.switch('signup')
        }
    }
}

function findPageElements() {
    var pageContentContainer =
        /** @type {HTMLElement} */
        (document.getElementsByClassName('page-content').item(0))
    if (!pageContentContainer || !(pageContentContainer instanceof HTMLElement)) {
        throw "Page content container not found"
    }

    var signupElement = /** @type {HTMLElement} */ (pageContentContainer.firstElementChild)
    var loginElement = /** @type {HTMLElement} */ (signupElement.nextElementSibling)
    var accountElement = /** @type {HTMLElement} */ (loginElement.nextElementSibling)
    var noteContainer = /** @type {HTMLElement} */ (accountElement.nextElementSibling)
    var editorElement = /** @type {HTMLElement} */ (noteContainer.nextElementSibling)

    var homeButton = document.getElementById('title')
    var createNoteButton = document.getElementById('new-note')
    var accountButton = document.getElementById('account')

    return {
        signupElement,
        loginElement,
        accountElement,
        noteContainer,
        editorElement,
        homeButton,
        createNoteButton,
        accountButton,
    }
}

/**
 * @param {any} modes
 * @param {undefined | string} defaultMode
 */

function Mode(modes, defaultMode = 'normal') {
    var current = undefined

    function hideCurrent() { modes[current].hide() }

    if (!modes) {
        throw "No modes provided"
    }

    for (let mode in modes) {
        modes[mode].hide()
    }

    if (defaultMode && modes[defaultMode]) {
        current = defaultMode
        modes[current].show()
    }
    return {
        /**
         * @param {string} mode
         */
        is(mode) {
            return current == mode
        },

        /**
         * @param {string} mode
         */
        switch(mode) {
            if (!mode || !modes[mode]) {
                throw `Mode "${mode}" not found`
            }
            hideCurrent()
            current = mode
            modes[current].show()
        },
    }
}

/**
 * @param {HTMLElement} element
 */
function Placeholder(element) {
    return {
        hide() {

        },

        show() {

        },
    }
}

/**
 * @param {HTMLElement} element
 */
function Signup(element) {
    var actions = element.lastElementChild
    var submitButton =
        /** @type {HTMLElement} */
        (actions.firstElementChild)
    var loginButton =
        /** @type {HTMLElement} */
        (submitButton.nextElementSibling)

    var loginInput =
        /** @type {HTMLInputElement} */
        (element.firstElementChild.nextElementSibling)
    var passwordInput1 =
        /** @type {HTMLInputElement} */
        (loginInput.nextElementSibling)
    var passwordInput2 =
        /** @type {HTMLInputElement} */
        (passwordInput1.nextElementSibling)
    var masterPasswordInput =
        /** @type {HTMLInputElement} */
        (passwordInput2.nextElementSibling)

    return {
        /**
         * @param {() => void} handler
         */
        setSubmitHandler(handler) {
            submitButton.addEventListener('click', handler)
        },

        /**
         * @param {() => void} handler
         */
        setLoginHandler(handler) {
            loginButton.addEventListener('click', handler)
        },

        getInput() {
            return {
                login: loginInput.value,
                password1: passwordInput1.value,
                password2: passwordInput2.value,
                master: masterPasswordInput.value
            }
        },

        hide() {
            element.classList.add("hidden")
        },

        show() {
            element.classList.remove("hidden")
        },
    }
}

/**
 * @param {HTMLElement} element
 */
function Login(element) {
    var actions = element.lastElementChild
    var submitButton =
        /** @type {HTMLElement} */
        (actions.firstElementChild)
    var signupButton =
        /** @type {HTMLElement} */
        (submitButton.nextElementSibling)

    return {
        /**
         * @param {() => void} handler
         */
        setSubmitHandler(handler) {
            submitButton.addEventListener('click', handler)
        },

        /**
         * @param {() => void} handler
         */
        setSignupHandler(handler) {
            signupButton.addEventListener('click', handler)
        },

        hide() {
            element.classList.add("hidden")
        },

        show() {
            element.classList.remove("hidden")
        },
    }
}

/**
 * @param {HTMLElement} element
 */
function Account(element) {
    return {
        hide() {
            element.classList.add("hidden")
        },

        show() {
            element.classList.remove("hidden")
        },
    }
}

/**
 * @param {HTMLElement} editorElement
 */
function Editor(editorElement) {
    var editorActions = editorElement.lastElementChild
    var submitButton =
        /** @type {HTMLElement} */
        (editorActions.firstElementChild)
    var deleteButton =
        /** @type {HTMLElement} */
        (submitButton.nextElementSibling)
    var cancelButton =
        /** @type {HTMLElement} */
        (deleteButton.nextElementSibling)

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
