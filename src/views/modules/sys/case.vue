<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm">
      <el-row>
        <el-col :span="18">
          <el-form-item>
            <el-input v-model="dataForm.organizerCn" placeholder="用户名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="query()" >查询</el-button>
            <el-button @click="resert()">重置</el-button>
            <el-button  type="primary" @click="addOrUpdateHandle()" v-if="isShowBtn">新增</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="6" align="right">
          <el-button  type="primary" @click="exportTable()">导出</el-button>
          <el-button  type="primary" @click="openCaseAnalysis()">问题统计</el-button>
        </el-col>
      </el-row>
    </el-form>
    <Case ref="caseRef" :cn="dataForm.organizerCn" @addOrUpdateHandle="addOrUpdateHandle"></Case>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" :dialogType="dialogType" ref="addOrUpdate" @dataFormSubmit="dataFormSubmit"></add-or-update>
    <data-analysis v-if="caseAnalysis" ref="caseAnalysisRef"/>
  </div>
</template>

<script>
  import AddOrUpdate from './component/case-add-or-update'
  import DataAnalysis from './component/data-analysis'
  import Case from '../../component/common-case-table'
  export default {
    data () {
      return {
        dialogType: 'case',
        dataForm: {
          organizerCn: ''
        },
        dataList: [],
        isShowBtn:false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        caseAnalysis: false
      }
    },
    components: {
      AddOrUpdate, Case, DataAnalysis
    },
    mounted () {
      this.$refs.caseRef.list()
      this.getUserInfo()
    },
    methods: {
      openCaseAnalysis () {
        this.caseAnalysis = true
        this.$nextTick(() => {
          this.$refs.caseAnalysisRef.init()
          // this.$refs.caseAnalysisRef.initChartBar()
        })
      },
      query () {
        this.$refs.caseRef.list(this.dataForm.organizerCn)
      },
      exportTable(){
        this.$refs.caseRef.listExport()
      },
      resert () {
        this.dataForm.organizerCn = ''
        this.$refs.caseRef.list()
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
     // 获取当前管理员信息
      getUserInfo () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
          if(data.user.userId===1 && data.user.cn==='管理员'){
            this.isShowBtn = true
          }else{
            this.isShowBtn = false
          }
          }
        })
      },
      dataFormSubmit (dataForm) {
        let url = dataForm.id ? '/sys/case/update' : '/sys/case/save'
        this.$http({
          url: this.$http.adornUrl(url),
          method: 'post',
          data: this.$http.adornData(dataForm)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$refs.caseRef.list()
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
      }
    }
  }
</script>
