<template>
  <div class="docker">
    <div
      v-for="(item, index) in dockerList"
      :key="item.icon"
      :class="{
        docker__item: true,
        'docker__item--active': index === currentIndex,
      }"
    >
      <router-link :to="item.to">
        <!-- 差值表达式的 icon 字符会被 Vue 转义为字符串，使用 v-html 解决 -->
        <div class="iconfont" v-html="item.icon"></div>
        <div class="docker__title">{{ item.text }}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Docker",
  props: ["currentIndex"],
  setup() {
    const dockerList = [
      { icon: "&#xe7a7;", text: "首页", to: { name: "Home" } },
      { icon: "&#xe600;", text: "购物车", to: { name: "Home" } },
      { icon: "&#xe7b3;", text: "订单", to: { name: "OrderList" } },
      { icon: "&#xe78b;", text: "我的", to: { name: "Home" } },
    ];
    return { dockerList };
  },
};
</script>

<style lang="scss" scoped>
@import "../style/viriables.scss";
.docker {
  display: flex;
  box-sizing: border-box;
  position: absolute;
  padding: 0 0.18rem;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.49rem;
  border-top: 0.01rem solid $content-bgColor;
  &__item {
    flex: 1;
    text-align: center;
    .iconfont {
      margin: 0.07rem 0 0.02rem 0;
      font-size: 0.18rem;
    }
    a {
      color: $content-fontcolor;
      text-decoration: none;
    }
    &--active {
      a {
        color: #1fa4fc;
      }
    }
  }
  &__title {
    font-size: 0.2rem;
    // 这里我们想设置 .1rem 即 10px，但是浏览器默认最小字体为 12px
    // 所以我们用 transform 来转换
    transform: scale(0.5);
    transform-origin: center top;
  }
}
</style>
