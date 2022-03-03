const TEXT_ELEMENT = "TEXT ELEMENT"

// fiber = {                                      对象结构
//   tag: HOST_COMPONENT,                         fiber类型
//   type: "div",                                 元素标签
//   parent: parentFiber,                         链表-父级元素引用
//   child: childFiber,                           链表-子级元素引用（第一个子元素）
//   sibling: null,                               链表-兄弟元素引用（后一个兄弟）
//   alternate: currentFiber,                     缓存-上次缓存的fiber，旧树
//   stateNode: document.createElement("div"),    HOST_COMPONENT、HOST_ROOT-dom元素，CLASS_COMPONENT-实例引用
//   props: { children: [], className: "foo"},    jsx解析的对象属性
//   partialState: null,                          更新的state数据
//   effectTag: PLACEMENT,                        更新的操作类型
//   effects: []                                  搜索所有更新子元素的fiber
// }
// 创xeact元素
function createElement (type, config, ...args) {
  const props = Object.assign({}, config)
  const hasChildren = args.length > 0
  const rawChildren = hasChildren ? [].concat(...args) : []
  props.children = rawChildren
    .filter((c) => c != null && c !== false)
    .map((c) => (c instanceof Object ? c : createTextElement(c)))
  return { type, props }
}
// 统一Xeact元素格式
function createTextElement (value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value })
}
// 属性是否为事件
const isEvent = (name) => name.startsWith("on")
// 属性是否为事件、子元素、样式
const isAttribute = (name) =>
  !isEvent(name) && name != "children" && name != "style"
// 属性是否为新属性
const isNew = (prev, next) => (key) => prev[key] !== next[key]
// 属性是否为旧属性
const isGone = (prev, next) => (key) => !(key in next)
// 更新属性(事件、样式、属性)
function updateDomProperties (dom, prevProps, nextProps) {
  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  // Remove attributes
  Object.keys(prevProps)
    .filter(isAttribute)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = null
    })

  // Set attributes
  Object.keys(nextProps)
    .filter(isAttribute)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name]
    })

  // Set style
  prevProps.style = prevProps.style || {}
  nextProps.style = nextProps.style || {}
  Object.keys(nextProps.style)
    .filter(isNew(prevProps.style, nextProps.style))
    .forEach((key) => {
      dom.style[key] = nextProps.style[key]
    })
  Object.keys(prevProps.style)
    .filter(isGone(prevProps.style, nextProps.style))
    .forEach((key) => {
      dom.style[key] = ""
    })

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}
// 创建、更新dom
function createDomElement (fiber) {
  const isTextElement = fiber.type === TEXT_ELEMENT
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(fiber.type)
  updateDomProperties(dom, [], fiber.props)
  return dom
}

// Fiber tags
const HOST_COMPONENT = "host" // html元素标签
const CLASS_COMPONENT = "class" // 自定义类组件
const FUNCTION_COMPONENT = "function" // 自定义函数组件
const HOST_ROOT = "root" // 根元素标签

// Effect tags
const PLACEMENT = 1 // 新增
const DELETION = 2 // 删除
const UPDATE = 3 // fiber.type相同---更新

const ENOUGH_TIME = 1 // 检测运行另一个工作单元的时间，默认为每一个单元执行时间为1s；

// Global state
const updateQueue = [] // 待处理更新队列
let nextUnitOfWork = null // 下一个fiber工作
let pendingCommit = null // 完成当前更新后，commitAllWork所有pendingCommit的effects
let wipFiberRoot = null // 暂存当前fiber
let hookIndex = null // 当前fiber的hooks索引

