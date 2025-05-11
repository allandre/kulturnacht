// Don't pollute global namespace. Also this way we can better check what is used inside and what outside of this script.
;(function () {
  const hamburgerMenuWidth = 1045

  let currentPosition = null

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
    const label = anchor.getAttribute('data-label')
    if (!label) {
      continue
    }

    const link = document.createElement('a')
    link.href = `#${anchor.id}`
    link.innerHTML = label
    linksDiv.appendChild(link)
  }
  const archiveLink = document.createElement('a')
  archiveLink.href = 'site/archive.html'
  archiveLink.innerHTML = 'Archive >'
  linksDiv.appendChild(archiveLink)

  const hamburgerMenuA = document.createElement('a')
  hamburgerMenuA.href = 'javascript:void(0);'
  hamburgerMenuA.onclick = 'toggleHamburger()'
  hamburgerMenuA.classList.add('hamburger-icon-wrapper')
  hamburgerDiv.appendChild(hamburgerMenuA)

  const hamburgerIcon = document.createElement('span')
  hamburgerIcon.classList.add('hamburger-icon')
  hamburgerMenuA.appendChild(hamburgerIcon)

  function toggleHamburger() {
    const x = document.getElementById('hamburger-links')
    if (x.style.display === 'block') {
      x.style.display = 'none'
    } else {
      x.style.display = 'block'
    }
  }

  function hideMenu() {
    const navTrigger = document.getElementById('nav-trigger')
    navTrigger.checked = false
  }

  function updateNavigation() {
    const nav = document.getElementsByTagName('nav')[0]

    // reset state
    const hamburgerLinks = nav.querySelectorAll('#hamburger-links a')
    hamburgerLinks.forEach(l => l.classList.remove('current'))

    const html = document.querySelector('html')
    const windowOffset = html.scrollTop
    const windowHeight = window.innerHeight
    const navHeight = nav.clientHeight

    currentPosition = null
    const anchors = Array.from(document.querySelectorAll('a.anchor'))

    console.log({windowOffset})
    console.log({windowHeight})

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i]
      const anchorTop = anchor.getBoundingClientRect().top

      console.log(anchor.id)
      console.log({anchorTop})

      // I am in the lower part of the screen or deeper
      if (anchorTop - windowOffset > (windowHeight - navHeight) / 2) {
        break
      }

      currentPosition = { anchor: anchor, index: i }

      // I am visible on screen
      if (anchorTop - windowOffset < (windowHeight - navHeight) / 2) {
        break
      }


      // if (anchorTop - windowOffset < (windowHeight - navHeight) / 2) {
      //   currentPosition = { anchor: anchor, index: i }
      //   if (anchorTop > windowOffset) {
      //     // I am completely contained in the top half. Take me!
      //     break
      //   }
      // } else {
      //   break
      // }
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

  window.addEventListener('resize', () => {
    const container = document.getElementById('container')
    const containerWidth = container.clientWidth
    if (containerWidth > hamburgerMenuWidth) {
      hideMenu()
    }
  })

  const debounce = (callback, wait) => {
    let timeoutId = null
    return (...args) => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        callback(...args)
      }, wait)
    }
  }

  window.addEventListener('scroll', debounce(updateNavigation, 100))

  window.hideMenu = hideMenu
  window.toggleHamburger = toggleHamburger
})()
