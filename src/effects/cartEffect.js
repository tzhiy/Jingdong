import { computed } from "vue";
import { useStore } from "vuex";

// 实现添加减少商品的功能
export const useCommonCartEffect = (shopId) => {
  const store = useStore();
  const cartList = store.state.cartList;
  const changeCartItemInfo = (shopId, productId, productInfo, num) => {
    store.commit("changeCartItemInfo", { shopId, productId, productInfo, num });
  };
  const productList = computed(() => {
    const productList = cartList[shopId]?.productList || {};
    const notEmptyproductList = {};
    for (const i in productList) {
      if (productList[i].count > 0) {
        notEmptyproductList[i] = productList[i];
      }
    }
    return notEmptyproductList;
  });
  const shopName = computed(() => {
    const shopName = cartList[shopId]?.shopName || "";
    return shopName;
  });
  // 计算选中数量、价格、是否全选
  const calculations = computed(() => {
    const productList = cartList[shopId]?.productList;
    const result = { total: 0, price: 0, allChecked: true };
    if (productList) {
      for (const i in productList) {
        const product = productList[i];
        result.total += product.count;
        if (product.check) {
          result.price += product.count * product.price;
        }
        if (product.count > 0 && !product.check) {
          result.allChecked = false;
        }
      }
    }
    result.price = result.price.toFixed(2);
    return result;
  });
  return { changeCartItemInfo, cartList, productList, shopName, calculations };
};
