function locationNumberSpan(number) {
  return `<span class="location-number" data-number="${number}"><span>${number}</span></span>`
}

// hack to be able to import this file in node and in the browser
if (typeof module !== 'undefined') {
  module.exports = locationNumberSpan // eslint-disable-line no-undef
}
