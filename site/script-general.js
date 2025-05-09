// dont pollute global namespace. Also this way we can better check what is used inside and what outside of this script.
;(function () {
  const hamburgerMenuWidth = 1045

  let currentPosition = null
  function hideMenu() {
    const navTrigger = document.getElementById('nav-trigger')
    navTrigger.checked = false
  }

  function updateNavigation() {
    const nav = document.getElementsByTagName('nav')[0]
    // reset state
    const navListItems = nav.querySelectorAll('li:not(:has(.no-navigation))')
    for (const navListItem of navListItems) {
      navListItem.classList.remove('current')
    }

    const html = document.querySelector('html')
    const windowOffset = html.scrollTop
    const windowHeight = window.innerHeight
    const navHeight = nav.clientHeight

    currentPosition = null
    const anchors = Array.from(document.querySelectorAll('a.anchor'))

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i]
      const anchorTop = anchor.getBoundingClientRect().top

      if (anchorTop - windowOffset < (windowHeight - navHeight) / 2) {
        currentPosition = { anchor: anchor, index: i }
        if (anchorTop > windowOffset) {
          // I am completely contained in the top half. Take me!
          break
        }
      } else {
        break
      }
    }

    let newHash = '#'
    if (currentPosition !== null) {
      navListItems[currentPosition.index].classList.add('current')

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
})()
