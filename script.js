const hamburgerMenuWidth = 1045;

var currentPosition = null;

var impressions = ["Artischock Seehof 2.jpg","Artischock Seehof.jpg","fanfare terrible.JPG","fanfare terrible2.JPG","fanfare terrible5.JPG","Haus CG Jung 1.jpg","Haus CG Jung 2.jpg","IMG_1416.JPG","IMG_1420.JPG","IMG_1422.JPG","IMG_1424.JPG","IMG_1426.JPG","IMG_1428.JPG","IMG_1429.JPG","IMG_1433.JPG","IMG_1434.JPG","IMG_1435.JPG","IMG_1436.JPG","IMG_1437.JPG","IMG_1439.JPG","IMG_1440.JPG","IMG_1442.JPG","IMG_1453.JPG","IMG_1454.JPG","IMG_1455.JPG","IMG_1456.JPG","IMG_1457.JPG","IMG_1458.JPG","IMG_1460.JPG","IMG_1463.JPG","IMG_1465.JPG","IMG_1469.JPG","IMG_1473.JPG","IMG_1477.JPG","IMG_1482.JPG","IMG_1485.JPG","IMG_1487.JPG","IMG_1489.JPG","IMG_1490.JPG","IMG_1496.JPG","IMG_1499.JPG","IMG_1500.JPG","IMG_1501.JPG","IMG_1506.JPG","IMG_1507.JPG","IMG_1508.JPG","IMG_1526.JPG","IMG_6802.jpg","IMG_8558.JPG","IMG_8566.JPG","IMG_8577.JPG","IMG_8592.JPG","IMG_8599.JPG","IMG_8602.JPG","Lesung1.jpg"];
var index = 0;

function updateNavigation() {
  // reset state
  $('nav li').removeClass('current');

  const windowOffset = $(document).scrollTop();
  const windowHeight = $(window).height();
  const navHeight = $('nav').height();

  currentPosition = null;
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
