<template>
  <div class="login-container">
    <div class="login-head">
      <img src="../../assets/images/logo.png" class="customer-logo"/>
    </div>
    <div class="login-body">
      <div class="login-outer">
        <div class="login-airbg">
          <div class="slogan-panel">
            <div class="slogan">风雨者航空气象服务</div>
            <hr align="center"  color="#FFFFFF" width="100%" size="0.1rem"> 
          </div>
        </div>

        <div class="login-formcontainer">
          <div class="title-container">
            <h3 class="title">登 录</h3>
          </div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
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

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
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
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-button :loading="loading"  class="login-button" @click.native.prevent="handleLogin">登 录</el-button>

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
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
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
  .login-button
  {
    margin-top: 3rem;
    width:70%;
    background:rgba(5,137,42,1);
    box-shadow:0px 10px 22px 2px rgba(14,21,68,0.12);
    border-radius:0.4rem;
    font-size:1.6rem;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:22px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      // background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      // padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 3rem;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(139, 9, 9, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-content: middle;
    width: 70%;
    .el-input{
      width: 88%;
    } 
    // .el-form-item__content
    // {
    //   line-height: 3rem;
    // }
  
  
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
  // background-color: $bg;
  background: $bgimg;
  overflow: hidden;
  .login-head{
    @include align-middle;
    flex: 0 0 3rem;
    justify-content: flex-start;
    padding: 4.4rem 5.9rem;
    z-index: 999;
    .customer-logo{
      @include wh(13.5rem,3.5rem);
      @media screen and (max-width: $width-medium){  width: 6rem;}
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
      @include wh(70%,56rem);
      @include align-middle-between;
      display: flex;
      flex-flow: row nowrap;
      right: 20%;
      font-size: $fontsize-s;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 20px 6px rgba(0,87,33,0.09);
      border-radius:1.6rem;
      // padding: 2.7rem 4rem;
      z-index: 999;
      .login-airbg{
        @media screen and (max-width: $width-medium){
          display: none

        }
                
        @include wh(45.4rem,100%);
        background:$bgimgair;
        display: flex;
        border-radius: 1.6rem 0rem 0rem 1.6rem;
        @include align-center-middle;
        // background:$bgimgair;
        .login-border{
            position: relative;
            width:100%;
            height:100%;
          }
        .slogan-panel{
          @include align-middle;
          flex-flow: column nowrap;
          // min-width: 20rem
          z-index: 999;
          height: 10rem;

          @media screen and (max-width: $width-medium){
            height: 6rem
          }
          
          .slogan{
            @include font-color-pos(2.4rem,$active-ft,left);
            padding-bottom: 2rem;
            @media screen and (max-width: $width-medium)
            {
              font-size: 1.4rem;
              padding-bottom: 1rem
            }
                

          }
          .minor-slogan{
            @include font-color-pos(1.2rem,$grip-color,left);
              @media screen and (max-width: $width-medium){
                font-size: $fontsize-s
              }
                         
          }
        }
      }

      .login-formcontainer{
        position: relative;
        @include wh(56.6rem,100%);
         .login-form {
          display: flex;
          @include align-middle;
          flex-flow: column nowrap;
          // position: relative;
          // width: 52rem;
          // max-width: 100%;
          padding-top: 10rem;
          // margin: 0 auto;
          // overflow: hidden;
      }
        
      }
     
    }
    // width:102rem;
    // height:56rem;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 3.6rem;
      color: rgba(51,51,51,1);
      text-align: center;
      font-weight: 500;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