// 程序入口，初始化队列
function render (elements, containerDom) {
  updateQueue.push({
    from: HOST_ROOT,
    dom: containerDom,
    newProps: { children: elements },
  })

  // 在requestIdleCallback注册 performWork 任务。
  // 表示浏览器每一帧渲染的空闲时间里去执行 performWork 任务
  requestIdleCallback(performWork)
}
// 更新
function scheduleUpdate (instance, partialState) {
  updateQueue.push({
    from: CLASS_COMPONENT,
    instance: instance,
    partialState: partialState,
  })
  requestIdleCallback(performWork)
}
// 任务时间安排
function performWork (deadline) {
  // 在当前帧空闲时间段执行任务循环 workLoop
  workLoop(deadline)
  // 本次更新存在未执行完工作或者队列存在其他更新任务则加入下一次requestIdleCallback 任务里执行
  if (nextUnitOfWork || updateQueue.length > 0) {
    requestIdleCallback(performWork)
  }
}
// 执行Xeact核心对比工作
function workLoop (deadline) {
  // 本次更新无任务执行，则取出更新队列中的任务
  if (!nextUnitOfWork) {
    resetNextUnitOfWork()
  }

  // 存在未完成工作 且有任务则继续执行 任务
  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork) // 循环执行
  }

  // 本次工作全部完成，提交全部dom变更
  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}
