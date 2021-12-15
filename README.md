## 项目简介

此项目是跟着慕课网的视频完成的。

项目使用了 Vue、vue-router、Vuex、axios、Scss。

项目实现了登录、注册、首页、商户页面、提交订单页面，这些页面体现了主要的知识点。

## 项目的知识点

1. BEM 的命名规范

BEM 是指 block、 element 和 modifier，即块、元素和修饰符。块中多个单词的分割用 `-` ，如 `view-container`，块与元素之间的分割用 `__` ，如 `view-container__content`，元素与修饰符之间用 `--` 分割，如 `view-container__content--active`。

2. Scss

Sass 是一款强化 CSS 的辅助工具，它在 CSS 语法的基础上增加了变量 (variables) `$`、嵌套 (nested rules) `&`、混合 (mixins) `@mixin` `@include`、导入 (inline imports) `@import`等高级功能。

[Sass 中文网](https://www.sass.hk/guide/)

3. vue-router

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    // 异步路由
    component: () => import(/* webpackChunkName: "home" */ '../views/home/Home')
  },
  {
    // shop 后附带 id 数据
    path: '/shop/:id',
    name: 'Shop',
    component: () => import(/* webpackChunkName: "shop" */ '../views/shop/Shop')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/Login'),
    // 每次进入前调用的方法
    beforeEnter: (to, from, next) => {
      const { isLogin } = localStorage;
      isLogin ? next({ name: 'Home' }) : next();
    }
  },
    // ...
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 每次做跳转时调用的方法，参数是 (跳转到的页面, 跳转的来源页面, 实现跳转的函数)
router.beforeEach((to, from, next) => {
  const { isLogin } = localStorage;
  const { name } = to;
  const isLoginOrRegister = (name === 'Login' || name === 'Register');
  // next() 之后还会调用 router.beforeEach()
  // 如果这样写 if (isLogin) {...} 会陷入死循环，因为 isLogin 永远为 false
  (isLogin || isLoginOrRegister) ? next() : next({ name: 'Login' });
}
)

export default router
```

设置同步路由和异步路由，异步路由是只在打开这个页面时才加载的路由，使用异步路由能减少项目加载的时间。

path 后可带参数用于想路由传值，参数通过从 vue-router 中引用 useRoute 使用。

```js
import { useRoute } from "vue-router";
const route = useRoute();
const shopId = parseInt(route.params.id);
```

beforeEnter 和 beforeEach 等路由守卫在相应时机调用。

4. Vuex

```js
import { createStore } from 'vuex'

const setLocalCartList = (state) => {
  const { cartList } = state;
  const cartListString = JSON.stringify(cartList);
  localStorage.cartList = cartListString;
}

const getLocalCartList = () => {
  try {
    return JSON.parse(localStorage.cartList);
  } catch (e) {
    return {}
  }
}

export default createStore({
  state: {
    // cartList: { shopId: { shopName: "", productList: { productId: { }}}}
    cartList: getLocalCartList()
  },
  mutations: {
    changeCartItemInfo(state, payload) {
      const { shopId, productId, productInfo, num } = payload;
      // 从已存储的数据中获取，获取不到就初始化
      const shopInfo = state.cartList[shopId] || {
        shopName: '', productList: {}
      };
      let product = shopInfo.productList[productId];
      if (!product) {
        productInfo.count = 0;
        productInfo.check = 0;
        product = productInfo;
      };
      // 购买数量
      product.count += num;
      (num > 0) && (product.check = true);
      (product.count < 0) && (product.count = 0);
      // 赋值到 state 中
      shopInfo.productList[productId] = product;
      state.cartList[shopId] = shopInfo;
      setLocalCartList(state);
    },
    // ...
  },
})
```

Vuex 用于全局的状态管理，整个项目的数据存放在该文件中。通过 mutations 来获取和改变存储的数据。

使用 localStorage 将数据缓存到浏览器中。

5. axios

```js
import axios from "axios";

// 请求的通用部分，设置 URL 前缀和超时时间
const instance = axios.create({
  baseURL: 'https://www.fastmock.site/mock/ae8e9031947a302fed5f92425995aa19/jd',
  timeout: 10000
})

// 封装 get 请求，接收 URL 后缀和请求参数
export const get = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    instance.get(url, { params }, {
    }).then(response => {
      resolve(response.data);
    }, err => {
      reject(err);
    })
  })
}

// 封装 post 请求，接收 URL 后缀和请求参数，设置请求头
export const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    instance.post(url, data, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      resolve(response.data);
    }, err => {
      reject(err);
    })
  })
}
```

通过 axios 向后台发送 http 请求，上面是封装后的 axios。

6. Composition API

使用组合式 API 可以大幅度地增加代码的可读性和可维护性。构造不同的函数来实现相应的功能，集中同一功能的关注点。

7. 在不同设备上根据设备分辨率调整大小统一显示效果。

```css
// src/style/base.scss
html{
    // 1rem = 100px
    font-size: 100px;
}

body{
    font-size: .12rem;
}
```

```html
// public/index.html
<script>
  var width = document.documentElement.clientWidth || document.body.clientWidth;
  var ratio = width / 375;
  var fontSize = 100 * ratio;
  document.getElementsByTagName('html')[0].style['font-size'] = fontSize + 'px';
</script>
```

通过设置 html 中的 font-size 来设置整个项目的文字大小。开发中以 rem 为单位来继承 html 根元素字体的大小。

渲染项目页面之前获取设备的宽度的像素值，根据计算得到合适的 html 根元素字体大小，通过修改根元素的字体大小来等比例的修改全局字体的大小。