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
    // cartList: {
    //   // 第一层级是商铺的 id
    //   shopId: {
    //     shopName: "沃尔玛",
    //     // 第二层是商品的 id
    //     // 第二层内容是商品内容和购买数量
    //     productList: {
    //       productId: {
    //         _id: 1,
    //         // ...
    //         count: 2,
    //         check: false
    //       }
    //     }
    //   },
    // }
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
      // if (num > 0) { product.check = true; } 等价于下一句
      (num > 0) && (product.check = true);
      (product.count < 0) && (product.count = 0);
      // 赋值到 state 中
      shopInfo.productList[productId] = product;
      state.cartList[shopId] = shopInfo;
      setLocalCartList(state);
    },
    changeCartItemCheck(state, payload) {
      const { shopId, productId } = payload;
      const product = state.cartList[shopId].productList[productId];
      product.check = !product.check;
      setLocalCartList(state);
    },
    cleanCartProducts(state, payload) {
      const { shopId } = payload
      state.cartList[shopId].productList = {}
      setLocalCartList(state);
    },
    setCartItemsChecked(state, payload) {
      const { shopId } = payload
      const products = state.cartList[shopId].productList;
      if (products) {
        for (const key in products) {
          const product = products[key]
          product.check = true
        }
      }
      setLocalCartList(state);
    },
    changeShopName(state, payload) {
      const { shopId, shopName } = payload;
      const shopInfo = state.cartList[shopId] || {
        shopName: '', productList: {}
      };
      shopInfo.shopName = shopName;
      state.cartList[shopId] = shopInfo;
      setLocalCartList(state);
    },
    clearCartData(state, shopId) {
      state.cartList[shopId].productList = {}
    }
  },
})
