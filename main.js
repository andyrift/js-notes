"use strict"

startApp()

function startApp() {
    var {
        loadingElement,
        signupElement,
        loginElement,
        accountElement,
        editorElement,
        noteContainer,
        homeButton,
        createNoteButton,
        accountButton,
        loginButton,
    } = findPageElements()

    // check if logged in

    var state = {
        loggedIn: false,
        pendingRequest: false,
    }

    var defaultMode = 'login'

    if (state.loggedIn) {
        defaultMode = 'normal'
        loginButton.classList.add('hidden')
    } else {
        createNoteButton.classList.add('hidden')
        accountButton.classList.add('hidden')
    }

    var loading = View(loadingElement)
    var signup = Signup(signupElement)
    var login = Login(loginElement)
    var account = Account(accountElement)
    var editor = Editor(editorElement)
    var notes = Notes(noteContainer)

    var mode = Mode({ loading, editor, normal: notes, login, signup, account }, defaultMode)

    var actions = Actions()

    actions.addGroups({
        notes: {
            /**
             * @param {number} index
             */
            editNote(index) {
                if (mode.is('editor')) return
                notes.select(index)
                editor.edit(notes.getSelected())
                mode.switch('editor')
            },

            deleteCurrentNote() {
                notes.deleteSelected()
                notes.update()
                mode.switch('normal')
            },

            cancelEditing() {
                notes.unselect()
                mode.switch('normal')
            },

            submitNote() {
                notes.deleteSelected()
                notes.add(editor.getContent())
                notes.update()
                mode.switch('normal')
            }
        },

        signup: {
            submitSignup() {
                console.log(signup.getInput())
                switchToLoggedIn()
                mode.switch('normal')
                signup.clear()
            },

            signupToLogin() {
                signup.clear()
                login.clear()
                mode.switch('login')
            }
        },

        login: {
            submitLogin() {
                console.log(login.getInput())
                switchToLoggedIn()
                mode.switch('normal')
                login.clear()
            },

            loginToSignup() {
                signup.clear()
                login.clear()
                mode.switch('signup')
            }
        },

        account: {
            logout() {
                if (state.loggedIn) {
                    logoutUnchecked()
                }
            }
        },

        general: {
            beginCreateNote() {
                if (mode.is('editor')) {
                    actions["notes"].cancelEditing()
                }
                notes.unselect()
                editor.create()
                mode.switch('editor')
            },

            openAccount() {
                if (state.loggedIn) {
                    mode.switch('account')
                }
            },

            openLogin() {
                if (!state.loggedIn) {
                    login.clear()
                    mode.switch('login')
                }
            },

            home() {
                if (state.loggedIn) {
                    mode.switch('normal')
                } else {
                    mode.switch('login')
                }
            }
        }
    })

    setupActions()
    addPlaceholderNotes()

    function setupActions() {
        setupTopBarActions()
        setupNoteActions()
        setupEditorActions()
        setupSignupActions()
        setupLoginActions()
        setupAccountActions()
    }

    function setupTopBarActions() {
        homeButton.addEventListener('click', actions["general"].home)
        createNoteButton.addEventListener('click', actions["general"].beginCreateNote)
        accountButton.addEventListener('click', actions["general"].openAccount)
        loginButton.addEventListener('click', actions["general"].openLogin)
    }

    function setupNoteActions() {
        notes.setEditHandler(actions["notes"].editNote)
    }

    function setupEditorActions() {
        editor.setDeleteHandler(actions["notes"].deleteCurrentNote)
        editor.setCancelHandler(actions["notes"].cancelEditing)
        editor.setSubmitHandler(actions["notes"].submitNote)
    }

    function setupSignupActions() {
        signup.setSubmitHandler(actions["signup"].submitSignup)
        signup.setLoginHandler(actions["signup"].signupToLogin)
    }

    function setupLoginActions() {
        login.setSubmitHandler(actions["login"].submitLogin)
        login.setSignupHandler(actions["login"].loginToSignup)
    }

    function setupAccountActions() {
        account.setLogoutHandler(actions["account"].logout)
    }

    function logoutUnchecked() {
        switchToLoggedOut()
        login.clear()
        notes.clear()
        account.clear()
        mode.switch('login')
    }

    function switchToLoggedIn() {
        state.loggedIn = true
        loginButton.classList.add('hidden')
        createNoteButton.classList.remove('hidden')
        accountButton.classList.remove('hidden')
    }

    function switchToLoggedOut() {
        state.loggedIn = false
        loginButton.classList.remove('hidden')
        createNoteButton.classList.add('hidden')
        accountButton.classList.add('hidden')
    }

    function addPlaceholderNotes() {
        for (let i = 1; i <= 5; i += 1) {
            notes.add({
                title: `Note ${i}`,
                body: `Note ${i} body`,
            })
        }
        notes.update()
    }
}

