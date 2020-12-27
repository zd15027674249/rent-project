<template>
  <div>
    <el-table border  v-loading="dataListLoading" :data="caseData">
      <el-table-column prop="effectiveFlag"
                       label="是否有效"
                       header-align="center"
                       align="center"
                       width="80">
        <template slot-scope="scope">
          <el-tag v-if="Number(scope.row.effectiveFlag) === 0" size="small">有效</el-tag>
          <el-tag v-else size="small"  type="danger">删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state"
                       label="状态"
                       header-align="center"
                       align="center"
                       width="80">
        <template slot-scope="scope">
          <el-tag v-if="Number(scope.row.state) === 0" size="small" type="danger">未处理</el-tag>
          <el-tag v-else size="small">已处理</el-tag>
        </template>
      </el-table-column>
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
                       min-width="140">
      </el-table-column>
      <el-table-column prop="categoryProblemName"
                       label="问题类别"
                       header-align="center"
                       align="center"
                       min-width="160">
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
                       label="创建时间"
                       header-align="center"
                       align="center"
                       min-width="160">
      </el-table-column>
      
      <el-table-column prop="remark"
                       label="备注"
                       header-align="center"
                       align="center"
                       min-width="120">
      </el-table-column>
      <el-table-column
        v-if="pageType !== 'dialog'"
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!--v-if="isAuth('sys:user:update')"-->
          <!--v-if="isAuth('sys:user:delete')"-->
          <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button  type="text" size="small" @click="dealHandle(scope.row.id)">处理</el-button>
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
</template>

<script>
  import {DIC_DATA} from '../modules/sys/component/com_data'
  export default {
    name: 'common-case-table',
    props: {
      cn: {
        type: String,
        default: () => {
          return ''
        }
      },
      pageType: {
        type: String,
        default: () => {
          return ''
        }
      }
    },
    data () {
      return {
        dicData: DIC_DATA,
        dataListLoading: false,
        caseData: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0
      }
    },
    methods: {
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.list(this.cn)
      },
      currentChangeHandle (val) {
        this.pageIndex = val
        this.list(this.cn)
      },
      list (cn) {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/case/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'organizerCn': cn,
            'flag': this.pageType === 'dialog' ? 'SINGLE' : 'ALL'
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let list = data.page.list
            this.caseData = list.map(it => {
              let filter = this.dicData.teamDic.filter(p => p.value === it.caseTeam)
              let categoryProblemLabel = []
              if (it.categoryProblem.length) {
                it.categoryProblem.forEach(item => {
                  let labelFilter = this.dicData.problemCategoryDic.filter(p => p.value === item)
                  if (labelFilter.length) {
                    categoryProblemLabel.push(labelFilter[0].label)
                  }
                })
              }
              return Object.assign(it, {caseTeamName: filter[0].label, categoryProblemName: categoryProblemLabel.join(',')})
            })
            this.totalPage = data.page.totalCount
          } else {
            this.caseData = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      listExport () {
        //  window.open(`${url}?${qs.stringify(param)}`, '_blank');
        // this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`)
        this.$http({
            url: this.$http.adornUrl(`/sys/case/export`),
            method: 'get',
            responseType: 'arraybuffer',
            params:this.$http.adornParams({  
                organizerCn:this.cn,
                flag: this.pageType === 'dialog' ? 'SINGLE' : 'ALL'
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
      // 修改
      addOrUpdateHandle (row) {
        this.$emit('addOrUpdateHandle', row)
      },
      deleteHandle (id) {
        this.$confirm(`确定删除吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/case/delete'),
            method: 'post',
            data: this.$http.adornData({id: id})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.list(this.cn)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      dealHandle (id) {
        this.$http({
          url: this.$http.adornUrl('/sys/case/handle'),
          method: 'post',
          data: this.$http.adornData({id: id})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.list(this.cn)
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

<style scoped>

</style>