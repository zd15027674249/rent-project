<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataFormSearch">
     <el-row>
        <el-col :span="18">
          <el-form-item label="队伍">
            <el-select clearable  v-model="dataFormSearch.seachCase" @change="seachCaseChange"  placeholder="请选择查询条件">
            <el-option
              v-for="item in searchListDW"
              :key="item.code"
              :label="item.label"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="主办人">
            <el-select clearable  v-model="dataFormSearch.seachZBRChangeCase" @change="seachZBRChangeChange"  placeholder="请选择查询条件">
              <el-option
                v-for="item in searchListZBR"
                :key="item.userId"
                :label="item.cn"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="物品所有人">
            <el-input clearable  v-model="dataFormSearch.wpsyrName" placeholder="输入案件名称"></el-input>
          </el-form-item>
          <el-col :span="20">
              <el-form-item label="录入时间">
                <el-date-picker
                  v-model="dataFormSearch.addDate"
                  type="daterange"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
          </el-col>
          <el-form-item>
            <el-button @click="query()">查询</el-button>
            <el-button @click="resert()">重置</el-button>
            <el-button  type="primary" @click="addOrUpdateHandle('add')">新增</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="3" align="right">
          <el-button  type="primary" @click="exportTable()">导出</el-button>
        </el-col>
        <el-col :span="2" align="right">
          <el-button  type="primary" @click="openCaseAnalysis()">问题统计</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div>
    <el-table border  v-loading="dataListLoading" :data="caseData">
      <el-table-column prop="caseName"
                       header-align="center"
                       align="center"
                       label="案件名称"
                       width="180">
      </el-table-column>

      <el-table-column prop="caseTeamLabel"
                       label="案件队伍"
                       header-align="center"
                       align="center"
                       min-width="140">
      </el-table-column>
      <el-table-column prop="organizerCn"
                       label="主办人"
                       header-align="center"
                       align="center"
                       min-width="160">
      </el-table-column>
      <el-table-column prop="statusLabel"
                       label="目前状态"
                       header-align="center"
                       align="center"
                       min-width="160">
      </el-table-column>
      <el-table-column prop="itemUser"
                       label="物品所有人"
                       header-align="center"
                       align="center"
                       min-width="160">
      </el-table-column>
      <el-table-column prop="caseItem"
                       label="涉案物品"
                       header-align="center"
                       align="center"
                       min-width="160">
      </el-table-column>
       <el-table-column prop="enterTime"
                       label="录入时间"
                       header-align="center"
                       align="center"
                       min-width="120">
      </el-table-column>
      <el-table-column prop="remarks"
                       label="备注"
                       header-align="center"
                       align="center"
                       min-width="160">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button  type="text" size="small" @click="viewOrUpdateHandle(scope.row)">查看</el-button>
          <!-- <el-button  type="text" size="small" @click="dealHandle(scope.row.id)">处理</el-button> -->
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
  </div>
    <!-- 弹窗, 新增 / 修改 -->
    <!-- <add-or-update v-if="addOrUpdateVisible" :dialogType="dialogType" ref="addOrUpdate" @dataFormSubmit="dataFormSubmit"></add-or-update>
    <data-analysis v-if="caseAnalysis" ref="caseAnalysisRef"/> -->
    <el-dialog
    :title="testWord"
    @close ='closeToast'
    :close-on-click-modal="false"
    :visible.sync="centerDialogVisible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="案件名称" label-width='100px' prop="caseName">
            <el-input :disabled='disabled' v-model="dataForm.caseName" placeholder="输入案件名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目前状态" prop="mqzt" label-width='100px'>
            <el-select :disabled='disabled' v-model="dataForm.mqzt" @change="mqztChange" filterable placeholder="请选择">
              <el-option
                v-for="item in mqztList"
                :key="item.code"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="队伍" prop="caseTeam" label-width='100px'>
            <el-select :disabled='disabled' v-model="dataForm.caseTeam" @change="teamChange" placeholder="请选择">
              <el-option
                v-for="item in dicData"
                :key="item.code"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主办人" prop="caseUse" label-width='100px'>
            <el-select :disabled='disabled' v-model="dataForm.caseUse" @change="onOrganizerUserChange" filterable placeholder="请选择">
              <el-option
                v-for="item in hostDic"
                :key="item.userId"
                :label="item.cn"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="12">
          <el-form-item label="物品所有人" label-width='100px' prop="wpsyr">
            <el-input :disabled='disabled' v-model="dataForm.wpsyr" placeholder="输入案件名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="涉案物品" label-width='100px' prop="sawp">
            <el-input :disabled='disabled' v-model="dataForm.sawp" placeholder="输入案件名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="录入时间" prop="addTime"  label-width='100px'>
            <el-date-picker
              :disabled='disabled'
              v-model="dataForm.addTime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择录入时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label-width='100px' label="备注" prop="remard">
            <el-input
             :disabled='disabled'
              type="text"
              placeholder="请输入内容"
              v-model="dataForm.remard"
              maxlength="100"
              :autosize="{ minRows: 2, maxRows: 4}"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="isShowBtn">
      <el-button @click="resetForm('dataForm')">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit('dataForm')">确定</el-button>
    </span>
    </el-dialog>
    <!-- <data-analysis v-if="caseAnalysis" ref="caseProject"/> -->
    <director-project-arti v-if="caseAnalysis" ref="caseProject"/>
  </div>