// 重置工作
function resetNextUnitOfWork () {
  const update = updateQueue.shift() // 取出队列中的任务
  if (!update) {
    return
  }
  // Copy the setState parameter from the update payload to the corresponding fiber
  if (update.partialState) {
    update.instance.__fiber.partialState = update.partialState
  }
  // root赋值为上次更新缓存的根节点（旧根节点）
  const root =
    update.from == HOST_ROOT
      ? update.dom._rootContainerFiber
      : update.from == FUNCTION_COMPONENT
        ? getRoot(update.alternate)
        : getRoot(update.instance.__fiber)
  // 任务从根节点开始
  nextUnitOfWork = {
    tag: HOST_ROOT,
    stateNode: update.dom || root.stateNode,
    props: update.newProps || root.props,
    alternate: root,
  }
}
// 递归找出根节点
function getRoot (fiber) {
  let node = fiber
  while (node.parent) {
    node = node.parent
  }
  return node
}
// 执行工作
function performUnitOfWork (wipFiber) {
  beginWork(wipFiber) // 对比wipFiber的所有子元素
  if (wipFiber.child) {
    // 存在第一个子元素则返回子元素，继续执行工作（深度优先遍历）
    return wipFiber.child
  }

  // 如果没有child 就找兄弟元素
  let uow = wipFiber
  while (uow) {
    completeWork(uow) // 合并effects到父元素
    if (uow.sibling) {
      // 找到后面的兄弟元素，继续执行工作
      // Sibling needs to beginWork
      return uow.sibling
    }
    uow = uow.parent // 无兄弟元素则合并effects，继续查到父元素的兄弟元素
  }
}
// 开始工作
function beginWork (wipFiber) {
  if (wipFiber.tag == CLASS_COMPONENT) {
    updateClassComponent(wipFiber)
  } else if (wipFiber.tag == FUNCTION_COMPONENT) {
    updateFunctionComponent(wipFiber)
  } else {
    updateHostComponent(wipFiber)
  }
}
// 更新html元素组件
function updateHostComponent (wipFiber) {
  if (!wipFiber.stateNode) {
    // 不存在直接新建
    wipFiber.stateNode = createDomElement(wipFiber)
  }
  const newChildElements = wipFiber.props.children
  reconcileChildrenArray(wipFiber, newChildElements)
}
// 更新自定义函数组件
function updateFunctionComponent (fiber) {
  wipFiberRoot = fiber // 全局变量，设置为当前fiber的引用
  hookIndex = 0 // 全局变量，设置为当前fiber的state下标
  wipFiberRoot.hooks = [] // 清空hooks数组
  const newChildElements = fiber.type(fiber.props) // 执行function函数
  reconcileChildrenArray(fiber, newChildElements)
}
// 更新自定义组件
function updateClassComponent (wipFiber) {
  let instance = wipFiber.stateNode
  if (instance == null) {
    //组件第一次创建，实例为空，创建一个实例并赋值给stateNode
    // Call class constructor
    instance = wipFiber.stateNode = createInstance(wipFiber)
  } else if (wipFiber.props == instance.props && !wipFiber.partialState) {
    // No need to render, clone children from last time
    cloneChildFibers(wipFiber)
    return
  }

  instance.props = wipFiber.props
  instance.state = Object.assign({}, instance.state, wipFiber.partialState)
  wipFiber.partialState = null
  const newChildElements = wipFiber.stateNode.render() // 调用自定义组价实例的render方法，获取最新的Xeact元素
  reconcileChildrenArray(wipFiber, newChildElements)
}
// 数组验证，转换成数组
function arrify (val) {
  return val == null ? [] : Array.isArray(val) ? val : [val]
}
// 对比子元素
function reconcileChildrenArray (wipFiber, newChildElements) {
  const elements = arrify(newChildElements)

  let index = 0
  let oldFiber = wipFiber.alternate ? wipFiber.alternate.child : null // 获取fiber对象的子元素，child为fiber对象的第一个子元素，且只会存在一个子元素的引用
  let newFiber = null
  while (index < elements.length || oldFiber != null) {
    const prevFiber = newFiber
    const element = index < elements.length && elements[index] // 获取最新的Xeact元素
    const sameType = oldFiber && element && element.type == oldFiber.type // 判断类型

    if (sameType) {
      //类型相同 newFiber打上更新tag
      newFiber = {
        type: oldFiber.type,
        tag: oldFiber.tag,
        stateNode: oldFiber.stateNode,
        props: element.props,
        parent: wipFiber,
        alternate: oldFiber,
        partialState: oldFiber.partialState,
        effectTag: UPDATE,
      }
    }

    if (element && !sameType) {
      //类型不同，存在新元素 newFiber打上新增tag
      newFiber = {
        type: element.type,
        tag:
          typeof element.type === "string"
            ? HOST_COMPONENT
            : typeof element.type === "function"
              ? FUNCTION_COMPONENT
              : CLASS_COMPONENT,
        props: element.props,
        parent: wipFiber,
        effectTag: PLACEMENT,
      }
    }

    if (oldFiber && !sameType) {
      // 类型不同，存在旧元素 oldFiber打上删除tag
      oldFiber.effectTag = DELETION
      wipFiber.effects = wipFiber.effects || []
      wipFiber.effects.push(oldFiber) // 删除不会创建newFiber，所以直接将oldFiber加入到父元素的effects
    }

    if (oldFiber) {
      // 遍历fiber的兄弟元素
      oldFiber = oldFiber.sibling
    }

    if (index == 0) {
      // 把第一个元素引用放在父元素的child中
      wipFiber.child = newFiber
    } else if (prevFiber && element) {
      prevFiber.sibling = newFiber // 把当前元素放在上一个元素的sibling中
    }

    index++
  }
}
// 克隆fiber子元素
function cloneChildFibers (parentFiber) {
  const oldFiber = parentFiber.alternate
  if (!oldFiber.child) {
    return
  }

  let oldChild = oldFiber.child
  let prevChild = null
  while (oldChild) {
    const newChild = {
      type: oldChild.type,
      tag: oldChild.tag,
      stateNode: oldChild.stateNode,
      props: oldChild.props,
      partialState: oldChild.partialState,
      alternate: oldChild,
      parent: parentFiber,
    }
    if (prevChild) {
      prevChild.sibling = newChild
    } else {
      parentFiber.child = newChild
    }
    prevChild = newChild
    oldChild = oldChild.sibling
  }
}
// 搜集每个fiber的effects到父节点
function completeWork (fiber) {
  if (fiber.tag == CLASS_COMPONENT) {
    fiber.stateNode.__fiber = fiber
  }

  if (fiber.parent) {
    const childEffects = fiber.effects || [] // 当前fiber的子元素effects
    const thisEffect = fiber.effectTag != null ? [fiber] : [] // 当前fiber的effects
    const parentEffects = fiber.parent.effects || [] // 当前fiber的父元素effects
    fiber.parent.effects = parentEffects.concat(childEffects, thisEffect) // 全部合并到父元素的effects中
  } else {
    pendingCommit = fiber // 不存在父元素，说明已经到达顶层，设置当前fiber为最终提交的fiber
  }
}
// 提交所有工作，此时fiber的effects里面保存了所有存在变更标签的子元素fiber
function commitAllWork (fiber) {
  fiber.effects.forEach((f) => {
    // 循环提交工作
    commitWork(f)
  })
  // 重置
  fiber.stateNode._rootContainerFiber = fiber
  nextUnitOfWork = null
  pendingCommit = null
}
// 执行每个fiber的effect工作
function commitWork (fiber) {
  if (fiber.tag == HOST_ROOT) {
    // 如果是根fiber则不执行
    return
  }

  let domParentFiber = fiber.parent //找到最近的一个tag不为虚拟dom的父级fiber
  while (
    domParentFiber.tag == CLASS_COMPONENT ||
    domParentFiber.tag == FUNCTION_COMPONENT
  ) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.stateNode // 获取真实的dom元素

  if (fiber.effectTag == PLACEMENT && fiber.tag == HOST_COMPONENT) {
    // 新增
    domParent.appendChild(fiber.stateNode) // 直接添加到dom
  } else if (fiber.effectTag == UPDATE) {
    // 更新
    updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag == DELETION) {
    // 删除
    commitDeletion(fiber, domParent) // 执行删除工作
  }
}
// 删除fiber，循环删除所有dom，考虑各种真实dom和虚拟dom情况
function commitDeletion (fiber, domParent) {
  let node = fiber
  while (true) {
    if (node.tag == CLASS_COMPONENT) {
      // 找到最近的一个tag不为虚拟dom的子级fiberA
      node = node.child
      continue
    }
    domParent.removeChild(node.stateNode) // 直接移除该元素
    while (node != fiber && !node.sibling) {
      // 如果fiberA不是fiber，并且不存在兄弟fiber，则继续查找fiberA父级
      node = node.parent
    }
    if (node == fiber) {
      // 直到fiberA回到最初的fiber。循环结束，dom删除完毕
      return
    }
    node = node.sibling // 查找兄弟fiber
  }
}

