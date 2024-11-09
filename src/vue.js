import EventEmitter from './event.js';

// 创建一个继承自 EventEmitter 的类
class vueEmitter extends EventEmitter {}

window.vueEvent = new vueEmitter();

const elements = new WeakMap();
const ids = new Map();
window.__VUE_ELEMENTS__ = elements;
window.__VUE_IDS__ = ids;

function watchComponentUnmount(component) {
  if (!component.bum) component.bum = [];
  component.bum.push(() => {
    const element = component.vnode.el;
    if (element) {
      const components = elements.get(element);
      if (components?.length == 1) {
        elements.delete(element);
        ids.delete(component.uid);
      }
      else components?.splice(components.indexOf(component));
      if (element.__VUE__?.length == 1) element.__VUE__ = undefined;
      else element.__VUE__?.splice(element.__VUE__.indexOf(component));
    }
  });
}

function watchComponentMount(component) {
  let value;
  Object.defineProperty(component.vnode, "el", {
    get() {
      return value;
    },
    set(newValue) {
      value = newValue;
      if (value) recordComponent(component);
    },
  });
}

function recordComponent(component) {
  component.mi?.forEach((func) => func());
  let element = component.vnode.el;
  while (!(element instanceof HTMLElement)) {
    element = element.parentElement;
  }

  // Expose component to element's __VUE__ property
  if (element.__VUE__) element.__VUE__.push(component);
  else element.__VUE__ = [component];

  // Add class to element
  element.classList.add("vue-component");

  // Map element to components
  const components = elements.get(element);
  if (components) {
    components.push(component);
  }
  else {
    elements.set(element, [component]);
    ids.set(component.uid, [component])
  }

  watchComponentUnmount(component);
}

function createHook(key, component) {
  if (!component[key]) component[key] = [];
  return (callback) => component[key].push(callback);
}

function createWatch(component) {
  return (...args) => {
    if (component.proxy?.$watch) {
      // @ts-ignore
      return component.proxy.$watch(...args);
    } else {
      console.error("proxy.$watch not found");
    }
  };
}

function patchComponent(component) {
  try {
    component.onBeforeMount = createHook("bm", component);
    component.onMounting = createHook("mi", component);
    component.onMounted = createHook("m", component);
    component.onBeforeUpdate = createHook("bu", component);
    component.onUpdated = createHook("u", component);
    component.onBeforeUnmount = createHook("bum", component);
    component.onUnmounted = createHook("um", component);
    component.onServerPrefetch = createHook("sp", component);
    component.onRenderTriggered = createHook("rtg", component);
    component.onRenderTracked = createHook("rtc", component);
    component.watch = createWatch(component);

    vueEvent.emit("on-vue-create", component);
  } catch (error) {
    console.error(error);
  }
}
function hookVue3() {
  window.Proxy = new Proxy(window.Proxy, {
    construct(target, [proxyTarget, proxyHandler]) {
      const component = proxyTarget?._;
      if (component?.uid >= 0) {
        patchComponent(component);
        const element = component.vnode.el;
        if (element) recordComponent(component);
        else watchComponentMount(component);
      }
      return new target(proxyTarget, proxyHandler);
    },
  });
}

hookVue3();