</template>

<script>
  import AddOrUpdate from './component/case-add-or-update'
  import DirectorProjectArti from './component/director-project-arti'
  import Case from '../../component/common-case-table'
  import {DIC_DATA} from './component/com_data'
  export default {
    data () {
      return {
        dataFormSearch:{
          seachCase:'',
          wpsyrName:'',
          seachZBRChangeCase:'',
          addDate:''
        },
        searchListDW:[],
        searchListZBR:[],
        testWord:'新增',
        disabled:false,
        isShowBtn:true,
        dialogType: 'case',
        centerDialogVisible: false,
        dicData: [],
        dataForm: {
          id: '',
          caseName: '',
          caseTeam: '',
          caseUse: '',
          mqzt:'',
          wpsyr:'',
          remard:'',
          sawp:'',
          addTime:'',
        },
        mqztList:[],
        visible: false,
        roleList: [],
        hostDic: [],
        caseData: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        caseAnalysis: false,
        dataRule: {
          caseName: [
            { required: true, message: '请输入案件名称', trigger: 'blur' }
          ],
          caseTeam: [
            { required: true, message: '请选择队伍', trigger: 'change' }
          ],
          mqzt: [
            { required: true, message: '请选择目前状态', trigger: 'change' }
          ],
          wpsyr: [
            { required: true, message: '请输入物品所有人', trigger: 'blur' }
          ],
          sawp: [
            { required: true, message: '请输入涉案物品', trigger: 'blur' }
          ],
          addTime:[
            { required: true, message: '请选择录入时间', trigger: 'change' }
          ],
          caseUse:[
            { required: true, message: '请选择主办人', trigger: 'change' }
          ],
        }
      }
    },
    components: {
      AddOrUpdate, Case, DirectorProjectArti
    },
    mounted () {
      // this.$refs.caseRef.list()
      this.initTable()
      this.getSelectdicData()
      this.getSelectitemstatus()
    },
    methods: {
      seachCaseChange(value){
        console.log(this.dataFormSearch.seachCase,'this.dataFormSearch.seachCase');
        this.dataFormSearch.seachZBRChangeCase = ''
        // console.log(this.dataFormSearch.seachZBRChangeCase,'111');
        let obj = {};
        if(this.dataFormSearch.seachCase != null){
          obj = this.searchListDW.find((item)=>{
            return item.code === value;
          });
          this.dataFormSearch.seachCase = obj.code
        }
        

         let filter = this.searchListDW.filter(p => p.code === value)
        if (filter.length) {
          this.$http({
            url: this.$http.adornUrl(`/sys/user/queryAllUser`),
            method: 'post',
            data: this.$http.adornData({ team: filter[0].label })
          }).then(({data}) => {
            if (data && data.code === 0) {
                this.searchListZBR = data.user
            }
          })
        }
      },
      seachZBRChangeChange(value){
        let obj = {};
        if(this.dataFormSearch.seachZBRChangeCase != null){
          obj = this.searchListZBR.find((item)=>{
            return item.userId === value;
          });
          console.log(obj,'obj');
          this.dataFormSearch.seachZBRChangeCase = obj.cn
        }
      },
      closeToast(){
        this.$refs.dataForm.resetFields()
        this.dataForm= {
          id: '',
          caseName: '',
          caseTeam: '',
          caseUse: '',
          mqzt:'',
          wpsyr:'',
          remard:'',
          sawp:'',
          addTime:''
        }
      },
      mqztChange(value){
        this.dataForm.mqzt = value
      },
      //表格数据初始化
      initTable(){
        this.dataListLoading = true
        const {seachCase,seachZBRChangeCase,wpsyrName,addDate} = this.dataFormSearch
        let startTime ='',endTime ='';
         if(addDate === null){
          startTime =''
          endTime=''
        }else{
          startTime =addDate[0]
          endTime= addDate[1]
        }
        this.$http({
            url: this.$http.adornUrl(`/sys/administrative/case/item/list`),
            method: 'get',
            params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'organizerCn':seachZBRChangeCase,
            'caseTeam':seachCase,
            'itemUser':wpsyrName,
            startTime:startTime,
            endTime:endTime
          })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.totalPage = data.page.totalCount
              this.caseData = data.page.list
              this.dataListLoading = false
            } else {
              this.$message.error(data.msg)
            }
          }).catch(() => {})
    
      },
      deleteHandle (id) {
        this.$confirm(`确定删除吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/administrative/case/item/delete'),
            method: 'post',
            data: this.$http.adornData({id: id})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  // this.list(this.cn)
                  this.initTable()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      dataFormSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.testWord ==='新增'){
              this.submitSave()
            }else if(this.testWord ==='修改'){
              this.submitSaveUpdate()
            } 
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      submitSave(){
        this.centerDialogVisible= false
        const {
          caseName,
          caseTeam,
          caseUse,
          mqzt,
          wpsyr,
          remard,
          sawp,
          organizerUserName,
          organizerCn,
          addTime
        } = this.dataForm
        this.$http({
            url: this.$http.adornUrl(`/sys/administrative/case/item/save`),
            method: 'post',
            data: {
              caseName:caseName,
              caseTeam:caseTeam,
              organizerUserId:caseUse,
              organizerUserName: organizerUserName,
              organizerCn: organizerCn,
              itemUser:wpsyr,
              caseItem:sawp,
              status:mqzt,
              remarks:remard,
              enterTime:addTime
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
                this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  // this.centerDialogVisible= false
                  this.initTable()
                }
              })
            }
          })
      },
      resetForm (formName) {
        this.centerDialogVisible = false
        this.$refs[formName].resetFields()
      },
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.initTable()
        // this.list(this.cn)
      },
      currentChangeHandle (val) {
        this.pageIndex = val
        this.initTable()
        // this.list(this.cn)
      },
      //案件性质
      caseTypeChange(value){ 
        this.dataForm.caseTyp = value
      },
      openCaseAnalysis () {
        this.caseAnalysis = true
        this.$nextTick(() => {
          this.$refs.caseProject.init()
          // this.$refs.caseAnalysisRef.initChartBar()
        })
      },
      query () {
        this.initTable()
      },
      resert () {
        this.dataFormSearch.seachCase = ''
        this.dataFormSearch.seachZBRChangeCase='',
        this.dataFormSearch.wpsyrName='',
        this.dataFormSearch.addDate =''
        // this.dataFormSearch.addDate[0] =''
        // this.dataFormSearch.addDate[1] =''
        this.pageIndex =1
        this.pageSize=10
        this.initTable()
      },
      // 新增 / 修改
      addOrUpdateHandle (row) {
        this.disabled = false
        this.isShowBtn = true
        if(row==='add'){
          this.testWord ='新增'
          this.centerDialogVisible = true
        }else{
          this.testWord ='修改'
          this.centerDialogVisible = true
          this.disabled = false
          this.isShowBtn = true
          this.centerDialogVisible = true
          this.dataForm.caseName = row.caseName
          this.dataForm.caseTeam = row.caseTeam
          this.dataForm.mqzt =row.status
          this.dataForm.wpsyr =row.itemUser
          this.dataForm.remard = row.remarks
          this.dataForm.addTime= row.enterTime
          this.dataForm.sawp =row.caseItem
          this.teamChange(row.caseTeam)
          this.dataForm.caseUse =row.organizerUserId
          this.dataForm.organizerCn = row.organizerCn
          this.dataForm.organizerUserName = row.organizerUserName
          
        }
        
      },
      submitSaveUpdate(){
        this.centerDialogVisible= false
        const {
          id,
          caseName,
          caseTeam,
          caseUse,
          mqzt,
          wpsyr,
          remard,
          sawp,
          organizerUserName,
          organizerCn,
          addTime
        } = this.dataForm
        this.$http({
            url: this.$http.adornUrl(`/sys/administrative/case/item/update`),
            method: 'post',
            data: {
              id:id,
              caseName:caseName,
              caseTeam:caseTeam,
              organizerUserId:caseUse,
              organizerUserName: organizerUserName,
              organizerCn: organizerCn,
              itemUser:wpsyr,
              caseItem:sawp,
              status:mqzt,
              remarks:remard,
              enterTime:addTime
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
                this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  // this.centerDialogVisible= false
                  this.initTable()
                }
              })
            }
          })
      },
      viewOrUpdateHandle(row){
        this.testWord ='查看'
        this.disabled = true
        this.isShowBtn = false
        this.centerDialogVisible = true
        this.dataForm.caseName = row.caseName
        this.dataForm.caseTeam = row.caseTeam
        this.dataForm.mqzt =row.status
        this.dataForm.wpsyr =row.itemUser
        this.dataForm.remard = row.remarks
        this.dataForm.sawp =row.caseItem
        this.dataForm.addTime= row.enterTime
        this.teamChange(row.caseTeam)
        this.dataForm.caseUse =row.organizerUserId
        this.dataForm.organizerCn = row.organizerCn
        this.dataForm.organizerUserName = row.organizerUserName
      },
      onOrganizerUserChange (e) {
        let filterList = this.hostDic.filter(p => { return p.userId === e })
        this.dataForm.organizerUserId = e
        this.dataForm.organizerUserName = filterList[0].username
        this.dataForm.organizerCn = filterList[0].cn
      },
      //导出
      exportTable(){
         const {seachCase,seachZBRChangeCase,wpsyrName,addDate} = this.dataFormSearch
         let startTime ='',endTime ='';
         if(addDate === null){
          startTime =''
          endTime=''
        }else{
          startTime =addDate[0]
          endTime= addDate[1]
        }
        //  window.open(`${url}?${qs.stringify(param)}`, '_blank');
        // this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`)
        this.$http({
            url: this.$http.adornUrl(`/sys/administrative/case/item/export`),
            method: 'get',
            responseType: 'arraybuffer',
            params:this.$http.adornParams({  
                organizerCn:seachZBRChangeCase,
                caseTeam:seachCase,
                itemUser:wpsyrName,
                startTime:startTime,
                endTime:endTime
            })
          }).then(({data}) => {
                 if('msSaveOrOpenBlob' in navigator){//兼容ie
                    // var data= res;//获取响应
                    var blob = new Blob([data], {type: 'application/vnd.ms-excel'});
                    window.navigator.msSaveOrOpenBlob(blob, options.data.fileName+".xls");
                }else{
                  const url = window.URL.createObjectURL(new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}))
                  const link = document.createElement('a')
                  link.style.display = 'none'
                  link.href = url
                  link.setAttribute('download', 'excel.xlsx','excel.xls')
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }
          })
        // window.location.href=`${window.SITE_CONFIG['baseUrl']}/sys/criminal/case/export?organizerCn=${seachZBRChangeCase}&caseTeam=${seachCase}&idNumber=${caseNumSFZ}&caseName=${ajName}&token=${this.$cookie.get('token')}`
      },
      // 队伍
      getSelectdicData(){
         this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/teamcode`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.dicData = data.data
            }
          })
      },
      // mqztList 目前状态
      getSelectitemstatus(){
         this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/itemstatus`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.mqztList = data.data
            }
          })
      },
      // 队伍
      getSelectdicData(){
         this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/teamcode`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.dicData = data.data
                this.searchListDW = data.data
            }
          })
      },
      teamChange (e) {
        // console.log(e)
        // console.log('******')
        this.dataForm.caseUse = ''
        let filter = this.dicData.filter(p => p.code === e)
        if (filter.length) {
          this.$http({
            url: this.$http.adornUrl(`/sys/user/queryAllUser`),
            method: 'post',
            data: this.$http.adornData({ team: filter[0].label })
          }).then(({data}) => {
            if (data && data.code === 0) {
                this.hostDic = data.user
            }
          })
        }
      }
    }
  }
</script>
