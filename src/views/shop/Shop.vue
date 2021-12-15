<template>
  <div class="wrapper">
    <div class="search">
      <div class="search__back iconfont" @click="handleBackClick">&#xe602;</div>
      <div class="search__content">
        <span class="search__content__icon iconfont">&#xe7b4;</span>
        <input class="search__content__input" placeholder="请输入商品名称" />
      </div>
    </div>
    <!-- 防止裂图 -->
    <ShopInfo :item="item" :hideBorder="true" v-show="item.imgUrl" />
    <Content :shopName="item.name" />
    <Cart />
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import { get } from "../../utils/request";
import ShopInfo from "../../components/ShopInfo.vue";
import Content from "./Content.vue";
import Cart from "./Cart.vue";

// 获取信息
const useShopInfoEffect = () => {
  const route = useRoute();
  const data = reactive({ item: {} });
  const getItemData = async () => {
    const result = await get(`/api/shop/${route.params.id}`);
    if (result?.errno === 0 && result?.data) {
      data.item = result.data;
    }
  };
  return { data, getItemData };
};

// 回退逻辑
const useBackRouterEffect = () => {
  const router = useRouter();
  const handleBackClick = () => {
    router.back();
  };
  return { handleBackClick };
};

export default {
  name: "Shop",
  components: {
    ShopInfo,
    Content,
    Cart,
  },
  setup() {
    const { data, getItemData } = useShopInfoEffect();
    const { handleBackClick } = useBackRouterEffect();
    getItemData();
    const { item } = toRefs(data);
    return { item, handleBackClick };
  },
};
</script>

<style lang='scss' scoped>
@import "../../style/viriables.scss";
.wrapper {
  padding: 0 0.18rem;
}

.search {
  display: flex;
  margin: 0.14rem 0 0.04rem 0;
  height: 0.32rem;
  line-height: 0.32rem;
  &__back {
    width: 0.3rem;
    font-size: 0.24rem;
    color: #b6b6b6;
  }
  &__content {
    display: flex;
    flex: 1;
    line-height: 0.32rem;
    background: $search-bgColor;
    border-radius: 0.16rem;
    &__icon {
      width: 0.44rem;
      text-align: center;
      color: $search-fontColor;
    }
    &__input {
      width: 100%;
      padding-right: 0.2rem;
      border: none;
      outline: none;
      background: none;
      color: $content-fontcolor;
      font-size: 0.14rem;
      &::placeholder {
        color: $content-fontcolor;
      }
    }
  }
}
</style>
