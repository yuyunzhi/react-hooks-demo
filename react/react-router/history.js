const BeforeUnloadEventType = 'beforeunload'
const HashChangeEventType = 'hashchange'
const PopStateEventType = 'popstate'

// 将对象编译成 path
const createPath = ({
    pathname = '/',
    search = '',
    hash = ''
}) => {
    return pathname + search + hash
}

// 将 path 解析成 location 对象
const parsePath = (path) => {
    let partialPath = {}
    if (path) {
        let hashIndex = path.indexOf('#')
        if (hashIndex >= 0) {
            partialPath.hash = path.substr(hashIndex)
            path = path.substr(0, hashIndex)
        }
        let searchIndex = path.indexOf('?')
        if (searchIndex >= 0) {
            partialPath.search = path.substr(searchIndex)
            path = path.substr(0, searchIndex)
        }
        if (path) {
            partialPath.pathname = path
        }
    }
    return partialPath
}

// 获取将要跳转的 location 对象
const getNextLocation = (to, state = null) => {
    return {
        ...(typeof to === 'string' ? parsePath(to) : to),
        state
    }
}

/**
 * 事件发布的构造器
 * @returns
 */
const createEvents = () => {
    const handlers = []
    return {
        get length () {
            return handlers.length
        },
        push (fn) {
            handlers.push(fn)
            // 返回一个解绑器
            return () => handlers.filter(f => f !== fn)
        },
        call (arg) {
            handlers.forEach(fn => fn && fn(arg))
        }
    }
}

/**
 * popstate 事件监听
 * listeners 接收监听器并订阅 popstate 的改变
 * 包装 push、replace、go、back、forward
 * 需要注意的是调用history.pushState()或history.replaceState()不会触发popstate事件。
 * 只有在做出浏览器动作时，才会触发该事件, 如用户点击浏览器的回退按钮
 * （或者在Javascript代码中调用history.back()或者history.forward()方法）
 */
const ACTION = {
    POP: 'pop',
    PUSH: 'push',
    REPLACE: 'replace'
}

/**
 * TODO: block 路由跳转拦截
 * TODO: react-router 还未与新版 history 的 push 兼容
 * @returns
 */

 // 点击a标签事件，阻止默认事件，获取pathname 更新视图
export const createBrowserHistory = () => {
    const globalHistory = window.history
    // 获取当前 location + history state
    const getLocation = () => {
        const { pathname, search, hash } = window.location
        const state = globalHistory.state || {}
        return {
            pathname,
            search,
            hash,
            state
        }
    }
    // 组合将要跳转的字符串 url
    const createHref = (to) => {
        return typeof to === 'string' ? to : createPath(to)
    }
    // 获取将要跳转 state url
    const getHistoryStateAndUrl = (nextLocation) => {
        return [
            nextLocation.state,
            createHref(nextLocation)
        ]
    }
    // 应用所有 listener
    const applyListen = (action) => {
        listeners.call({
            action,
            location: getLocation()
        })
    }
    // 监听路由变化
    const handlePop = () => {
        applyListen(ACTION.POP)
    }
    window.addEventListener(PopStateEventType, handlePop)

    // 创建监听者
    const listeners = createEvents()

    // 1、history 跳转，点击a标签事件然后在事件内部 使用pushState修改页面路由（不会触发popState），
    // 同时手动更新视图，此处使用的是applyListen(ACTION.PUSH)
    // 2、当history.back的时候，则会触发 popState 。 此处手动更新视图是 handlePop
    const push = (to, state) => {
        const [historyState, url] = getHistoryStateAndUrl(getNextLocation(to, state))
        try {
            globalHistory.pushState(historyState, '', url)
        } catch (error) {
            window.location.assign(url)
        }
        applyListen(ACTION.PUSH)
    }

    const replace = (to, state) => {
        const [historyState, url] = getHistoryStateAndUrl(getNextLocation(to, state))
        globalHistory.replaceState(historyState, '', url)
        applyListen(ACTION.REPLACE)
    }

    const go = (delta) => {
        globalHistory.go(delta)
    }
    return {
        get location () {
            return getLocation()
        },
        push,
        replace,
        go,
        back () {
            go(-1)
        },
        forward () {
            go(1)
        },
        listen (listenerFn) {
            return listeners.push(listenerFn)
        },
        createHref
    }
}


// 点击修改 #/xxx hash值，修改视图
export const createHashHistory = () => {
    const globalHistory = window.history
    const getLocation = () => {
        const { pathname = '/', search = '', hash = '' } = parsePath(
            window.location.hash.substr(1)
        )
        const state = globalHistory.state || {}
        return {
            pathname,
            search,
            hash,
            state
        }
    }
    const getBaseHref = () => {
        let base = document.querySelector('base')
        let href = ''
        if (base && base.getAttribute('href')) {
            let url = window.location.href
            let hashIndex = url.indexOf('#')
            href = hashIndex === -1 ? url : url.slice(0, hashIndex)
        }
        return href
    }
    // 拿到基础url，再将 hash 路由拼接成 path
    const createHref = (to) => {
        return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to))
    }
    const getHistoryStateAndUrl = (nextLocation) => {
        return [
            nextLocation.state,
            createHref(nextLocation)
        ]
    }
    const applyListen = (action) => {
        listeners.call({
            action,
            location: getLocation()
        })
    }
    const handlePop = () => {
        applyListen(ACTION.POP)
    }
    window.addEventListener(PopStateEventType, handlePop)
    window.addEventListener(HashChangeEventType, handlePop)

    const listeners = createEvents()

    // 1、hash跳转，当点击a标签hash路由改变，此时会触发 hashchange事件，手动更新视图的方法为 handlePop
    
    const push = (to, state) => {
        const [historyState, url] = getHistoryStateAndUrl(getNextLocation(to, state))
        try {
            globalHistory.pushState(historyState, '', url)
        } catch (error) {
            window.location.assign(url)
        }
        applyListen(ACTION.PUSH)
    }

    const replace = (to, state) => {
        const [historyState, url] = getHistoryStateAndUrl(getNextLocation(to, state))
        globalHistory.replaceState(historyState, '', url)
        applyListen(ACTION.REPLACE)
    }

    const go = (delta) => {
        globalHistory.go(delta)
    }
    return {
        get location () {
            return getLocation()
        },
        push,
        replace,
        go,
        back () {
            go(-1)
        },
        forward () {
            go(1)
        },
        listen (listener) {
            return listeners.push(listener)
        },
        createHref
    }
}