<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe v-loading="loading">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status == '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateForm }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editCLick"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="progressClick"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog
      @close="EditDiaogClose"
      title="提示"
      :visible.sync="EditdialogVisible"
      width="50%"
    >
      <el-form
        :model="editData"
        ref="EditFormRefs"
        label-width="100px"
        :rules="editRules"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="ctiy"
            v-model="editData.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详情地址" prop="address2">
          <el-input v-model="editData.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditdialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="提示" :visible.sync="progressDialogVisible" width="50%">
        <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
        </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ctiy from './ctiy'
export default {
  data() {
    return {
      querInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      orderlist: [],
      loading: true,
      EditdialogVisible: false,
      editData: {
        address1: [],
        address2: ''
      },
      editRules: {
        address1: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      ctiy,
      progressDialogVisible: false,
      // 物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.querInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.total = res.data.total
      this.orderlist = res.data.goods
      this.loading = false
    },
    handleSizeChange(newpage) {
      console.log(newpage)
      this.querInfo.pagesize = newpage
      this.getOrderList()
    },
    handleCurrentChange(newsize) {
      console.log(newsize)
      this.querInfo.pagenum = newsize
      this.getOrderList()
    },
    editCLick() {
      this.EditdialogVisible = true
    },
    // 关闭编辑对话框
    EditDiaogClose() {
      console.log('00')
      this.$refs.EditFormRefs.resetFields()
      console.log(this.editData.address2)
    },
    // 点击物流信息
    async progressClick() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      this.progressDialogVisible = true
      if (res.meta.status !== 200)
        return this.$message.error('获取物流进度失败')
      this.progressInfo = res.data
      console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
