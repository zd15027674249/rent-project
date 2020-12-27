<template>
  <el-dialog
    :title="valueLable"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form label-width="80px" ref="dataFormSearch">
     <el-row>
        <el-col :span="8">
          <el-form-item label="类型">
            <el-select v-model="valueType" placeholder="请选择" @change="onChangeList">
              <el-option
                v-for="item in xsajList"
                :key="item.code"
                :label="item.label"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
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
            <el-button type="primary" @click="query()">查询</el-button>
            <el-button @click="resert()">重置</el-button>
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
        result: [],
        xsajList: [],
        valueType: '01',
        valueLable:'涉案物品',
        addDate:''
      }
    },
    watch: {
      visible (val) {
        if (val) {
          this.$nextTick(() => {
            this.initChartBar()
          })
        }
      },
      // valueType(oldVal,newVal){
      //   this.initChartBar()
      // }
    },
    activated () {
      if (this.chartBar) {
        this.chartBar.resize()
      }
    },
    mounted(){
      this.getSelecxingshianjian()
    },
    methods: {
      onChangeList(val){
        this.valueType = val
        let obj = {}
        obj = this.xsajList.find((item)=>{
            return item.code === val;
        });
        // console.log();
        this.valueLable = obj.label
      },
      onChangeDate(val){
        this.addDate = val
      },
      init () {
        this.visible = true
      },
      // 工作单位 workunit
      getSelecxingshianjian(){
         this.$http({
            url: this.$http.adornUrl(`/sys/dict/get/xingzhenganjianitem`),
            method: 'get',
          }).then(({data}) => {
            // console.log(data,'data')
            if (data) {
                this.xsajList = data.data
            }
          })
      },
      query(){
        this.initChartBar()
      },
      resert(){
        this.valueType = '01'
        this.valueLable ='涉案物品'
        this.addDate = ''
        this.initChartBar()
      },
      initChartBar () {
        let startTime ='',endTime='';
        if(this.addDate===null){
          startTime ='',endTime='';
        }else{
          startTime =this.addDate[0];
          endTime=this.addDate[1];
        }
        this.$http({
            url: this.$http.adornUrl(`/sys/administrative/case/item/report`),
            method: 'post',
            // data: this.$http.adornData({id: id})
            data: this.$http.adornData({
            'type': this.valueType,
            'startDate':startTime,
            'endDate':endTime
          })
          }).then(({data}) => {
            if (data && data.code === 0) {
            let result = data.data
              this.chartBar = echarts.init(document.getElementById('chartBarBox'))
             
              // window.addEventListener('resize', () => {
              //   this.chartBar.resize()
              // })
              let option = {
                color: ['#3398DB'],
                  tooltip: {
                      trigger: 'axis',
                      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                      }
                  },
                  grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                  },
                xAxis: {
                    type: 'category',
                    data: data.data.label
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: data.data.num,
                    type: 'bar',
                    itemStyle: {
                      normal: {
                        color: function (params) {
                          let colorList = ['#17B3A3', '#17B3A3', '#17B3A3', '#17B3A3', '#17B3A3', '#17B3A3', '#17B3A3', '#17B3A3', '#17B3A3']
                          return colorList[params.dataIndex]
                        }
                      }
                    }
                }]
                
              }
               this.chartBar.setOption(option)
          } else {
            this.$message.error(data.msg)
          }
        }).catch(() => {})
        
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
