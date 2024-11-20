import '../style.css'

function createElement(tag, classes) {
    const element = document.createElement(tag)
    if (classes)
        element.classList.add(classes)
    return element
}

function checkForElement(element) {
    if (element instanceof HTMLElement === false)
        throw new Error('element should be instance of HTMLElement')
}

function createNoteElement(i) {

    const note = createElement('div', 'note')

    const title = createElement('h3', 'note__title')
    title.innerText = 'Note ' + i

    const body = createElement('p', 'note__body')
    body.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

    const noteContent = createElement('div', 'note__content')

    note.appendChild(noteContent)
    noteContent.appendChild(title)
    noteContent.appendChild(body)

    return note
}

function drawNoteContainer(element) {
    checkForElement(element)

    const container = createElement('div', 'note-container')

    for (let i = 0; i < 69; i++) {
        container.appendChild(createNoteElement(i + 1))
    }

    element.appendChild(container)

    return container
}

function createNavbar() {
    const navbar = createElement('nav', 'navbar')

    const title = createElement('h1', 'navbar__title')
    title.innerText = 'JS Notes'

    navbar.appendChild(title)

    return navbar
}

const appElement = document.getElementById('root')

const navbar = createNavbar()
const content = createElement('div', 'page-content')

appElement.appendChild(navbar)
appElement.appendChild(content)

const container = drawNoteContainer(content)




