<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" class="button">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bottom-border', i1 === 0 ? 'top-border' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  @close="removeRightsById(scope.row, item1.id)"
                  closable
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级 -->
              <el-col :span="19">
                <!-- 二级 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'top-border']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="removeRightsById(scope.row, item2.id)"
                      closable
                      type="success"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级 -->
                    <el-tag
                      @close="removeRightsById(scope.row, item3.id)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色列表" prop="roleName"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限弹框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SettingdialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="treeActiveList"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SettingdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ClickSubitm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      SettingdialogVisible: false,
      rightslist: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      treeActiveList: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //   发起请求
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取列表失败')
      this.roleList = res.data
      this.$message.success('获取列表成功')
    },

    //   点击三级菜单关闭
    async removeRightsById(roleId, rightsId) {
      const res = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        console.log(err)
      })
      if (res !== 'confirm') return this.$message.info('取消删除')
      this.$message.success('确认删除')
      console.log(roleId, rightsId)
      const { data: ress } = await this.$http.delete(
        `roles/${roleId.id}/rights/${rightsId}`
      )
      roleId.children = ress.data
    },
    // 点击分配权限事件
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      this.SettingdialogVisible = true
      this.rightslist = res.data
      this.getLeafKeys(role, this.treeActiveList)
      console.log(this.rightslist)
      this.roleId = role
    },
    // 通过递归得形式，获取角色下所有三级权限得id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 点击dio关闭时事件
    setRightDialogClosed() {
      this.treeActiveList = []
    },
    async ClickSubitm() {
      const keys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      console.log(idStr)
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr
        }
      )
      console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error('分配权限失败')
      }
      this.SettingdialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-tag {
  margin: 10px;
}
.bottom-border {
  border-bottom: 1px solid #eee;
}
.top-border {
  border-top: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
.button{
  margin-bottom:20px;
}
</style>