class Component {
  constructor(props) {
    this.props = props || {}
    this.state = this.state || {}
  }

  setState (partialState) {
    scheduleUpdate(this, partialState)
  }
}
// 创建fiber实例
function createInstance (fiber) {
  const instance = new fiber.type(fiber.props)
  instance.__fiber = fiber
  return instance
}

function useState (initial) {
  // function函数，执行useState，如果存在上次的state状态，则取出上次缓存hooks
  const oldHook =
    wipFiberRoot.alternate &&
    wipFiberRoot.alternate.hooks &&
    wipFiberRoot.alternate.hooks[hookIndex]
  const hook = { state: oldHook ? oldHook.state : initial, queue: [] }
  const actions = oldHook ? oldHook.queue : [] // 获取fiber上hooks的更新队列
  actions.forEach((action) => {
    // 更新state
    if (typeof action === "function") {
      // setState执行方法
      hook.state = action(hook.state)
    } else {
      hook.state = action // setState设置值
    }
  })
  const currentRoot = wipFiberRoot // 当前fiber引用
  const setState = (action) => {
    hook.queue.push(action) // 放入当前hook更新队列中
    updateQueue.push({
      // 执行任务
      from: FUNCTION_COMPONENT,
      props: currentRoot.props,
      alternate: currentRoot,
    })
    requestIdleCallback(performWork)
  }
  wipFiberRoot.hooks.push(hook) // 放入fiber的hooks数组中
  hookIndex++
  return [hook.state, setState]
}
var didact = {
  createElement,
  Component,
  useState,
  render,
}

export { createElement, Component, render }
export default didact