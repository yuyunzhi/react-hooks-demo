window.addEventListener('DOMContentLoaded', onLoad)
window.addEventListener('hashchange', changeView)

let routeView = ''

function onLoad () {
  routeView = document.getElementById('routeView')
  changeView()
}

function changeView () {
  switch (location.hash) {
    case '#/home':
      routeView.innerHTML = 'home'
      break
    case '#/about':
      routeView.innerHTML = 'about'
      break
  }
}
