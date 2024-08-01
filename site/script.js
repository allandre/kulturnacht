// dont pollute global namespace. Also this way we can better check what is used inside and what outside of this script.
(function() {
  var eventDate = new Date(2025, 8, 5, 18);

  var hamburgerMenuWidth = 1045;

  var currentPosition = null;
  function hideMenu() {
    $('#nav-trigger').prop('checked', false);
  }

  // calculate days until eventDate, and display on title image
  function showCountdown() {
    // get remaining days until event
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const today = Date.now();
    const diffDays = Math.round(Math.abs((eventDate - today) / oneDay));

    var $countdown = $('#countdown');
    const text = 'Noch ' + diffDays + ' Tage bis zur';
    $countdown.html(text);
  }

  function updateNavigation() {
    // reset state
    $('nav li').removeClass('current');

    var windowOffset = $(document).scrollTop();
    var windowHeight = $(window).height();
    var navHeight = $('nav').height();

    currentPosition = null;
    var $anchors = $('a.anchor');
    for (var i = 0; i < $anchors.length; i++) {
      var anchorTop = $anchors.eq(i).offset().top;
      if (anchorTop - windowOffset < (windowHeight - navHeight) / 2) {
        currentPosition = { $anchor: $anchors.eq(i), index: i };
        if (anchorTop > windowOffset) {
          // I am completely contained in the top half. Take me!
          break;
        }
      } else {
        break;
      }
    }

    if (currentPosition !== null) {
      $('nav li').eq(currentPosition.index).addClass('current');
      history.replaceState(
        undefined,
        undefined,
        '#' + currentPosition.$anchor.prop('id')
      );
    } else {
      history.replaceState(undefined, undefined, '#');
    }
  }

  // global and exported stuff
  window.addEventListener('load', () => {
    showCountdown();
  });

  window.addEventListener('resize', () => {
    var containerWidth = $('#container').width();
    if (containerWidth > hamburgerMenuWidth) {
      hideMenu();
    }
  });

  window.addEventListener('scroll', () => {
    updateNavigation();
  });

  window.hideMenu = hideMenu;
})();
