<template>
  <div class="wrapper">
    <img
      class="wrapper__img"
      src="http://www.dell-lee.com/imgs/vue3/user.png"
      alt=""
    />
    <div class="wrapper__input">
      <input
        class="wrapper__input__content"
        placeholder="请输入用户名"
        v-model="username"
      />
    </div>
    <div class="wrapper__input">
      <!-- autocomplete="new-password" 防止浏览器自动填写密码 -->
      <input
        class="wrapper__input__content"
        placeholder="请输入密码"
        type="password"
        v-model="password"
        autocomplete="new-password"
      />
    </div>
    <div class="wrapper__login-button" @click="handleLogin">登录</div>
    <div class="wrapper__login-link" @click="handleRegisterClick">立即注册</div>
    <Toast v-if="show" :message="toastMessage" />
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { post } from "../../utils/request";
import Toast, { useToastEffect } from "../../components/Toast.vue";

// 处理登录逻辑
const useLoginEffect = (showToast) => {
  const router = useRouter();
  const data = reactive({
    username: "",
    password: "",
  });
  const handleLogin = async () => {
    try {
      const { username, password } = data;
      if (username === "" || password === "") {
        showToast("用户名或密码为空");
        return;
      }
      const result = await post("/api/user/login", {
        username: data.username,
        password: data.password,
      });
      if (result?.errno === 0) {
        localStorage.isLogin = true;
        router.push({ name: "Home" });
      } else {
        showToast("登录失败");
      }
    } catch (e) {
      showToast("请求失败");
    }
  };

  const { username, password } = toRefs(data);
  return { username, password, handleLogin };
};

// 处理注册跳转
const useRegisterEffect = () => {
  const router = useRouter();
  const handleRegisterClick = () => {
    router.push({ name: "Register" });
  };
  return { handleRegisterClick };
};

export default {
  name: "Login",
  components: {
    Toast,
  },
  setup() {
    const { show, toastMessage, showToast } = useToastEffect();
    const { username, password, handleLogin } = useLoginEffect(showToast);
    const { handleRegisterClick } = useRegisterEffect();
    return {
      handleLogin,
      handleRegisterClick,
      username,
      password,
      show,
      toastMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/viriables.scss";
.wrapper {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%); // 居中
  &__img {
    display: block;
    width: 0.66rem;
    height: 0.66rem;
    margin: 0 auto 0.4rem auto;
  }
  &__input {
    height: 0.48rem;
    margin: 0 0.4rem 0.16rem 0.4rem;
    padding: 0 0.16rem;
    background: #f9f9f9;
    border: 0.01rem solid rgba(0, 0, 0, 0.1);
    border-radius: 0.06rem;
    &__content {
      width: 100%;
      border: none;
      outline: none;
      background: none;
      height: 0.48rem;
      font-size: 0.16rem;
      color: content-notice-fontcolor;
      &::placeholder {
        color: content-notice-fontcolor;
      }
    }
  }
  &__login-button {
    background: $btn-bgColor;
    line-height: 0.48rem;
    font-size: 0.16rem;
    box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 145, 255, 0.32);
    border-radius: 0.04rem;
    border-radius: 0.04rem;
    color: $bgColor;
    margin: 0.32rem 0.4rem 0.16rem 0.4rem;
    text-align: center;
  }
  &__login-link {
    font-size: 0.14rem;
    color: content-notice-fontcolor;
    text-align: center;
  }
}
</style>
