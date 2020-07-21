<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="30">
        <el-col :span="9">
          <el-input
            clearable
            @clear="getUserList"
            v-model="queryInfo.query"
            placeholder="请输入内容"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table v-loading="loading" :data="users" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="userStatusChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              @click="ModifiesUser(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeClick(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配使用"
              :enterable="false"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 10, 23]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户得对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-form
        :model="addRuleForm"
        ref="addRuleForm"
        label-width="100px"
        :rules="addFormRules"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addRuleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addRuleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addRuleForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addRuleForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="提示" :visible.sync="ModifiesVisible" width="50%">
      <el-form
        :model="ModifiesData"
        :rules="ModifiesDataRules"
        ref="ModifiesDataRef"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名">
          <el-input disabled v-model="ModifiesData.username"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ModifiesData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ModifiesData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ModifiesClose">取 消</el-button>
        <el-button type="primary" @click="ModifiesSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      if (value.length < 10) {
        return cb()
      }
      cb(new Error('请输入正确格式的邮箱'))
    }
    var checkPhone = (rule, value, cb) => {
      const regPhope = /^1[3456789]\d{9}$/
      if (regPhope.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确格式的手机'))
    }
    return {
      // 添加用户对话框是否显示
      addDialogVisible: false,
      // 修改用户对话框是否显示
      ModifiesVisible: false,
      //修改用户表单验证
      ModifiesDataRules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            validator: checkPhone,
            trigger: 'blur'
          }
        ]
      },
      // 查询到的用户信息对象
      ModifiesData: {},
      infoSearch: '',
      loading: true,
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前显示几条数据
        pagesize: 2
      },
      users: [],
      total: 0,
      // 添加用户得表单绑定数据
      addRuleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 6,
            message: '用户名必须为3-5位字母',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '密码必须为3-5位纯数字',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            validator: checkPhone,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 发起获取数据请求
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      this.users = res.data.users
      this.total = res.data.total
      this.loading = false
    },
    // 监听pagesize的改变事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听页数值发生改变事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    //网络请求
    async userStatusChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        this.$message.error('设置状态错误')
      }
      this.$message.success('设置状态成功')
    },
    // 添加用户名表单关闭时
    handleClose() {
      this.$refs.addRuleForm.resetFields()
    },
    // 点击添加时的事件
    addUser() {
      this.$refs.addRuleForm.validate(async value => {
        if (!value) return
        const { data: res } = await this.$http.post('users', this.addRuleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('创建失败')
        }
        this.$message.success('创建成功')
        this.addDialogVisible = !this.addDialogVisible
        this.getUserList()
      })
    },
    // 点击修改用户事件
    async ModifiesUser(id) {
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('查询信息失败')
      }
      this.ModifiesData = res.data
      this.ModifiesVisible = !this.ModifiesVisible
    },
    // 修改表单时关闭事件
    ModifiesClose() {
      this.$refs.ModifiesDataRef.resetFields()
      this.ModifiesVisible = !this.ModifiesVisible
    },
    // 修改表单提交事件
    ModifiesSubmit() {
      this.$refs.ModifiesDataRef.validate(async valid => {
        if (!valid) return this.$message.error('提交错误')
        const { data: res } = await this.$http.put(
          'users/' + this.ModifiesData.id,
          {
            email: this.ModifiesData.email,
            mobile: this.ModifiesData.mobile
          }
        )
        console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error('更新用户信息失败')
        // 关闭对话框
        this.ModifiesVisible = !this.ModifiesVisible
        // 刷新数据列表
        this.getUserList()
        // 提示用户修改成功
        this.$message.success('更新用户信息成功')
      })
    },
    // 点击删除时的事件
    async removeClick(id) {
      const res = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => console.log(err))
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: resDelete } = await this.$http.delete('users/' + id)
      if (resDelete.meta.status !== 200) {
        this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
      console.log(this.ModifiesData)
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
