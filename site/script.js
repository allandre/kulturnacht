// dont pollute global namespace. Also this way we can better check what is used inside and what outside of this script.
;(function () {
  const hamburgerMenuWidth = 1045

  let currentPosition = null
  function hideMenu() {
    const navTrigger = document.getElementById('nav-trigger')
    navTrigger.checked = false
  }

  // calculate days until eventDate, and display on title image
  function showCountdown() {
    const eventDate = new Date(2025, 8, 5) // 5.9.25 // month is 0 indexed.

    // get remaining days until event
    const oneDay = 24 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
    const today = Date.now()
    const diffDays = Math.round((eventDate - today + oneDay) / oneDay)

    const countdownElement = document.getElementById('countdown')
    if (countdownElement) {
      let text = 'Noch ' + diffDays + ' Tage bis zur'

      switch (diffDays) {
        case 2:
          text = 'Übermorgen ist die'
          break
        case 1:
          text = 'Morgen ist die'
          break
        case 0:
          text = 'Heute ist die'
          break
      }

      if (diffDays < 0) {
        text = "Das war's! Bis zum nächsten Mal bei der"
      }

      countdownElement.innerHTML = text
    }
  }

  function updateNavigation() {
    const nav = document.getElementsByTagName('nav')[0]
    // reset state
    const navListItems = nav.getElementsByTagName('li')
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

    if (currentPosition !== null) {
      navListItems[currentPosition.index].classList.add('current')

      history.replaceState(
        undefined,
        undefined,
        '#' + currentPosition.anchor.id
      )
    } else {
      history.replaceState(undefined, undefined, '#')
    }
  }

  // global and exported stuff
  window.addEventListener('load', () => {
    showCountdown()
  })

  window.addEventListener('resize', () => {
    const container = document.getElementById('container')
    const containerWidth = container.clientWidth
    if (containerWidth > hamburgerMenuWidth) {
      hideMenu()
    }
  })

  window.addEventListener('scroll', () => {
    updateNavigation()
  })

  window.hideMenu = hideMenu
})()
