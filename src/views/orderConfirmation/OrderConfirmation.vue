<template>
  <div class="wrapper">
    <TopArea />
    <ProductList />
  </div>
  <Order />
</template>

<script>
import TopArea from "./TopArea.vue";
import ProductList from "./ProductList.vue";
import Order from "./Order.vue";
export default {
  name: "OrderConfirmation",
  components: { TopArea, ProductList, Order },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
@import "../../style/mixins.scss";
.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #eee;
  overflow-y: scroll;
}

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
</style>
