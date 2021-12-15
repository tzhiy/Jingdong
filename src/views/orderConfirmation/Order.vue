<template>
  <div class="order">
    <div class="order__price">
      实付金额 <b>￥{{ calculations.price }}</b>
    </div>
    <div class="order__btn" @click="handleshowConfirmChange">提交订单</div>
  </div>
  <div class="mask" v-show="showConfirm" @click="handleshowConfirmChange">
    <div class="mask__content" @click.stop>
      <h3 class="mask__content__title">确认离开收银台？</h3>
      <p class="mask__content__desc">请尽快完成支付，否则将会被取消</p>
      <div class="mask__content__btns">
        <div
          class="mask__content__btn mask__content__btn--first"
          @click="() => handleConfirmOrder(true)"
        >
          取消订单
        </div>
        <div
          class="mask__content__btn mask__content__btn--last"
          @click="() => handleConfirmOrder(false)"
        >
          确认支付
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCommonCartEffect } from "../../effects/cartEffect";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import { useStore } from "vuex";
import { post } from "../../utils/request";

// 下单功能
const useMakeOrderEffect = (productList, shopName, shopId) => {
  const store = useStore();
  const router = useRouter();

  const handleConfirmOrder = async (isCanceled) => {
    const products = [];
    for (const i in productList.value) {
      const product = productList.value[i];
      products.push({
        id: parseInt(product._id),
        number: product.count,
      });
    }
    // 请求后端接口，确认订单
    try {
      const result = await post("/api/order", {
        addressId: 1,
        shopId,
        shopName: shopName.value,
        isCanceled,
        products,
      });
      if (result?.errno === 0) {
        // 清空购物车
        store.commit("clearCartData", shopId);
        router.push({ name: "OrderList" });
      }
    } catch (e) {
      // 提示下单失败
    }
  };

  return { handleConfirmOrder };
};

// 蒙层展示功能
const useShowMaskEffect = () => {
  const showConfirm = ref(false);
  const handleshowConfirmChange = () => {
    showConfirm.value = !showConfirm.value;
  };
  return { showConfirm, handleshowConfirmChange };
};

export default {
  name: "Order",
  setup() {
    const route = useRoute();
    const shopId = parseInt(route.params.id);
    const { calculations, shopName, productList } = useCommonCartEffect(shopId);

    const { handleConfirmOrder } = useMakeOrderEffect(
      productList,
      shopName,
      shopId
    );
    const { showConfirm, handleshowConfirmChange } = useShowMaskEffect();
    return {
      calculations,
      handleConfirmOrder,
      showConfirm,
      handleshowConfirmChange,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
.order {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 0.49rem;
  line-height: 0.49rem;
  background: #fff;
  &__price {
    flex: 1;
    text-indent: 0.24rem;
    font-size: 0.14rem;
    color: #333;
  }
  &__btn {
    width: 0.98rem;
    background-color: #4fb0f9;
    color: #fff;
    text-align: center;
    font-size: 0.14rem;
  }
}

.mask {
  z-index: 1;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3rem;
    height: 1.56rem;
    background: #fff;
    border-radius: 0.04rem;
    text-align: center;
    &__title {
      margin: 0.24rem 0 0 0;
      line-height: 0.26rem;
      font-size: 0.18rem;
      color: #333;
    }
    &__desc {
      margin: 0.08rem 0 0 0;
      font-size: 0.14rem;
      color: #666;
    }
    &__btns {
      display: flex;
      margin: 0.24rem 0.58rem;
    }
    &__btn {
      flex: 1;
      width: 0.8rem;
      line-height: 0.32rem;
      border-radius: 0.16rem;
      border: 0.01rem solid #4fb0f9;
      font-size: 0.14rem;
      &--first {
        margin-right: 0.24rem;
        color: #4fb0f9;
      }
      &--last {
        background: #4fb0f9;
        color: #fff;
      }
    }
  }
}
</style>
