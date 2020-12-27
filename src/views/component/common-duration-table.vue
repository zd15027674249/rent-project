<template>
  <div class="mod-user">
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
    data () {
      return {
        dicData: DIC_DATA,
        dialogType: 'duration',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    props: {
      cn: {
        type: String,
        default: () => {
          return ''
        }
      }
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
            'organizerCn': this.cn,
            'flag': 'SINGLE'
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
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.listInit()
      },
      currentChangeHandle (val) {
        this.pageIndex = val
        this.listInit()
      }
    }
  }
</script>
