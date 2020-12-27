<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataFormSearch">
     <el-row>
        <el-col :span="19">
          <el-row>
            <el-col :span="16">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="队伍">
                    <el-select clearable  v-model="dataFormSearch.seachCase" @change="seachCaseChange" clearable   placeholder="请选择查询条件">
                    <el-option
                      v-for="item in searchListDW"
                      :key="item.code"
                      :label="item.label"
                      :value="item.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="主办人">
                    <el-select  clearable  v-model="dataFormSearch.seachZBRChangeCase" @change="seachZBRChangeChange"  placeholder="请选择查询条件">
                      <el-option
                        v-for="item in searchListZBR"
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
                  <el-form-item label="案件名称">
                    <el-input clearable  v-model="dataFormSearch.caseName" placeholder="输入案件名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="身份证号">
                    <el-input  clearable  onkeyup="this.value = this.value.replace(/[^\d.]/g,'');" maxlength="18"  v-model="dataFormSearch.caseNumSFZ" placeholder="输入案件名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="录入时间">
                     <el-date-picker
                        v-model="dataFormSearch.addDate"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button @click="query()">查询</el-button>
                <el-button @click="resert()">重置</el-button>
                <el-button  type="primary" @click="addOrUpdateHandle('add')">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
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
      <el-table-column prop="natureCaseLabel"
                       label="案件性质"
                       header-align="center"
                       align="center"
                       width="110">
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
      
      <el-table-column prop="penaltyTypeLabel"
                       label="处罚类型"
                       header-align="center"
                       align="center"
                       width="120">
      </el-table-column>

      <el-table-column prop="penaltyUser"
                       label="被处罚人"
                       header-align="center"
                       align="center"
                       width="80">
      </el-table-column>
      <el-table-column prop="idNumber"
                       label="身份证号"
                       header-align="center"
                       align="center"
                       width="80">
      </el-table-column>
      <el-table-column prop="ageLabel"
                       label="年龄"
                       header-align="center"
                       align="center"
                       min-width="120">
      </el-table-column>
      <el-table-column prop="politicalOutlookLabel"
                       label="政治面貌"
                       header-align="center"
                       align="center"
                       min-width="120">
      </el-table-column>
      <el-table-column prop="workUnitLabel"
                       label="工作单位"
                       header-align="center"
                       align="center"
                       min-width="120">
      </el-table-column>
      <el-table-column prop="enterTime"
                       label="录入时间"
                       header-align="center"
                       align="center"
                       min-width="120">
      </el-table-column>
      <el-table-column prop="genderLabel"
                       label="性别"
                       header-align="center"
                       align="center"
                       min-width="120">
      </el-table-column>
      <el-table-column prop="address"
                       label="地址"
                       header-align="center"
                       align="center"
                       show-overflow-tooltip
                       min-width="160">
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
          <el-form-item label="案件性质" label-width='100px' prop="caseType">
            <el-select :disabled='disabled' v-model="dataForm.caseType" @change="caseTypeChange" filterable placeholder="请选择">
              <el-option
                v-for="item in caseTypeList"
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
        <el-col :span="12" > 
          <el-form-item label="处罚类型" prop="caseMeasures" label-width='100px'> 
            <el-select :disabled='disabled' v-model="dataForm.caseMeasures"  placeholder="请选择">
              <el-option
                v-for="item in compulsoryMeasure"
                :key="item.code"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工作单位" prop="caseWork" label-width='100px'>
            <el-select :disabled='disabled' v-model="dataForm.caseWork" placeholder="请选择" @change="caseWorkChange">
              <el-option
                v-for="item in caseWorkList"
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
          <el-form-item label="被处罚人" label-width='100px' prop="caseCriminalSuspect">
            <el-input :disabled='disabled' v-model="dataForm.caseCriminalSuspect" placeholder="输入案件名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="caseNumber" label-width='100px'>
            <el-input :disabled='disabled' v-model="dataForm.caseNumber" placeholder="输入案件名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="年龄" prop="caseAge" label-width='100px'>
            <el-select :disabled='disabled' v-model="dataForm.caseAge" placeholder="请选择" @change="caseAgeChange">
              <el-option
                v-for="item in caseAgeLsit"
                :key="item.code"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      <el-col :span="12">
          <el-form-item label="政治面貌" prop="casePolitical" label-width='100px'>
            <el-select  :disabled='disabled' v-model="dataForm.casePolitical" placeholder="请选择" @change="casePoliticalChange">
              <el-option
                v-for="item in casePoliticalList"
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
          <el-form-item label="性别" prop="caseSex" label-width='100px'>
            <el-select :disabled='disabled' v-model="dataForm.caseSex" placeholder="请选择性别" @change="caseSexListChange">
              <el-option
                v-for="item in caseSexList"
                :key="item.code"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
          <el-form-item label-width='100px' label="地址">
            <el-input
             :disabled='disabled'
              type="text"
              placeholder="请输入地址"
              v-model="dataForm.address"
              
              :autosize="{ minRows: 2, maxRows: 4}"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label-width='100px' label="备注">
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
    <director-project-count v-if="caseAnalysis" ref="caseProject"/>
  </div>
