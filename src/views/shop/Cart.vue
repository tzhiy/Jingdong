<template>
  <div class="mask" v-if="showCart" @click="handleCartShowChange" />
  <div class="cart">
    <div class="product" v-if="showCart">
      <div class="product__header">
        <div
          class="product__header__all"
          @click="() => setCartItemsChecked(shopId)"
        >
          <span
            class="product__header__icon iconfont"
            v-html="calculations.allChecked ? '&#xe656;' : '&#xe7ae;'"
          ></span>
          全选
        </div>
        <div class="product__header__clear">
          <span
            class="product__header__clear__btn"
            @click="() => cleanCartProducts(shopId)"
          >
            清空购物车</span
          >
        </div>
      </div>
      <div class="product__item" v-for="item in productList" :key="item._id">
        <div
          class="product__item__check iconfont"
          v-html="item.check ? '&#xe656;' : '&#xe7ae;'"
          @click="() => changeProductItemCheck(shopId, item._id)"
        ></div>
        <img class="product__item__img" :src="item.imgUrl" alt="" />
        <div class="product__item__detail">
          <h4 class="product__item__title">{{ item.name }}</h4>
          <p class="product__item__price">
            <span class="product__item__yen">&yen;</span>{{ item.price }}
            <span class="product__item__origin">&yen;{{ item.oldPrice }}</span>
          </p>
        </div>
        <div class="product__number">
          <span
            class="product__number__minus"
            @click="() => changeCartItemInfo(shopId, item._id, item, -1)"
            >-</span
          >
          {{ item.count || 0 }}
          <span
            class="product__number__plus"
            @click="() => changeCartItemInfo(shopId, item._id, item, 1)"
            >+</span
          >
        </div>
      </div>
    </div>
    <div class="check">
      <div class="check__icon">
        <img
          src="http://www.dell-lee.com/imgs/vue3/basket.png"
          class="check__icon__img"
          @click="handleCartShowChange"
        />
        <div class="check__icon__tag">{{ calculations.total }}</div>
      </div>
      <div class="check__info">
        总计:
        <span class="check__info__price">&yen; {{ calculations.price }}</span>
      </div>
      <div class="check__btn" v-show="calculations.total > 0">
        <router-link :to="{ path: `/orderConfirmation/${shopId}` }"
          >去结算</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { useCommonCartEffect } from "../../effects/cartEffect";

// 展示 / 隐藏购物车
const toggleCartEffect = () => {
  const showCart = ref(false);
  const handleCartShowChange = () => {
    showCart.value = !showCart.value;
  };

  return { showCart, handleCartShowChange };
};

// 获取购物车信息计算逻辑
const useCartEffect = (shopId) => {
  const store = useStore();
  const { changeCartItemInfo, productList, calculations } =
    useCommonCartEffect(shopId);

  // 购物车的确认选项
  const changeProductItemCheck = (shopId, productId) => {
    store.commit("changeCartItemCheck", { shopId, productId });
  };

  // 清空购物车
  const cleanCartProducts = (shopId) => {
    store.commit("cleanCartProducts", { shopId });
  };

  const setCartItemsChecked = (shopId) => {
    store.commit("setCartItemsChecked", { shopId });
  };

  return {
    calculations,
    productList,
    changeCartItemInfo,
    changeProductItemCheck,
    cleanCartProducts,
    setCartItemsChecked,
  };
};

export default {
  name: "Cart",
  setup(props) {
    const route = useRoute();
    const shopId = route.params.id;

    const { showCart, handleCartShowChange } = toggleCartEffect();

    const {
      calculations,
      productList,
      changeCartItemInfo,
      changeProductItemCheck,
      cleanCartProducts,
      setCartItemsChecked,
    } = useCartEffect(shopId);

    return {
      calculations,
      shopId,
      productList,
      changeCartItemInfo,
      changeProductItemCheck,
      cleanCartProducts,
      setCartItemsChecked,
      showCart,
      handleCartShowChange,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
@import "../../style/mixins.scss";

.mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.cart {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: $bgColor;
  z-index: 2;
}

.check {
  display: flex;
  height: 0.49rem;
  box-sizing: border-box;
  border-top: 0.01rem solid $content-bgColor;
  line-height: 0.49rem;
  &__icon {
    position: relative;
    width: 0.84rem;
    &__img {
      display: block;
      margin: 0.12rem auto;
      width: 0.28rem;
      height: 0.26rem;
    }
    &__tag {
      position: absolute;
      left: 0.46rem;
      top: 0.04rem;
      min-width: 0.2rem;
      height: 0.2rem;
      line-height: 0.2rem;
      background: $highlight-fontColor;
      border-radius: 0.1rem;
      font-size: 0.12rem;
      text-align: center;
      color: $bgColor;
      transform: scale(0.5);
      transform-origin: left center;
    }
  }
  &__info {
    flex: 1;
    color: #333;
    font-size: 0.12rem;
    &__price {
      color: $highlight-fontColor;
      font-size: 0.18rem;
    }
  }
  &__btn {
    width: 0.98rem;
    background-color: #4fb0f9;
    font-size: 0.14rem;
    text-align: center;
    a {
      color: $bgColor;
      text-decoration: none;
    }
  }
}

.product {
  overflow-y: scroll;
  flex: 1;
  background: $bgColor;
  &__header {
    display: flex;
    height: 0.52rem;
    border-bottom: 0.01rem solid $content-bgColor;
    font-size: 0.14rem;
    color: #333;
    line-height: 0.52rem;
    &__all {
      width: 0.64rem;
      line-height: 0.52rem;
      margin-left: 0.18rem;
    }
    &__icon {
      display: inline-block;
      color: $btn-bgColor;
      font-size: 0.2rem;
      vertical-align: top;
      margin-right: 0.1rem;
    }
    &__clear {
      flex: 1;
      text-align: right;
      margin-right: 0.16rem;
      &__btn {
        display: inline-block;
      }
    }
  }
  &__item {
    position: relative;
    display: flex;
    padding: 0.12rem 0;
    margin: 0 0.16rem;
    &__check {
      color: $btn-bgColor;
      font-size: 0.2rem;
      line-height: 0.5rem;
      margin-right: 0.2rem;
    }
    &__detail {
      overflow: hidden;
    }
    &__img {
      width: 0.46rem;
      height: 0.46rem;
      margin-right: 0.16rem;
    }
    &__title {
      margin: 0;
      line-height: 0.2rem;
      font-size: 0.14rem;
      color: $content-fontcolor;
      @include ellipse;
    }
    &__price {
      margin: 0.06rem 0 0 0;
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
      bottom: 0.26rem;
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
