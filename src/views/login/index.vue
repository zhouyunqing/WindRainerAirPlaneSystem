<template>
  <div class="login-container">
    <div class="login-head">
      <img src="../../assets/images/logo.png" class="customer-logo">
    </div>
    <div class="login-body">
      <div class="login-outer">
        <div class="login-airbg">
          <div class="slogan-panel">
            <!-- <div class="slogan">风雨者航空气象服务</div> -->
          </div>
        </div>

        <div class="login-formcontainer">
          <div class="title-container">
            <h3 class="title">登 录</h3>
          </div>
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="top">
            <el-form-item prop="username" label="用户名">
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password" label="密码">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <!-- <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span> -->
            </el-form-item>

            <el-button :loading="loading" class="login-button" @click.native.prevent="handleLogin">登 录</el-button>

          </el-form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          setTimeout(() => {
            this.login()
          }, 100)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    login() {
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        this.$router.push({ path: this.redirect || '/' })
        // this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/def.scss';
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$bg:#FFFFFF;
$light_gray:#fff;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .login-button {
    background: rgba(5,137,42,1);
    box-shadow: 0px 10px 22px 2px rgba(14,21,68,0.12);
    border-radius: 4px;
    border: none;
    padding: 0;
    margin-top: 0.26rem;
    width: 65%;
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.16rem;
    font-family: PingFangSC-Medium,PingFang SC;
    font-weight: 500;
    color: rgba(255,255,255,1);
    &:hover {
      background: rgba(5,137,42,0.9);
    }
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      height: 0.3rem;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-content: middle;
    margin-bottom: 0.26rem;
    width: 65%;
    border-bottom: 1px solid #888;
    border-radius: 0;
    color: #454545;
    &.is-error {
      border-bottom: 1px solid #ED223C;
    }
    &.is-success {
      border-bottom: 1px solid #05892A;
    }
    .el-input{
      height: 0.3rem;
      width: 100%;
      input {
        padding: 0;
        color: #333;
        font-weight: 500;
      }
    }
    .el-form-item__label {
      padding: 0;
      height: 0.18rem;
      line-height: 0.18rem;
      font-size: 0.12rem;
      font-weight: 400;
      color: rgba(51,51,51,1);
      &::before {
        display: none;
      }
    }
    .el-form-item__content {
      height: 0.3rem;
      line-height: 0.3rem;
    }

  }
}
</style>

<style lang="scss" scoped>
@import '../../styles/def.scss';
$bg:#462d4b;
$dark_gray:#889aa4;
$light_gray:#eee;

$bgimg:url('../../assets/images/loginbg.png') center center no-repeat;
$bgimgair:url('../../assets/images/airbg.png') center center no-repeat;
.login-container {
  min-height: 100%;
  width: 100%;
  background: $bgimg;
  overflow: hidden;
  .login-head{
    @include align-middle;
    flex: 0 0 0.3rem;
    justify-content: flex-start;
    padding: 0.45rem 0.6rem;
    z-index: 999;
    .customer-logo{
      @include wh(1.35rem,0.35rem);
      @media screen and (max-width: $width-medium){  width: 0.6rem;}
    }
  }

  .login-body{
    @include align-center-middle;
    flex: auto;
    flex-flow: column nowrap;

    @media screen and (max-width: $width-medium) and (min-aspect-ratio: 10/8){ //(orientation: landscape)
        flex-flow: row nowrap;
        justify-content: space-around
      };
    .login-outer {
      @include wh(10.2rem,5.6rem);
      @include align-middle-between;
      display: flex;
      flex-flow: row nowrap;
      right: 20%;
      font-size: $fontsize-s;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 20px 6px rgba(0,87,33,0.09);
      border-radius:0.16rem;
      z-index: 999;
      .login-airbg{
        @media screen and (max-width: $width-medium){
          display: none

        }

        @include wh(4.54rem,100%);
        background:$bgimgair;
        display: flex;
        border-radius: 0.16rem 0rem 0rem 0.16rem;
        @include align-center-middle;
        .login-border{
            position: relative;
            width:100%;
            height:100%;
          }
        .slogan-panel{
          @include align-middle;
          flex-flow: column nowrap;
          z-index: 999;
          margin-bottom: 1rem;
          font-weight: 500;

          @media screen and (max-width: $width-medium){
            height: 0.6rem
          }

          .slogan{
            @include font-color-pos(0.24rem,$active-ft,left);
            padding-bottom: 2px;
            @media screen and (max-width: $width-medium)
            {
              font-size: 0.14rem;
              padding-bottom: 0.1rem
            }

          }
          .minor-slogan{
            @include font-color-pos(0.12rem,$grip-color,left);
              @media screen and (max-width: $width-medium){
                font-size: $fontsize-s
              }

          }
          position: relative;
          &::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 2px;
            right: 2px;
            height: 1px;
            background: #ffffff;
          }
        }
      }

      .login-formcontainer{
        position: relative;
        @include wh(5.7rem,100%);
         .login-form {
          display: flex;
          @include align-middle;
          flex-flow: column nowrap;
      }

      }

    }
  }

  .tips {
    font-size: 0.14rem;
    color: #fff;
    margin-bottom: 0.10rem;

    span {
      &:first-of-type {
        margin-right: 0.16rem;
      }
    }
  }

  .svg-container {
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      margin: 0.9rem 0 0.8rem 0;
      font-family: "Noto Sans SC";
      font-size: 0.36rem;
      color: rgba(51,51,51,1);
      text-align: center;
      font-weight: 550;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 0.16rem;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
