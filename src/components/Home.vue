<template>
  <el-container class="home-container">
    <el-header>
      <div class="title">
        <img src="../assets/01.jpg" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collapseClick ? '64px' : '200px'">
        <div class="toggle-button" @click="CloseClick">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          background-color="#323744"
          text-color="#fff"
          active-text-color="#409fff"
          unique-opened
          :collapse="collapseClick"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本区域 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="ClickActive('/' + subitem.path)"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本区域 -->
              <span>{{ subitem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      //   左侧菜单数据
      menulist: [],
      iconObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-zhongchuangkongjian-',
        '101': 'iconfont icon-shangpingouwudai2',
        '102': 'iconfont icon-icon-test',
        '145': 'iconfont icon-shuju'
      },
      collapseClick: false,
      activePath: ''
    }
  },
  methods: {
    // 点击退出按钮事件
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMentList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 点击按钮切换菜单的折叠和展开
    CloseClick() {
      return (this.collapseClick = !this.collapseClick)
    },
    // 保存链接的激活状态
    ClickActive(value) {
      window.sessionStorage.setItem('activePath', value)
      this.activePath = value
    }
  },
  created() {
    //   调用发送请求事件
    this.getMentList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373c41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    color: white;
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      width: 10%;
      border-radius: 100%;
    }
  }
}

.el-aside {
  background-color: #323744;
  .el-menu {
    border: transparent;
  }
}

.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  text-align: center;
  color: white;
  font-size: 10px;
  line-height: 24px;
  background: #4a5064;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
