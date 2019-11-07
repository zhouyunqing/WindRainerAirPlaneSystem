<template>
  <div class="forecast">
    <notice-dialog :noticeVisible='noticeVisible' :riskTypeId='riskTypeId' @save="RiskConfigList"
                   @closeAddNotice="closeAddNotice"></notice-dialog>
    <h1 class="title-font">预警</h1>
    <el-menu :default-active="activeIndex"
             class="el-menu-demo"
             mode="horizontal"
             @select="handleSelect">
      <el-menu-item index="notice">预警通知</el-menu-item>
      <el-menu-item index="config">预警配置</el-menu-item>
    </el-menu>
    <div class="notice"
         v-if="activeIndex=='notice'">
      <div class="notice-header">
        <el-input placeholder="搜索预警"
                  prefix-icon="el-icon-search"
                  v-model="input">
        </el-input>
        <!-- <el-button class="input-right"
                   icon="el-icon-plus"
                   @click="addNotice(-1)">
          添加新预警
        </el-button> -->
      </div>
      <div class="notice-table">
        <el-table ref="singleTable"
                  :data="tableData"
                  @current-change="handleCurrentChange"
                  style="width: 100%">
          <el-table-column property="name"
                           label="名称"
                           :width="noticeWidth">
          </el-table-column>
          <el-table-column property="site"
                           label="地点"
                           :width="noticeWidth">
          </el-table-column>
          <el-table-column property="dealuser"
                           :width="noticeWidth"
                           label="发件人">
          </el-table-column>
          <el-table-column property="severity"
                           :width="noticeWidth"
                           label="预警级别">
          </el-table-column>
          <el-table-column property="status"
                           :width="noticeWidth"
                           label="执行情况">
          </el-table-column>
          <el-table-column class="button-right"
                           property="status"
                           label="">
            <el-button>删除</el-button>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="notice"
         v-if="activeIndex=='config'">
      <div class="notice-header">
        <el-input placeholder="搜索预警"
                  prefix-icon="el-icon-search"
                  v-model="input">
        </el-input>
        <el-button class="input-right"
                   icon="el-icon-plus"
                   @click="(addNotice(-1))">
          添加新预警
        </el-button>
      </div>
      <div class="notice-table">
        <el-table ref="singleTable"
                  :data="tableDataConfig"
                  @current-change="handleCurrentChange"
                  style="width: 100%">
          <el-table-column property="name"
                           label="名称"
                           :width="configWidth">
          </el-table-column>
          <el-table-column property="site"
                           label="地点"
                           :width="configWidth">
          </el-table-column>
          <el-table-column property="creater"
                           :width="configWidth"
                           label="收件人">
          </el-table-column>
          <el-table-column :width="configWidth"
                           label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isactive"
                         active-color="#48FF47"  disabled >
              </el-switch>
              <span v-if="scope.row.isactive">开启</span>
              <span v-else>关闭</span>
            </template>

          </el-table-column>
          <el-table-column class="button-right"
                           property="status"
                           label="">
            <template slot-scope="scope">
              <el-button @click="addNotice(scope.row.id)">修改</el-button>
              <el-button @click="deleteRiskConfigItem(scope.row.id)">删除</el-button>
            </template>
            
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
import noticeDialog from './noticeDialog'
import {getRiskConfigList,deleteRiskConfig,getRiskInfoes,getRiskServerity,getRunwayHistoryData,getGroupList,getRiskConfig} from '../../api/alert.js'
import { constants } from 'fs';
export default {
  name: 'forecast',
  data () {
    return {
      noticeVisible: false,
      riskTypeId:{},
      value: true,
      activeIndex: 'notice',
      noticeWidth: 190,
      configWidth: 220,
      input: '',
      tableDataConfig: [],
      tableData: [],
      runwayHistoryData:[],
      riskServerity:[],
      conditionsOptions:[],
      wind_speed_options:[],
      groupList:[]
      
    }
  },
  components: {
    noticeDialog
  },
  methods: {
    handleSelect (key, keyPath) {
      this.activeIndex = key
    },
    handleCurrentChange (val) {
      this.currentRow = val;
    },
    addNotice (id) {
      this.initRiskTypeId(id)
      this.noticeVisible = true
    },
    closeAddNotice () {
      this.noticeVisible = false
    },
    riskinfoList(){
      getRiskInfoes().then(rs=>{
         console.log(rs['data']);
          this.tableData=[]
        for(var id in rs['data']['pagedList']){
          var item={
            id:rs['data']['pagedList'][id].id,
            name:rs['data']['pagedList'][id].name,
            site:'ZABB',
            dealuser:rs['data']['pagedList'][id].dealuser,
            severity:rs['data']['pagedList'][id].severity,
            state:rs['data']['pagedList'][id].state
          }
          this.tableData.push(item)
          console.log(item)
        }
      })
    },
    RiskConfigList(){
    
      getRiskConfigList().then(rs=>{
        // console.log(rs['data']);
        this.tableDataConfig=[]
        for(var id in rs['data']['data']){
          var item={
            id:rs['data']['data'][id].id,
            name:rs['data']['data'][id].name,
            site:'ZBAA',
            creater:rs['data']['data'][id].noticemails,
            isactive:rs['data']['data'][id].isactive
          }
          this.tableDataConfig.push(item)
          console.log(item)
        }
        
      })
    }
    ,RiskServerity(){
       getRiskServerity().then(rs=>{
        this.conditionsOptions=[];
        if(rs['data']['data'].length>0){
          this.conditionsLevel=rs['data']['data'][0].value
        }
        for(var id in rs['data']['data']){
          this.conditionsOptions.push({
             value:rs['data']['data'][id].key,
             label:rs['data']['data'][id].value
             })
        }
      })
    }
    ,RunwayHistoryData(){
      var that=this
      getRunwayHistoryData().then(rs=>{
        this.wind_speed_options=[];
        if(rs['data']['data'].length>0){
          this.wind_speed=rs['data']['data'][0].key;
        }
        for(var id in rs['data']['data']){
         
          this.wind_speed_options.push({
             value:rs['data']['data'][id].key,
             label:rs['data']['data'][id].value
             })
        }
        this.addCondition()
        
      })
    }
    ,GroupList(){
      getGroupList().then(rs=>{
        this.groupList=[]
        for(var id in rs['data']['data']){
         
          this.groupList.push({
            name: rs['data']['data'][id].name,
            id:rs['data']['data'][id].id
          })
        }
      })
      
    },
    deleteRiskConfigItem(id){
      console.log('deleteRiskConfigid='+id)
      console.log(id)
      if(id!='undefined'){
        deleteRiskConfig({id:id}).then(rs=>{
          console.log(rs)
          this.RiskConfigList()
        })

      }
    },
    riskServerityFun(){
      getRiskServerity().then(rs=>{
        this.conditionsOptions=[];
        if(rs['data']['data'].length>0){
          this.conditionsLevel=rs['data']['data'][0].value
        }
        for(var id in rs['data']['data']){
          this.conditionsOptions.push({
             value:rs['data']['data'][id].key,
             label:rs['data']['data'][id].value
             })
        }
      })
    },
    RunwayHistoryData(){
      var that=this
      getRunwayHistoryData().then(rs=>{
        this.wind_speed_options=[];
        if(rs['data']['data'].length>0){
          this.wind_speed=rs['data']['data'][0].key;
        }
        for(var id in rs['data']['data']){
         
          this.wind_speed_options.push({
             value:rs['data']['data'][id].key,
             label:rs['data']['data'][id].value
             })
        }
      
      })
    },
    initRiskTypeId(id){
      //init item
      let conditionList=[]
      conditionList.push({
          wind_speed:this.wind_speed_options[0].value,
          compare:1,
          speed:0
      })
      
      let groupItems=[]
      for(var item in this.groupList){
        groupItems.push({
              name: this.groupList[item].name,
              email: false,
              message: false,
              id:this.groupList[item].id,
            })

      }

      this.riskTypeId={
        name:'',
        site:'ZABB',
        status:true,
        conditionsLevel:1,
        conditionList:conditionList,
        remark:'',
        minutes:0,
        second:0,
        tableData:groupItems,
        conditionListLength:conditionList.length,
        wind_speed_options: this.wind_speed_options,
        id:-1
      }
      if(id>-1){
        getRiskConfig(id).then(rs=>{
          console.log(rs);

          var data=rs['data']['data']
          if(data.queryitems.length>0){            
            var t=data.queryitems.split(",")
            conditionList=[]
            for(var len=t.length,i=0;i<len/3;i++){
              conditionList.push({
                  wind_speed:t[i*3],
                  compare:(t[i*3+1]=='>'?1:2),
                  speed:t[i*3+2]
              })
            }
          }

          if(data.noticemails.length>0){
            var t=data.noticemails.split(',');
            for(var len=t.length,i=0;i<len;i++){
              let groupItem = groupItems.find(function(x) {
                return x.id == t[i];
              })
              groupItem.email=true
            }
          }

          if(data.noticephones.length>0){
            var t=data.noticephones.split(',');
            for(var len=t.length,i=0;i<len;i++){
              let groupItem = groupItems.find(function(x) {
                return x.id == t[i];
              })
              groupItem.message=true
            }
          }

          this.riskTypeId.name=data.name
          this.riskTypeId.state=data.isactive
          this.riskTypeId.conditionsLevel=data.severity
          this.riskTypeId.conditionList=conditionList
          this.riskTypeId.remark=data.remark
          this.riskTypeId.minutes=data.prenoticehour
          this.riskTypeId.second=data.prenoticemin
          this.riskTypeId.tableData=groupItems
          this.riskTypeId.conditionListLength=conditionList.length
          this.riskTypeId.id=data.id
          
        })
      }
      
    }
    
  },
  mounted () {
    this.RunwayHistoryData()
    this.RiskConfigList()
    this.GroupList()
    this.riskinfoList()
    //预警通知 暂时注释下一步实现
    // this.$notify({
    //   title: '1个新的预警',
    //   message:
    //     `<div class="tips">
    //     <div class= "wind_forecast" >
    //       <div class="wind_forecast_tittle">大风预警</div>
    //       <div class="wind_forecast_body">
    //         <div>ZBAA</div>
    //         <div>1小时前</div>
    //       </div>
    //     </div>
    //     <div class="happen_time">
    //       <div class="happen_time_tittle">发生时间</div>
    //       <div class="happen_time_body">
    //         <span>10:20</span>
    //         <span>2019.09.20</span>
    //       </div>
    //     </div>
    //     <div class="happen_time">
    //       <div class="happen_time_tittle">预警规则</div>
    //       <div class="happen_time_body">
    //         <div>头风分量 大于5m/s</div>
    //         <div>侧风分量 大于3m/s</div>
    //       </div>
    //     </div>
    //     <div class="happen_time">
    //       <div class="happen_time_tittle">备注规则</div>
    //       <div class="happen_time_body">
    //         大风预警
    //       </div>
    //     </div>
    // </div > `,
    //   duration: 0,
    //   dangerouslyUseHTMLString: true,
    //   position: 'bottom-right'
    // })
  }
}
</script>
<style lang="scss" scoped>
.forecast {
  background: #242236;
  height: 100vh;
  padding: 31px 58px 0px 58px;
  .title-font {
    font-size: 32px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 45px;
    margin: 0;
    text-align: left;
  }
  .el-menu {
    background: #242236;
  }
  .el-menu.el-menu--horizontal {
    bottom: none;
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 1px solid #05892a;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
  }
  .el-menu-item:focus,
  .el-menu-item:hover {
    outline: 0;
    background: #242236;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: solid 1px rgba(255, 255, 255, 0.2);
  }
  .notice {
    .notice-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-top: 28px;
      .el-input {
        width: 370px;
        height: 40px;
        /deep/.el-input__inner {
          background-color: #242236;
          color: #888888;
          font-size: 12px;
          border-radius: 4px;
          border: 1px solid rgba(68, 68, 68, 1);
        }
      }
      .el-button {
        background-color: #242236;
        color: #888888;
        font-size: 12px;
      }
    }
    .notice-table {
      margin-top: 37px;
      /deep/.el-table th,
      /deep/.el-table tr {
        background-color: #242236;
      }
      .el-table th {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(136, 136, 136, 1);
        line-height: 20px;
      }
      /deep/.el-table td {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
      }
      /deep/.el-table__row {
        td:last-child {
          text-align: right;
        }
      }
      /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #242236 !important;
      }
      .el-button {
        background: rgba(59, 55, 87, 1);
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
      }
    }
  }
}
</style>
