
// 原生js实现hashRouter主要是监听它的hashchange事件的变化，然后拿到对应的location.hash更新对应的视图

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
