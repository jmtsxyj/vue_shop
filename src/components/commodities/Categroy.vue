<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col
          ><el-button type="primary" @click="addCateGoryClick"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <tree-table
        v-loading="loading"
        class="treeTable"
        :show-row-hover="false"
        border
        index-text="#"
        :show-index="true"
        :expand-type="false"
        :selection-type="false"
        :data="catelist"
        :columns="columns"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot-scope="scope" slot="order">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="edit">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 20, 30]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      @close="addCateDialogClose"
      title="添加分类"
      :visible.sync="addCateDialog"
      width="50%"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="CateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <el-cascader
            v-model="seleKeys"
            :options="ParentCateList"
            :props="cascaderPropps"
            expandTrigger="hover"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单隐藏显示
      addCateDialog: false,
      // 加载
      loading: true,
      // 表格数据
      catelist: [],
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //   总数据条数
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '排序',
          type: 'template',
          template: 'edit'
        }
      ],
      // 添加分类的表单数据
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认添加的是1级分类
        cat_level: 0
      },
      // 添加分类的验证规则
      CateFormRules: {
        cat_name: [
          { required: true, message: '请输入要添加的名称', trigger: 'blur' }
        ]
      },
      // 所有父级的分类列表
      ParentCateList: [],
      // 添加分类绑定数据
      seleKeys: [],
      cascaderPropps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      CateSeleted: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 请求网络
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败')
      this.catelist = res.data.result
      this.total = res.data.total
      this.loading = false
    },
    // 监听分页器（）
    handleSizeChange(newsize) {
      this.querInfo.pagesize = newsize
      this.loading = true
      this.getCateList()
    },
    // 监听pagenum（页数）变化
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.loading = true
      this.getCateList()
    },
    // 点击添加分类事件
    addCateGoryClick() {
      // 先获取父级分类列表
      this.getParentCateList()
      // 展示对话框
      this.addCateDialog = true
    },
    // 获取父级分类的列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      this.ParentCateList = res.data
    },
    parentCateChanged() {
      console.log(this.seleKeys)
      // 如果，seleKeys数组中的length大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.seleKeys.length > 0) {
        this.addCateForm.cat_pid = this.seleKeys[this.seleKeys.length - 1]
        this.addCateForm.cat_level = this.seleKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定
    addCate() {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if(res.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success('创建成功')
        this.getCateList();
        this.addCateDialog = false
      })
    },
    // 关闭添加分类的事件
    addCateDialogClose() {
      this.seleKeys = []
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
