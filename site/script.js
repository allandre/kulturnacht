// dont pollute global namespace. Also this way we can better check what is used inside and what outside of this script.
;(function () {
  var eventDate = new Date(2025, 8, 5, 18)

  var hamburgerMenuWidth = 1045

  var currentPosition = null
  function hideMenu() {
    const navTrigger = document.getElementById('nav-trigger')
    navTrigger.checked = false
  }

  // calculate days until eventDate, and display on title image
  function showCountdown() {
    // get remaining days until event
    const oneDay = 24 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
    const today = Date.now()
    const diffDays = Math.round(Math.abs((eventDate - today) / oneDay))

    var countdownElement = document.getElementById('countdown')
    if (countdownElement) {
      const text = 'Noch ' + diffDays + ' Tage bis zur'
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
    var windowOffset = html.scrollTop
    var windowHeight = window.innerHeight
    var navHeight = nav.clientHeight

    currentPosition = null
    var anchors = Array.from(document.querySelectorAll('a.anchor'))

    for (var i = 0; i < anchors.length; i++) {
      const anchor = anchors[i]
      var anchorTop = anchor.getBoundingClientRect().top

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
    var containerWidth = container.clientWidth
    if (containerWidth > hamburgerMenuWidth) {
      hideMenu()
    }
  })

  window.addEventListener('scroll', () => {
    updateNavigation()
  })

  window.hideMenu = hideMenu
})()