function findPageElements() {
    var pageContentContainer = findHTMLElementByClassName(document, 'page-content')
    var topBar = findHTMLElementByClassName(document, 'top-bar')

    var loadingElement = findHTMLElementByClassName(pageContentContainer, 'view_loading')
    var signupElement = findHTMLElementByClassName(pageContentContainer, 'view_signup')
    var loginElement = findHTMLElementByClassName(pageContentContainer, 'view_login')
    var accountElement = findHTMLElementByClassName(pageContentContainer, 'view_account')
    var noteContainer = findHTMLElementByClassName(pageContentContainer, 'view_note-container')
    var editorElement = findHTMLElementByClassName(pageContentContainer, 'view_note-editor')

    var homeButton = findHTMLElementByClassName(topBar, 'top-bar__title')
    var createNoteButton = findHTMLElementByClassName(topBar, 'button_new-note')
    var accountButton = findHTMLElementByClassName(topBar, 'button_account')
    var loginButton = findHTMLElementByClassName(topBar, 'button_login')

    return {
        loadingElement,
        signupElement,
        loginElement,
        accountElement,
        noteContainer,
        editorElement,
        homeButton,
        createNoteButton,
        accountButton,
        loginButton,
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

function Actions() {
    var centralizedActions = {
        /**
        * @param {object} groups
        */
        addGroups(groups) {
            for (let groupName in groups) {
                this.addGroup(groupName, groups[groupName])
            }
        },

        /**
        * @param {string} groupName
        * @param {object} actions
        */
        addGroup(groupName, actions) {
            var group = {}
            for (let name in actions) {
                group[name] = actionify(actions[name])
            }
            centralizedActions[groupName] = group
        }
    }

    var pending = false

    /**
    * @param {(...args: any[]) => Promise<void>} action
    * @returns {(...args: any[]) => Promise<void>}
    */
    function actionify(action) {
        return async function (...args) {
            if (pending) {
                return
            }
            pending = true
            await action(...args)
            pending = false
        }
    }

    return centralizedActions
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
function View(element) {
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
 * @param {HTMLElement} element
 */
function Signup(element) {
    var submitButton = findHTMLElementByClassName(element, 'button_submit')
    var loginButton = findHTMLElementByClassName(element, 'link_login')

    var form = document.forms['signup-form']

    var inputs = {
        username: form['username'],
        password: form['password'],
        passwordRepeated: form['password-repeated'],
        masterPassword: form['master-password'],
    }

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
                username: inputs.username.value,
                password: inputs.password.value,
                passwordRepeated: inputs.passwordRepeated.value,
                masterPassword: inputs.masterPassword.value,
            }
        },

        clear() {
            inputs.username.value = ""
            inputs.password.value = ""
            inputs.passwordRepeated.value = ""
            inputs.masterPassword.value = ""
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
    var submitButton = findHTMLElementByClassName(element, 'button_submit')
    var signupButton = findHTMLElementByClassName(element, 'link_signup')

    var form = document.forms['login-form']

    var inputs = {
        username: form['username'],
        password: form['password'],
    }

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

        getInput() {
            return {
                username: inputs.username.value,
                password: inputs.password.value,
            }
        },

        clear() {
            inputs.username.value = ""
            inputs.password.value = ""
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
    var logoutButton = findHTMLElementByClassName(element, 'button_logout')

    var fields = {
        uuid: findHTMLElementByClassName(element, 'field_uuid'),
        username: findHTMLElementByClassName(element, 'field_username'),
        registered: findHTMLElementByClassName(element, 'field_registered'),
    }

    return {
        /**
         * @param {() => void} handler
         */
        setLogoutHandler(handler) {
            logoutButton.addEventListener('click', handler)
        },

        /**
        * @param {object} info
        */
        setInfo(info) {
            fields.uuid.innerText = info.uuid
            fields.username.innerText = info.username
            fields.registered.innerText = info.registered
        },

        clear() {
            fields.uuid.innerText = ""
            fields.username.innerText = ""
            fields.registered.innerText = ""
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
function Editor(element) {
    var submitButton = findHTMLElementByClassName(element, 'button_submit')
    var deleteButton = findHTMLElementByClassName(element, 'button_delete')
    var cancelButton = findHTMLElementByClassName(element, 'button_cancel')

    var titleFieldElement = findHTMLElementByClassName(element, 'note-editor__title')
    var bodyFieldElement = findHTMLElementByClassName(element, 'note-editor__body')

    if (!(titleFieldElement instanceof HTMLInputElement)) {
        throw "Editor title field element is not an element of correct type"
    }

    if (!(bodyFieldElement instanceof HTMLTextAreaElement)) {
        throw "Editor body field element is not an element of correct type"
    }

    /** @type{HTMLInputElement} */
    var titleField = titleFieldElement
    /** @type{HTMLTextAreaElement} */
    var bodyField = bodyFieldElement

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
            element.classList.add("hidden")
        },

        show() {
            element.classList.remove("hidden")
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

        clear() {
            notes = []
            this.update()
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

/**
 * @param {HTMLElement | document} element
 * @param {string} className
 */
function findHTMLElementByClassName(element, className) {
    var child =
        /** @type {HTMLElement} */
        (element.getElementsByClassName(className).item(0))
    if (!child || !(child instanceof HTMLElement)) {
        throw `HTML element with class name ${className} not found`
    }
    return child
}
