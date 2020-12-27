<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="政治面貌" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query()">查询</el-button>
        <el-button @click="resert()">重置</el-button>
        <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table border  v-loading="dataListLoading" :data="dataList">
      <el-table-column prop="caseNo"
                       header-align="center"
                       align="center"
                       label="案件名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="caseTeamName"
                       label="案件队伍"
                       header-align="center"
                       align="center"
                       width="110">
      </el-table-column>
      <el-table-column prop="organizerUserName"
                       label="主办人用户名"
                       header-align="center"
                       align="center"
                       width="110">
      </el-table-column>
      <el-table-column prop="organizerCn"
                       label="主办人中文姓名"
                       header-align="center"
                       align="center"
                       width="120">
      </el-table-column>
      <el-table-column prop="caseDate"
                       label="案件日期"
                       header-align="center"
                       align="center"
                       min-width="160">
      </el-table-column>
      <el-table-column prop="createTime"
                       label="截止日期"
                       header-align="center"
                       align="center"
                       min-width="160">
      </el-table-column>
      <el-table-column prop="categoryProblemName"
                       label="类别"
                       header-align="center"
                       align="center"
                       min-width="180">
      </el-table-column>
      <el-table-column prop="effectiveFlag"
                       label="是否有效"
                       header-align="center"
                       align="center"
                       width="80">
        <template slot-scope="scope">
          <el-tag v-if="Number(scope.row.effectiveFlag === 0)" size="small">有效</el-tag>
          <el-tag v-else size="small"  type="danger">删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state"
                       label="状态"
                       header-align="center"
                       align="center"
                       width="80">
        <template slot-scope="scope">
          <el-tag v-if="Number(scope.row.state === 0)" size="small" type="danger">未处理</el-tag>
          <el-tag v-else size="small">已处理</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark"
                       label="备注"
                       header-align="center"
                       align="center"
                       width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!--v-if="isAuth('sys:user:update')"-->
          <!--v-if="isAuth('sys:user:delete')"-->
          <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button  type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" :dialogType="dialogType" ref="addOrUpdate" @dataFormSubmit="dataFormSubmit"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './component/case-add-or-update'
  import {DIC_DATA} from './component/com_data'
  export default {
    data () {
      return {
        dicData: DIC_DATA,
        dialogType: 'duration',
        dataForm: {
          organizerCn: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    mounted () {
      this.listInit()
    },
    methods: {
      listInit () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/case/duration/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'organizerCn': this.dataForm.organizerCn,
            'flag': 'ALL'
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let list = data.page.list
            // caseTeamName  categoryProblemName

            this.dataList = list.map(it => {
              let filter = this.dicData.teamDic.filter(p => p.value === it.caseTeam)
              let categoryProblemLabel = []
              if (it.categoryProblem.length) {
                it.categoryProblem.forEach(item => {
                  let labelFilter = this.dicData.durProblemCategoryDic.filter(p => p.value === item)
                  if (labelFilter.length) {
                    categoryProblemLabel.push(labelFilter[0].label)
                  }
                })
              }
              return Object.assign(it, {caseTeamName: filter[0].label, categoryProblemName: categoryProblemLabel.join(',')})
            })
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      query () {
        this.listInit()
      },
      resert () {
        this.pageIndex = 1
        this.dataForm.organizerCn = ''
        this.listInit()
      },
      // 新增 / 修改
      addOrUpdateHandle (row) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init()
          this.$refs.addOrUpdate.dataForm = {
            id: '',
            caseNo: '',
            caseDate: '',
            caseTeam: '',
            organizerUserId: '',
            organizerUserName: '',
            organizerCn: '',
            categoryProblem: [],
            remark: ''
          }
          if (row) {
            this.$refs.addOrUpdate.editInit(row)
            this.$refs.addOrUpdate.dataForm = JSON.parse(JSON.stringify(row))
          }
        })
      },

      dataFormSubmit (dataForm) {
        let url = dataForm.id ? '/sys/case/duration/update' : '/sys/case/duration/save'
        this.$http({
          url: this.$http.adornUrl(url),
          method: 'post',
          data: this.$http.adornData(dataForm)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.listInit()
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.$refs.addOrUpdate.visible = false
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.listInit()
      },
      currentChangeHandle (val) {
        this.pageIndex = val
        this.listInit()
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/case/duration/delete'),
            method: 'post',
            data: this.$http.adornData({id: id})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.listInit()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
