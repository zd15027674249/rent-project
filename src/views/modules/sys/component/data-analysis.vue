<template>
  <el-dialog
    :title="valType"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item  label="类型">
            <el-select v-model="anjianxuncha" placeholder="请选择"  @change="oncaseTeam">
              <el-option
                v-for="item in anjianxunchaList"
                :key="item.code"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item label="时间">
            <el-date-picker
              v-model="addDate"
              type="daterange"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="onChangeDate"
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" align="right">
          <el-form-item>
            <el-button  type="primary" @click="query">查询</el-button>
            <el-button @click="resert">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" align="center">
        <div id="chartBarBox" class="chart-box"></div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import echarts from 'echarts'
  import {DIC_DATA} from './com_data'
  export default {
    name: 'data-analysis',
    data () {
      return {
        dicData: DIC_DATA,
        visible: false,
        hostDic: [],
        anjianxunchaList:[],
        anjianxuncha: '01',
        addDate:'',
        valType:'问题类型',
        result: []
      }
    },
    watch: {
      visible (val) {
        if (val) {
          this.$nextTick(() => {
            this.initChartBar()
          })
        }
      }
    },
    activated () {
      if (this.chartBar) {
        this.chartBar.resize()
      }
    },
    mounted(){
      this.getSelectList()
    },
    methods: {
      query () {
        this.initChartBar()
      },
      resert () {
        this.addDate = ''
        this.valType = '问题类型'
        this.initChartBar()
      },
      init () {
        this.visible = true
      },
      // 刑事案件类型
      getSelectList(){
        this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/anjianxuncha`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.anjianxunchaList = data.data
            }
          })
      },
      oncaseTeam (e) {
        
      },
      onChangeDate(val){
        this.addDate = val
      },
      initChartBar () {
         let startTime ='',endTime='';
        if(this.addDate===null){
          startTime ='',endTime='';
        }else{
          startTime =this.addDate[0];
          endTime=this.addDate[1];
        }
        let option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "", // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            data: ['数量']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisTick: {
              //x轴刻度线
              show: false,
            },
            },
            
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '数量',
              type: 'bar',
              data: [],
              itemStyle: {
                normal: {
                  color: "#17B3A3",
                  label: {
                    show: true, //开启显示
                    position: "top", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "black",
                      fontSize: 12,
                    },
                  },
                },
              },
              
            }
          ]
        }
        this.$http({
          url: this.$http.adornUrl('/sys/case/report'),
          method: 'post',
          data: this.$http.adornData({
            'type': this.anjianxuncha,
            'startDate':startTime,
            'endDate':endTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let result = data.report
            if (result.length) {
              option.xAxis[0].data = []
              option.series[0].data = []
              result.forEach(it => {
                let labelFilter = this.dicData.problemCategoryDic.filter(p => p.value === it.categoryProblem)
                option.xAxis[0].data.push(labelFilter.length ? labelFilter[0].label : it.categoryProblem)
                option.series[0].data.push(it.num)
              })
              this.chartBar = echarts.init(document.getElementById('chartBarBox'))
              this.chartBar.setOption(option)
              window.addEventListener('resize', () => {
                this.chartBar.resize()
              })
            } else {
              option.xAxis[0].data = []
              option.series[0].data = []
              this.chartBar = echarts.init(document.getElementById('chartBarBox'))
              this.chartBar.setOption(option)
              window.addEventListener('resize', () => {
                this.chartBar.resize()
              })
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style>
  .chart-box {
    width: 80%;
    min-height: 400px;
  }
  .el-select{
    width: 100%;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
</style>
