<template>
  <div class="position">
    <span class="iconfont position__icon">&#xe619;</span>
    武汉理工大学鉴主教学楼
    <span class="iconfont position__notice">&#xe601;</span>
  </div>
  <div class="search">
    <span class="iconfont">&#xe7b4;</span>
    <span class="search__text">山姆会员商店优惠商品</span>
  </div>
  <div class="banner">
    <img
      class="banner__img"
      src="http://www.dell-lee.com/imgs/vue3/banner.jpg"
      alt=""
    />
  </div>
  <div class="icons">
    <div class="icons__item" v-for="item in iconsList" :key="item.desc">
      <img
        class="icons__item__img"
        :src="`http://www.dell-lee.com/imgs/vue3/${item.imgName}.png`"
        alt=""
      />
      <p class="icons__item__desc">{{ item.desc }}</p>
    </div>
  </div>
  <div class="gap"></div>
</template>

<script>
export default {
  name: "StaticPart",
  setup() {
    const iconsList = [
      { imgName: "超市", desc: "超市便利" },
      { imgName: "菜市场", desc: "菜市场" },
      { imgName: "水果店", desc: "水果店" },
      { imgName: "鲜花", desc: "鲜花绿植" },
      { imgName: "医药健康", desc: "医药健康" },
      { imgName: "家居", desc: "家居时尚" },
      { imgName: "蛋糕", desc: "烘焙蛋糕" },
      { imgName: "签到", desc: "签到" },
      { imgName: "大牌免运", desc: "大牌免运" },
      { imgName: "红包", desc: "红包套餐" },
    ];
    return { iconsList };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
@import "../../style/mixins.scss";
.position {
  position: relative;
  padding: 0.16rem 0.24rem 0.16rem 0;
  line-height: 0.22rem;
  font-size: 0.16rem;
  @include ellipse;
  color: $content-fontcolor;
  .position__icon {
    position: relative;
    top: 0.01rem;
    font-size: 0.2rem;
  }
  .position__notice {
    position: absolute;
    right: 0;
    top: 0.17rem;
    font-size: 0.2rem;
  }
}

.search {
  margin-bottom: 0.12rem;
  line-height: 0.32rem;
  background-color: $search-bgColor;
  color: $search-fontColor;
  border-radius: 0.16rem;
  .iconfont {
    position: relative;
    top: 0.02rem;
    padding: 0 0.08rem 0 0.12rem;
    font-size: 0.2rem;
    display: inline-block;
  }
  &__text {
    display: inline-block;
    font-size: 0.14rem;
  }
}

.banner {
  // 防止抖动
  height: 0;
  overflow: hidden;
  padding-bottom: 25.4%; // 25.4% 是图片的高宽比
  &__img {
    width: 100%;
  }
}

.icons {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.16rem;
  &__item {
    width: 20%;
    &__img {
      display: block;
      width: 0.4rem;
      height: 0.4rem;
      margin: 0 auto;
    }
    &__desc {
      margin: 0.06rem 0 0.16rem 0;
      text-align: center;
      color: $content-fontcolor;
    }
  }
}

.gap {
  // 解决 gap 的宽度只有父节点宽度，无法达到页面宽度的问题
  margin: 0 -0.18rem;
  height: 0.1rem;
  background-color: $content-bgColor;
}
</style>
