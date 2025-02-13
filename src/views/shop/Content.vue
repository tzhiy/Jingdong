<template>
  <div class="content">
    <div class="category">
      <div
        :class="{
          category__item: true,
          'category__item--active': currentTab === item.tab,
        }"
        v-for="item in categories"
        :key="item.name"
        @click="() => handleTabClick(item.tab)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="product">
      <div class="product__item" v-for="item in list" :key="item._id">
        <img class="product__item__img" :src="item.imgUrl" alt="" />
        <div class="product__item__detail">
          <h4 class="product__item__title">{{ item.name }}</h4>
          <p class="product__item__sales">月售 {{ item.sales }} 件</p>
          <p class="product__item__price">
            <span class="product__item__yen">&yen;</span>{{ item.price }}
            <span class="product__item__origin">&yen;{{ item.oldPrice }}</span>
          </p>
        </div>
        <div class="product__number">
          <span
            class="product__number__minus"
            @click="() => changeCartItem(shopId, item._id, item, -1, shopName)"
            >-</span
          >
          {{ getProductCartCount(shopId, item._id) }}
          <span
            class="product__number__plus"
            @click="() => changeCartItem(shopId, item._id, item, 1, shopName)"
            >+</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, watchEffect } from "vue";
import { get } from "../../utils/request";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useCommonCartEffect } from "../../effects/cartEffect";

const categories = [
  { name: "全部商品", tab: "all" },
  { name: "秒杀", tab: "seckill" },
  { name: "新鲜水果", tab: "fruit" },
];

// Tab 替换相关的逻辑
const useTabEffect = () => {
  const currentTab = ref(categories[0].tab);
  const handleTabClick = (tab) => {
    currentTab.value = tab;
  };
  return { currentTab, handleTabClick };
};

// 商品列表内容相关的逻辑
const useCurrentListEffect = (currentTab, shopId) => {
  const content = reactive({
    list: [],
  });
  const getContentData = async () => {
    const result = await get(`api/shop/${shopId}/products`, {
      tab: currentTab.value,
    });
    if (result?.errno === 0 && result?.data?.length) {
      content.list = result.data;
    }
  };
  // 依赖的数据变化就会执行
  watchEffect(() => {
    getContentData();
  });
  const { list } = toRefs(content);
  return { list };
};

// 增减相关商品
const useCartEffect = () => {
  const store = useStore();
  const { changeCartItemInfo, cartList } = useCommonCartEffect();
  const changeShopName = (shopId, shopName) => {
    store.commit("changeShopName", { shopId, shopName });
  };
  const changeCartItem = (shopId, productId, productInfo, num, shopName) => {
    changeCartItemInfo(shopId, productId, productInfo, num);
    changeShopName(shopId, shopName);
  };
  const getProductCartCount = (shopId, productId) => {
    return cartList?.[shopId]?.productList?.[productId]?.count || 0;
  };
  return { cartList, changeCartItem, getProductCartCount };
};

export default {
  name: "Content",
  props: ["shopName"],
  setup() {
    const route = useRoute();
    const shopId = route.params.id;

    const { currentTab, handleTabClick } = useTabEffect();
    const { list } = useCurrentListEffect(currentTab, shopId);
    const { cartList, changeCartItem, getProductCartCount } = useCartEffect();

    return {
      categories,
      currentTab,
      handleTabClick,
      list,
      shopId,
      cartList,
      changeCartItem,
      getProductCartCount,
    };
  },
};
</script>

<style lang='scss' scoped>
@import "../../style/viriables.scss";
@import "../../style/mixins.scss";
.content {
  display: flex;
  position: absolute;
  top: 1.5rem;
  left: 0;
  right: 0;
  bottom: 0.5rem;
}

.category {
  overflow-y: scroll;
  width: 0.76rem;
  height: 100%;
  background: $search-bgColor;
  &__item {
    line-height: 0.4rem;
    font-size: 0.14rem;
    color: $content-fontcolor;
    text-align: center;
    &--active {
      background: $bgColor;
    }
  }
}

.product {
  overflow-y: scroll;
  flex: 1;
  &__item {
    position: relative;
    display: flex;
    padding: 0.12rem 0;
    margin: 0 0.16rem;
    &__detail {
      overflow: hidden;
    }
    &__img {
      width: 0.68rem;
      height: 0.68rem;
      margin-right: 0.16rem;
    }
    &__title {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipse;
    }
    &__sales {
      margin: 0.06rem 0;
      line-height: 0.2rem;
      font-size: 0.12rem;
      color: $content-fontcolor;
    }
    &__price {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $highlight-fontColor;
    }
    &__yen {
      font-size: 0.12rem;
    }
    &__origin {
      margin: 0.06rem;
      line-height: 0.2rem;
      font-size: 0.12rem;
      color: $light-fontColor;
      text-decoration: line-through;
    }
    .product__number {
      position: absolute;
      right: 0rem;
      bottom: 0.12rem;
      &__minus,
      &__plus {
        display: inline-block;
        width: 0.2rem;
        height: 0.2rem;
        line-height: 0.2rem;
        border-radius: 50%;
        font-size: 0.2rem;
        text-align: center;
      }
      &__minus {
        border: 0.01rem solid $medium-fontColor;
        color: $medium-fontColor;
        margin-right: 0.05rem;
      }
      &__plus {
        background: $btn-bgColor;
        color: $bgColor;
        margin-left: 0.05rem;
      }
    }
  }
}
</style>
