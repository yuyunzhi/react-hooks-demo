
// 原生js实现historyRouter
// 对标签进行进行 click 监听，并阻止默认事件 e.preventDefault()
// 然后通过 history.pusState进行跳转 ，同时changeView修改页面展示的元素

//能够实现history路由跳转不刷新页面得益与H5提供的pushState(),replaceState()等方法，
// 这些方法都是也可以改变路由状态（路径），但不作页面跳转，我们可以通过location.pathname来显示对应的视图

window.addEventListener('DOMContentLoaded', onLoad)

// 如果使用了history.back 才会触发，pushstate是不会触发popstate 事件的

window.addEventListener('popstate', () => {
  console.log('popstate')
  changeView('popstate')
})

let routeView = ''

function onLoad () {

  routeView = document.getElementById('routeView')

  changeView('onLoad')

  let event = document.getElementsByTagName('ul')[0]

  event.addEventListener('click', (e) => {

    if (e.target.nodeName === 'A') {
      e.preventDefault()

      history.pushState(null, "", e.target.getAttribute('href'))

      changeView('click')
    }

  })
}

function changeView (from) {
  console.log('from', from)
  switch (location.pathname) {
    case '/home':
      routeView.innerHTML = 'home'
      break
    case '/about':
      routeView.innerHTML = 'about'
      break
  }

}
