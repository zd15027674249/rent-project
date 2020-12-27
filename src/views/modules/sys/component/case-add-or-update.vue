<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="案件名称">
            <el-input v-model="dataForm.caseNo" placeholder="输入案件名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件日期" v-if="dialogType === 'case'">
            <el-date-picker
              v-model="dataForm.caseDate"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dialogType === 'duration'">
          <el-form-item label="截止日期">
            <el-date-picker
              v-model="dataForm.caseDate"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="队伍" prop="team" >
            <el-select v-model="dataForm.caseTeam" @change="teamChange" placeholder="请选择">
              <el-option
                v-for="item in dicData.teamDic"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主办人">
            <el-select v-model="dataForm.organizerUserId" @change="onOrganizerUserChange" filterable placeholder="请选择">
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
        <el-col :span="12"  v-if="dialogType === 'case'">
          <el-form-item label="问题类别" prop="problemCategory">
            <el-select v-model="dataForm.categoryProblem" multiple placeholder="请选择">
              <el-option
                v-for="item in dicData.problemCategoryDic"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"  v-if="dialogType === 'duration'">
          <el-form-item label="类别" prop="problemCategory">
            <el-select v-model="dataForm.categoryProblem" multiple placeholder="请选择">
              <el-option
                v-for="item in dicData.durProblemCategoryDic"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remard">
            <el-input
              type="text"
              placeholder="请输入内容"
              v-model="dataForm.remark"
              maxlength="30"
              :autosize="{ minRows: 2, maxRows: 4}"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {DIC_DATA} from './com_data'
  export default {
    props: {
      dialogType: {
        type: String,
        default: () => {
          return ''
        }
      }
    },
    data () {
      // var validatePassword = (rule, value, callback) => {
      //   if (!this.dataForm.id && !/\S/.test(value)) {
      //     callback(new Error('密码不能为空'))
      //   } else {
      //     callback()
      //   }
      // }
      // var validateComfirmPassword = (rule, value, callback) => {
      //   if (!this.dataForm.id && !/\S/.test(value)) {
      //     callback(new Error('确认密码不能为空'))
      //   } else if (this.dataForm.password !== value) {
      //     callback(new Error('确认密码与密码输入不一致'))
      //   } else {
      //     callback()
      //   }
      // }
      // var validateEmail = (rule, value, callback) => {
      //   if (!isEmail(value)) {
      //     callback(new Error('邮箱格式错误'))
      //   } else {
      //     callback()
      //   }
      // }
      // var validateMobile = (rule, value, callback) => {
      //   if (!isMobile(value)) {
      //     callback(new Error('手机号格式错误'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        dicData: DIC_DATA,
        visible: false,
        roleList: [],
        hostDic: [],
        dataForm: {
          id: '',
          caseNo: '',
          caseDate: '',
          caseTeam: '',
          organizerUserId: '',
          organizerUserName: '',
          organizerCn: '',
          categoryProblem: [],
          remark: ''
        },
        dataRule: {
        }
      }
    },
    mounted () {

    },
    methods: {
      teamChange (e) {
        console.log(e)
        console.log('******')
        let filter = this.dicData.teamDic.filter(p => p.value === e)
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
      },
      editInit (row) {
        let caseTeam = row.caseTeam
        this.teamChange(caseTeam)
      },
      init () {
        this.visible = true
      },
      onOrganizerUserChange (e) {
        let filterList = this.hostDic.filter(p => { return p.userId === e })
        this.dataForm.organizerUserId = e
        this.dataForm.organizerUserName = filterList[0].username
        this.dataForm.organizerCn = filterList[0].cn
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$emit('dataFormSubmit', this.dataForm)
          }
        })
      }
    }
  }
</script>
<style>
  .el-select{
    width: 100%;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
</style>