</template>

<script>
  import AddOrUpdate from './component/case-add-or-update'
  import DirectorProjectCount from './component/director-project-count'
  import Case from '../../component/common-case-table'
  import {DIC_DATA} from './component/com_data'
  export default {
    data () {
      return {
        dataFormSearch:{
          seachCase:'',
          seachZBRChangeCase:'',
          caseNumSFZ:'',
          ajName:'',
          addDate:'',
        },
        caseSexList:[],
        searchListDW:[],
        searchListZBR:[],
        testWord:'新增',
        disabled:false,
        isShowBtn:true,
        caseWorkList:[],
        casePoliticalList:[],
        caseAgeLsit:[],
        dialogType: 'case',
        centerDialogVisible: false,
        dicData: [],
        dataForm: {
          id:'',
          caseName: '',
          caseType: '',
          caseTeam: '',
          caseUse: '',
          caseMeasures: '',
          caseWork: '',
          caseCriminalSuspect: '',
          caseNumber: '',
          caseAge: '',
          casePolitical: '',
          isSY: '',
          remard:'',
          caseDate: '',
          organizerCn:'',
          organizerUserName:'',
          caseSex:'',
          address:'',
          addTime:''
        },
        caseTypeList:[],
        compulsoryMeasure: [],
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
          caseType: [
            { required: true, message: '请选择案件性质  ', trigger: 'change' }
          ],
          caseTeam: [
            { required: true, message: '请选择队伍', trigger: 'change' }
          ],
          caseMeasures: [
            { required: true, message: '请选择处罚类型', trigger: 'change' }
          ],
          caseWork: [
            { required: true, message: '请选择工作单位', trigger: 'change' }
          ],
          caseCriminalSuspect: [
            { required: true, message: '请输入被处罚人名称', trigger: 'blur' }
          ],
          caseSex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
          addTime:[
            {  required: true, message: '请选择录入时间', trigger: 'change' }
          ],
          caseNumber: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
              { min: 15, max: 18, message: '请如实填写18位号码', trigger: 'blur' },
              {
                   required: true,
                   pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                   message: '请输入正确的身份证号码',
                   trigger: 'blur'
              }
          ],
          caseAge: [
            { required: true, message: '请选择年龄', trigger: 'change' }
          ],
          casePolitical: [
            { required: true, message: '请选择政治面貌', trigger: 'change' }
          ],
          isSY: [
            { required: true, message: '请选择是否移送起诉', trigger: 'change' }
          ],
          caseDate:[
            { type: 'date', required: true, message: '请选择移送时间', trigger: 'change' }
          ],
          caseUse:[
            { required: true, message: '请选择主办人', trigger: 'change' }
          ],
        }
      }
    },
    components: {
      AddOrUpdate, Case, DirectorProjectCount
    },
    mounted () {
      // this.$refs.caseRef.list()
      this.getSelectdicData()
      this.getSelectcaseTypeList()
      this.getSelectcaseAgeLsit()
      this.getSelecworkunit()
      this.getSelectpenaltytype()
      this.getSelectpoliticaloutlook()
      this.getSelectcaseSexList()
      this.initTable()
    },
    methods: {
      
      caseWorkChange(value){
        this.dataForm.caseWork = value
      },
      caseAgeChange(value){
        this.dataForm.caseAge = value

      },
      casePoliticalChange(value){
        this.dataForm.casePolitical = value

      },
      seachCaseChange(value){
        // console.log(this.dataFormSearch.seachCase,'this.dataFormSearch.seachCase');
        this.dataFormSearch.seachZBRChangeCase = ''
        console.log(this.dataFormSearch.seachZBRChangeCase,'111');
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
          // console.log(obj,'obj');
          this.dataFormSearch.seachZBRChangeCase = obj.cn
        }
      },
      caseSexListChange(value){
        this.dataForm.caseSex = value
      },
      closeToast(){
        // this.$nextTick(() => {
        //   this.$refs['formName'].resetFields()
        // })
        // console.log(111)
        this.$refs.dataForm.resetFields()
        this.dataForm = {
          id:'',
          caseName: '',
          caseType: '',
          caseTeam: '',
          caseUse: '',
          caseMeasures: '',
          caseWork: '',
          caseCriminalSuspect: '',
          caseNumber: '',
          caseAge: '',
          casePolitical: '',
          remard:'',
          organizerCn:'',
          organizerUserName:'',
          caseSex:'',
          address:'',
          addTime:''
        }
      },
      //表格数据初始化
      initTable(){
        this.dataListLoading = true
        const {seachCase,seachZBRChangeCase,caseNumSFZ,ajName,addDate} = this.dataFormSearch
        let startTime ='',endTime ='';
         if(addDate === null){
          startTime =''
          endTime=''
        }else{
          startTime =addDate[0]
          endTime= addDate[1]
        }
        this.$http({
            url: this.$http.adornUrl(`/sys/administrative/case/list`),
            method: 'get',
            params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'organizerCn':seachZBRChangeCase,
            'caseTeam':seachCase,
            'idNumber':caseNumSFZ,
            'caseName':ajName,
            'startTime':startTime,
            'endTime':endTime
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
            url: this.$http.adornUrl('/sys/administrative/case/delete'),
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
            if(this.testWord==='新增'){
                this.submitSave()
            }else if(this.testWord==='修改'){
              this.submitSaveUpdate()
            }
            
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      //保存
      submitSave(){
        this.centerDialogVisible= false
        const {
          caseName,
          caseType,
          caseTeam,
          caseUse,
          caseMeasures,
          caseWork,
          caseCriminalSuspect,
          caseNumber,
          caseAge,
          casePolitical,
          remard,
          organizerCn,
          organizerUserName,
          caseSex,
          address,
          addTime
          }= this.dataForm
       this.$http({
            url: this.$http.adornUrl(`/sys/administrative/case/save`),
            method: 'post',
            data: {
              id:'',
              caseName:caseName,
              caseTeam:caseTeam,
              organizerUserId: caseUse,
              organizerUserName: organizerUserName,
              organizerCn: organizerCn,
              natureCase:caseType,
              penaltyType:caseMeasures,
              penaltyUser:caseCriminalSuspect,
              idNumber:caseNumber,
              age:caseAge,
              politicalOutlook:casePolitical,
              workUnit:caseWork,
              remarks:remard,
              gender:caseSex,
              address:address,
              enterTime:addTime,
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
                this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  // this.list(this.cn)
                  this.initTable()
                  // this.centerDialogVisible = false
                }
              })
            }
          })
      },
      //保存
      submitSaveUpdate(){
        this.centerDialogVisible= false
        const {
          id,
          caseName,
          caseType,
          caseTeam,
          caseUse,
          caseMeasures,
          caseWork,
          caseCriminalSuspect,
          caseNumber,
          caseAge,
          casePolitical,
          remard,
          organizerCn,
          organizerUserName,
          caseSex,
          address,
          addTime
          }= this.dataForm
       this.$http({
            url: this.$http.adornUrl(`/sys/administrative/case/update`),
            method: 'post',
            data: {
              id:id,
              caseName:caseName,
              caseTeam:caseTeam,
              organizerUserId: caseUse,
              organizerUserName: organizerUserName,
              organizerCn: organizerCn,
              natureCase:caseType,
              penaltyType:caseMeasures,
              penaltyUser:caseCriminalSuspect,
              idNumber:caseNumber,
              age:caseAge,
              politicalOutlook:casePolitical,
              workUnit:caseWork,
              remarks:remard,
              gender:caseSex,
              address:address,
              enterTime:addTime,
            }
          }).then(({data}) => {
            if (data && data.code === 0) {
                this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  // this.list(this.cn)
                  this.initTable()
                  // this.centerDialogVisible = false
                }
              })
            }
          })
      },
      resetForm (formName) {
        this.centerDialogVisible = false
        this.$refs[formName].resetFields()
      },
      categoryProblemChange (val) {
        
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
      //导出
      exportTable(){
       const {seachCase,seachZBRChangeCase,caseNumSFZ,ajName,addDate} = this.dataFormSearch
       let startTime ='',endTime ='';
         if(addDate === null){
          startTime =''
          endTime=''
        }else{
          startTime = addDate[0]
          endTime= addDate[1]
        }
        //  window.open(`${url}?${qs.stringify(param)}`, '_blank');
        // this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`)
        this.$http({
            url: this.$http.adornUrl(`/sys/administrative/case/export`),
            method: 'get',
            responseType: 'arraybuffer',
            params:this.$http.adornParams({  
                organizerCn:seachZBRChangeCase,
                caseTeam:seachCase,
                idNumber:caseNumSFZ,
                caseName:ajName,
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
      },
      query () {
        this.initTable()
        // this.$refs.caseRef.list(this.dataForm.organizerCn)
      },
      resert () {
        this.dataFormSearch.seachCase = ''
        this.dataFormSearch.seachCase=''
        this.dataFormSearch.seachZBRChangeCase=''
        this.dataFormSearch.caseNumSFZ=''
        this.dataFormSearch.ajName=''
        // this.dataFormSearch.addDate[0] = ''
        // this.dataFormSearch.addDate[1] = ''
        this.dataFormSearch.addDate = ''
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
          //修改调详情接口
          // this.initTable()
          this.testWord ='修改'
          this.centerDialogVisible = true
          this.dataForm.id = row.id
          this.dataForm.caseName = row.caseName
          this.dataForm.caseTeam = row.caseTeam
          this.dataForm.caseType = row.natureCase
          this.dataForm.caseMeasures = row.penaltyType
          this.dataForm.caseCriminalSuspect = row.penaltyUser
          this.dataForm.caseNumber = row.idNumber
          this.dataForm.caseAge =  row.age
          this.dataForm.casePolitical = row.politicalOutlook
          this.dataForm.caseWork = row.workUnit
          this.dataForm.remard = row.remarks
          this.dataForm.caseSex=row.gender
          this.dataForm.address=row.address
          this.dataForm.addTime=row.enterTime
          if(this.dataForm.isSY=="Y"){
            this.isShowDate = true
          }else{
            this.isShowDate = false
          }
          this.teamChange(row.caseTeam)
          this.dataForm.caseUse  = row.organizerUserId
          this.dataForm.organizerUserName = row.organizerUserName
          this.dataForm.organizerCn = row.organizerCn
          this.disabled = false
          this.isShowBtn = true
        }
        
      },
      viewOrUpdateHandle(row){
        this.testWord ='查看'
        this.disabled = true
        this.isShowBtn = false
        this.centerDialogVisible = true
        this.dataForm.id = row.id
        this.dataForm.caseName = row.caseName
        this.dataForm.caseTeam = row.caseTeam
        this.dataForm.caseType = row.natureCase
        this.dataForm.caseMeasures = row.penaltyType
        this.dataForm.caseDate = row.transferDate
        this.dataForm.caseNumber = row.idNumber
        this.dataForm.caseAge =  row.age
        this.dataForm.casePolitical = row.politicalOutlook
        this.dataForm.caseCriminalSuspect = row.penaltyUser
        this.dataForm.caseWork = row.workUnit
        this.dataForm.remard = row.remarks
        this.dataForm.caseSex=row.gender
        this.dataForm.address=row.address
        this.dataForm.addTime=row.enterTime
        this.teamChange(row.caseTeam)
        this.dataForm.caseUse  = row.organizerUserId
        this.dataForm.organizerUserName = row.organizerUserName
        this.dataForm.organizerCn = row.organizerCn
      },
      onOrganizerUserChange (e) {
        let filterList = this.hostDic.filter(p => { return p.userId === e })
        this.dataForm.caseUse = e
        this.dataForm.organizerUserName = filterList[0].username
        this.dataForm.organizerCn = filterList[0].cn
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
       // 行政案件类型
      getSelectcaseTypeList(){
        this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/administrative`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.caseTypeList = data.data
            }
          })
      },
       //年龄
      getSelectcaseAgeLsit(){
         this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/age`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.caseAgeLsit = data.data
            }
          })
      },
      getSelectcaseSexList(){
        this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/gender`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.caseSexList = data.data
            }
          })
      },
      // 工作单位 workunit
      getSelecworkunit(){
         this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/workunit`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.caseWorkList = data.data
            }
          })
      },
      //政治面貌 "politicaloutlook
      getSelectpoliticaloutlook(){
         this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/politicaloutlook`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.casePoliticalList = data.data
            }
          })
      },
      //处罚类型 "penaltytype
      getSelectpenaltytype(){
         this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/penaltytype`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.compulsoryMeasure = data.data
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
