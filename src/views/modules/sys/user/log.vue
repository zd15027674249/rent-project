<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="用户名">
        <el-select v-model="dataForm.userId" filterable placeholder="请选择">
          <el-option
            v-for="item in hostDic"
            :key="item.userId"
            :label="item.cn"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起始日期">
        <el-date-picker
          v-model="dataForm.startDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="options2"
          @change="startChange"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="dataForm.endDate"
          type="date"
          format="yyyy-MM-dd"
          :picker-options="options1"
          @change="endChange"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button @click="resert">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="cn"
        header-align="center"
        align="center"
        label="用户中文名">
      </el-table-column>
      <el-table-column
        prop="loginDate"
        header-align="center"
        align="center"
        label="登录日期">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        options2: {},
        options1: {},
        dataForm: {
          userId: '',
          startDate: null,
          endDate: null
        },
        hostDic: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    activated () {
      this.getDataList()
      this.init()
    },
    methods: {
      startChange (e) {
        this.options1 = {
          disabledDate: date => {
            let startTime = e ? new Date(e).valueOf() - 1 * 24 * 60 * 60 * 1000 : ''
            return date && (date.valueOf() < startTime)
          }
        }
      },
      endChange (e) {
        let endTime = e ? new Date(e).valueOf() : ''
        this.options2 = {
          disabledDate (date) { return date && date.valueOf() > endTime }
        }
      },
      init () {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/queryAllUser`),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.hostDic = data.user
          }
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/user/log/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'userId': this.dataForm.userId,
            'startDate': this.dataForm.startDate,
            'endDate': this.dataForm.endDate
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      query () {
        this.pageSize = 10
        this.pageIndex = 1
        this.getDataList()
      },
      resert () {
        this.dataForm = {
          userId: '',
          startDate: null,
          endDate: null
        }
        this.pageSize = 10
        this.pageIndex = 1
        this.getDataList()
      }
    }
  }
</script>
