/**
 * sitewide js... add to index.html
 */

function isIE () {
  // IE 10 and IE 11
  return /Trident\/|MSIE/.test(window.navigator.userAgent)
}

(function () {
  if (document.documentMode || isIE()) {
    /* browser is IE... */
    const ieMsg = `
        <!--[if IE]>
        <div class="iesucks" style="margin: 66px">
        <h2>This Site Does Not Support IE</h2>
        I've spent too much of my life working around Internet Explorer issues... never again. My apologies to you, an IE user... I'm sure you're a lovely human being but from now on, I will require <i>you to work around IE's issues</i>. Please install ANY OTHER BROWSER including Edge if you like... good luck!
        </div>
        <![endif]-->
      `
    return ieMsg
  }
})()

/* eslint-disable no-unused-vars */
function toggleHamburger () {
  const links = document.querySelector('nav #links')
  if (links.style.display === 'block') { // is visible
    links.style.display = 'none'
  } else {
    links.style.display = 'block'
  }
}
