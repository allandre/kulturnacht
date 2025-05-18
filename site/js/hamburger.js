// Don't pollute global namespace. Also this way we can better check what is used inside and what outside of this script.
;(function () {
  const hamburgerDiv = document.querySelector('#hamburger')
  if (!hamburgerDiv) {
    // eslint-disable-next-line no-console
    console.log('Error: could not find hamburger element')
    return
  }

  // inspired by https://www.w3schools.com/howto/howto_js_mobile_navbar.asp
  const linksDiv = document.createElement('div')
  linksDiv.id = 'hamburger-links'
  hamburgerDiv.appendChild(linksDiv)
  for (const anchor of document.querySelectorAll('.anchor')) {
    const label = anchor.getAttribute('data-label') ?? anchor.id

    const link = document.createElement('a')
    link.href = `#${anchor.id}`
    link.innerHTML = label
    link.setAttribute('data-prio', anchor.getAttribute('data-prio') ?? 0)
    link.setAttribute('onclick', 'toggleHamburger(true)')
    link.classList.add('actual-anchor')
    linksDiv.appendChild(link)
  }

  const onArchivePage = window.location.href.includes('archive')

  if (onArchivePage) {
    const aktuellLink = document.createElement('a')
    aktuellLink.href = '../'
    aktuellLink.innerHTML = '< Aktuell'
    linksDiv.prepend(aktuellLink)
  } else {
    const archiveLink = document.createElement('a')
    archiveLink.href = 'site/archive.html'
    archiveLink.innerHTML = 'Archive >'
    linksDiv.appendChild(archiveLink)
  }

  const hamburgerMenuA = document.createElement('a')
  hamburgerMenuA.href = 'javascript:void(0);'
  hamburgerMenuA.setAttribute('onclick', 'toggleHamburger()')
  hamburgerMenuA.classList.add('hamburger-icon-wrapper')
  hamburgerDiv.appendChild(hamburgerMenuA)

  const hamburgerIcon = document.createElement('span')
  hamburgerIcon.classList.add('hamburger-icon')
  hamburgerMenuA.appendChild(hamburgerIcon)

  const hamburgerExpanded = linksDiv.cloneNode(true)
  hamburgerExpanded.id = 'hamburger-expanded'
  const navbarHeight = document
    .querySelector('nav')
    .getBoundingClientRect().height
  hamburgerExpanded.style.top = `${navbarHeight}px`
  hamburgerDiv.parentElement.appendChild(hamburgerExpanded)

  function toggleHamburger(forceOff = false) {
    const hamburgerEpanded = document.querySelector('#hamburger-expanded')
    const currentlyHidden =
      getComputedStyle(hamburgerEpanded).getPropertyValue('display') === 'none'
    const hamburgerIconWrapper = document.querySelector(
      '.hamburger-icon-wrapper'
    )

    if (currentlyHidden && !forceOff) {
      document.querySelectorAll('#hamburger-links a').forEach(e => {
        e.style.display = 'none'
      })
      hamburgerEpanded.style.display = 'flex'
      hamburgerIconWrapper.classList.add('expanded')
    } else {
      hamburgerEpanded.style.removeProperty('display')
      hamburgerIconWrapper.classList.remove('expanded')
      reshapeMenu()
    }
  }

  function updateNavigation() {
    const nav = document.getElementsByTagName('nav')[0]

    // reset state
    const hamburgerLinks = nav.querySelectorAll('#hamburger-links a.actual-anchor')
    hamburgerLinks.forEach(l => l.classList.remove('current'))

    const windowHeight = window.innerHeight
    const navHeight = nav.clientHeight

    let currentPosition = null
    const anchors = Array.from(document.querySelectorAll('a.anchor'))

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i]
      const anchorTop = anchor.getBoundingClientRect().top

      // I am in the lower part of the screen or deeper
      if (anchorTop > (windowHeight - navHeight) / 2) {
        break
      }

      currentPosition = { anchor: anchor, index: i }

      // I am visible on screen
      if (anchorTop >= 0) {
        break
      }
    }

    let newHash = '#'
    if (currentPosition !== null) {
      hamburgerLinks[currentPosition.index].classList.add('current')

      newHash = '#' + currentPosition.anchor.id
    }

    if (newHash != window.location.hash) {
      history.replaceState(undefined, undefined, newHash)
    }
  }

  function reshapeMenu() {
    const hamburgerExpanded =
      document.querySelector('#hamburger-expanded').style.display === 'flex'
    if (hamburgerExpanded) {
      return
    }

    const theEntries = Array.from(
      document.querySelectorAll('#hamburger-links > a')
    )
    theEntries.reverse()
    theEntries.sort((a, b) => {
      const prioA = a.getAttribute('data-prio') ?? '0'
      const prioB = b.getAttribute('data-prio') ?? '0'
      return prioA - prioB
    })

    theEntries.forEach(a => a.style.removeProperty('display'))

    const menuLine = document.querySelector('#hamburger')
    const hamburger = document.querySelector('.hamburger-icon-wrapper')
    hamburger.style.display = 'none'
    for (const entry of theEntries) {
      if (menuLine.scrollWidth > menuLine.getBoundingClientRect().width) {
        entry.style.display = 'none'
        hamburger.style.display = 'block'
        // Next line is needed for Safari as otherwise the hamburger icon is not visible (but clickable) on window resizing and on iPhone. From https://stackoverflow.com/a/21947628
        hamburger.style.transform = 'translateZ(0)'
      } else {
        break
      }
    }
  }

  reshapeMenu()

  window.addEventListener('resize', reshapeMenu)

  const debounce = (callback, wait) => {
    let timeoutId = null
    return (...args) => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        callback(...args)
      }, wait)
    }
  }

  window.addEventListener('scroll', debounce(updateNavigation, 50))
  const resizeObserver = new ResizeObserver(() => {
    updateNavigation()
  })

  // start observing for resize
  resizeObserver.observe(document.querySelector('body'))

  window.toggleHamburger = toggleHamburger
})()
