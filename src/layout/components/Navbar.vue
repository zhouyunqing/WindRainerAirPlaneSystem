<template>
  <div class="navbar">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- <div class="infor">
      <img src="../../assets/images/infor.png" alt="" class="inforimage">
      <span class="inforSpan">信息</span>
    </div> -->
    <div class="settings">
      <img src="../../assets/images/settings.png" alt="" class="inforimage">
      <span class="settingsSpan">设置</span>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <span>David</span>
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              主页
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  padding-top:0.4rem;
  .infor{
    width:100%;
    height:0.88rem;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    span{
    // width:1.4rem;
    height:0.2rem;
    font-size:0.14rem;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:0.2rem;
  }
  };
  .settings{
    padding: 0.13rem 0 0.1rem;
    width:100%;
    height:0.88rem;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    opacity: 0.5;
    cursor: pointer;
    &:hover {
      background: #05892a;
      opacity: 1;
    }
    span{
    // width:1.4rem;
    height: 0.2rem;
    font-size: 0.14rem;
    font-weight: 500;
    color: rgba(255,255,255,1);
    line-height: 0.2rem;
  }

  };
  height: 30%;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 0.46rem;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    padding-top:0.1rem;
    float: right;
    height: 100%;
    line-height: 0.5rem;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 0.08rem;
      height: 100%;
      font-size: 0.18rem;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      .avatar-wrapper {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
        height:0.88rem;
        justify-content: center;
        align-items: center;
        span{
          height:0.2rem;
          font-size:0.14rem;
          font-weight:500;
          color:#fff;
          line-height: 0.2rem;
        }

        .user-avatar {
          cursor: pointer;
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 0.1rem;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -0.2rem;
          top: 0.25rem;
          font-size: 0.12rem;
        }
      }
    }
  }
}
</style>
