<template>
  <div class="wrapper">
    <div class="title">我的订单</div>
    <div class="order" v-for="(item, index) in list" :key="index">
      <div class="order__title">
        {{ item.shopName }}
        <span class="order__status">{{
          item.isCanceled ? "已取消" : "已下单"
        }}</span>
      </div>
      <div class="order__content">
        <div class="order__content__imgs">
          <template
            v-for="(innerItem, innerIndex) in item.products"
            :key="innerIndex"
          >
            <img
              v-if="innerIndex <= 3"
              class="order__content__img"
              :src="innerItem.product.img"
            />
          </template>
        </div>
        <div class="order__content__info">
          <div class="order__content__price">￥ {{ item.totalPrice }}</div>
          <div class="order__content__count">共 {{ item.totalNumber }} 件</div>
        </div>
      </div>
    </div>
  </div>
  <Docker :currentIndex="2" />
</template>

<script>
import { reactive, toRefs } from "vue";
import { get } from "../../utils/request";
import Docker from "../../components/Docker.vue";

// 处理订单列表逻辑
const useOrderListEffect = () => {
  const data = reactive({ list: [] });
  const getNearbyList = async () => {
    const result = await get("/api/order");
    if (result?.errno === 0 && result?.data?.length) {
      const orderList = result.data;
      orderList.forEach((order) => {
        const products = order?.products || [];
        let totalPrice = 0;
        let totalNumber = 0;
        products.forEach((productItem) => {
          totalPrice +=
            productItem?.product?.price * productItem?.orderSales || 0;
          totalNumber += productItem?.orderSales || 0;
        });
        order.totalPrice = totalPrice;
        order.totalNumber = totalNumber;
      });
      data.list = result.data;
    }
  };
  getNearbyList();
  const { list } = toRefs(data);
  return { list };
};

export default {
  name: "OrderList",
  components: {
    Docker,
  },
  setup() {
    const { list } = useOrderListEffect();
    return { list };
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  // 设置纵向滚动
  overflow-y: auto;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0.5rem;
  right: 0;
  background: #f5f5f5;
}

.title {
  background: #fff;
  line-height: 0.44rem;
  font-size: 0.16rem;
  color: #333;
  text-align: center;
  padding-top: 0.1rem;
}

.order {
  margin: 0.16rem 0.18rem;
  padding: 0.16rem;
  background: #fff;
  &__title {
    margin-bottom: 0.16rem;
    line-height: 0.22rem;
    font-size: 0.16rem;
    color: #333;
  }
  &__status {
    font-size: 0.14rem;
    float: right;
    color: #999;
  }
  &__content {
    display: flex;
    &__imgs {
      flex: 1;
    }
    &__img {
      width: 0.4rem;
      height: 0.4rem;
      margin-right: 0.12rem;
    }
    &__info {
      width: 0.7rem;
    }
    &__price {
      margin-bottom: 0.04rem;
      font-size: 0.14rem;
      color: #e93b3b;
      text-align: right;
      line-height: 0.2rem;
    }
    &__count {
      font-size: 0.12rem;
      color: #333;
      text-align: right;
      line-height: 0.14rem;
    }
  }
}
</style>
