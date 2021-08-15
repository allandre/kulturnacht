const hamburgerMenuWidth = 1045;

function updateNavigation() {
  // reset state
  $('nav li').removeClass('current');

  const windowOffset = $(document).scrollTop();
  const windowHeight = $(window).height();
  const navHeight = $('nav').height();

  let currentPosition = null;
  const $anchors = $('a.anchor');
  for (let i = 0; i < $anchors.length; i += 1) {
    const anchorTop = $anchors.eq(i).offset().top;
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
    window.history.replaceState(undefined, undefined, `#${currentPosition.$anchor.prop('id')}`);
  } else {
    window.history.replaceState(undefined, undefined, '#');
  }
}

function hideMenu() {
  $('#nav-trigger').prop('checked', false);
}

// calculate days until eventDate, and display on title image
function showCountdown() {
  // get remaining days until event
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDate = new Date(2021, 8, 3);
  const days = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24)).toFixed(0);

  let text = '';
  if (days === 0) {
    text = 'Heute ist die ';
  } else {
    text = `Noch ${days} Tage bis zur`;
  }

  const $countdown = $('#countdown');
  $countdown.html(text);
  /* $countdown.css("display", "unset");  -> IE CANNOT HANDLE THAT */
}

$(document).ready(() => {
  showCountdown();
});

$(window).on('resize', () => {
  const containerWidth = $('#container').width();
  if (containerWidth > hamburgerMenuWidth) {
    hideMenu();
  }
});

$(window).on('scroll', () => updateNavigation());
