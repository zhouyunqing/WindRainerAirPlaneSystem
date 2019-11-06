<template>
  <div>
    <comfirm-delete :comfirmDeleteVisible="comfirmDeleteVisible" @closeComfirmDelete="closeComfirmDelete"></comfirm-delete>
    <el-dialog title="预警配置"
               :visible.sync="noticeVisible"
               width="30%"
               :before-close="handleClose"
               class="noticeDialog">
      <div class="content">
        <section class="config">
          <article class="name">
            <div class="name_font">名称</div>
            <el-input v-model="name"
                      placeholder="在这里填写报警名称"></el-input>
          </article>
          <article class="address">
            <div class="name_font">预警地点</div>
            <el-select class="address_select"
                       v-model="site"
                       placeholder="请选择">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </article>
          <article class="status">
            <div class="name_font">状态</div>
            <div class="status_body">
              <el-switch v-model="status"
                         active-color="#13ce66">
              </el-switch>
              <span v-if="status"
                    class="status_font">开</span>
              <span v-else
                    class="status_font">关</span>
            </div>
          </article>
          <article class="conditions">
            <div class="conditions_header">
              <span class="name_font">预警条件</span>
              <el-select class="address_select"
                         v-model="conditionsLevel"
                         placeholder="请选择">
                <el-option v-for="item in conditionsOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"
                           >
                </el-option>
              </el-select>
            </div>
            <div class="conditions_body">
             
              <div class="list " v-for="(itemp,index) in conditionList" :key="index">
                <div>
                  <el-select class="wind_speed_width"
                             v-model="itemp.wind_speed"
                             placeholder="请选择">
                    <el-option v-for="item in wind_speed_options"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select class="compare_width"
                             v-model="itemp.compare"
                             placeholder="请选择">
                    <el-option v-for="item in compareOptions"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                  <el-input v-model="itemp.speed"></el-input>
                  <span class="speed_font">m/s</span>
                </div>
                <div>
                  <el-button @click="addCondition" v-show="index==conditionListLength-1">添加</el-button>
                  <el-button @click="deleteCondition(index)" v-show='index>0'>删除</el-button>
                </div>
              </div>
            </div>

            
          </article>
          <article class="note">
            <div class="name_font">备注</div>
            <textarea name=""
                      id=""
                      cols="30"
                      rows="10"
                      placeholder="在这里填写你想要的警报信息" v-model="remark"></textarea>
          </article>
          <article class="notice">
            <div class="name_font">预警通知</div>
            <div class="notice_body">
              <span>将在预警发生前</span>
              <el-select class="compare_width"
                         v-model="minutes"
                         placeholder="请选择">
                <el-option v-for="item in minutesOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <span>小时</span>
              <el-select class="compare_width"
                         v-model="second"
                         placeholder="请选择">
                <el-option v-for="item in secondOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <span>分钟收到通知</span>
            </div>
          </article>
          <article class="sendMessage">
            <div class="name_font">发送信息到群组</div>
            <div class="sendMessage_body">
              
              <el-table :data="tableData"
                        style="width: 100%">
                <el-table-column prop="name"
                                 label="姓名">
                  <template slot-scope="scope">
                    
                    <i class="el-icon-user"></i><span class="table_font"
                          v-html="scope.row.name"></span>
                  </template>
                </el-table-column>
                <el-table-column label="邮件">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.email"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column label="短信">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.message"></el-checkbox>
                  </template>
                </el-table-column>
                
              </el-table>
            </div>
          </article>
        </section>
      </div>
      <footer class="footer">
        <el-button class="cancel">取消</el-button>
        <el-button class="save" @click="submit">保存</el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script>
import comfirmDelete from './comfirmDelete'
import {getRiskServerity,getRunwayHistoryData,getGroupList,createRiskConfig} from '../../api/alert.js'
export default {

  name: 'noticeDialog',
  components: {
    comfirmDelete
  },
  data () {
    return {
      remark:'',
      comfirmDeleteVisible: false,
      name: '',
      site: 'ZBAA',
      conditionsLevel: 1,
      options: [
        {
          label: 'ZBAA',
          value: 'ZBAA'
        }
      ],
      status: true,
      conditionsOptions: [],
      compareOptions: [
        {
          label: '大于',
          value: 1
        },
        {
          label: '小于',
          value: 2
        }
      ],
      compare: 1,
      wind_speed_options: [],
      wind_speed: 1,
      speed: 0,
      minutes: 0,
      second: 0,
      secondOptions: [],
      minutesOptions: [],
      tableData: [],
      conditionList: [],
      conditionListLength:0,
      show:false
    }
  },
  mounted(){
    this.initBaseData()
  },
  methods: {
    handleClose (done) {
      this.$emit('closeAddNotice')
    },
    comfirmDeleteOpen(){
      this.comfirmDeleteVisible = true
    },
    closeComfirmDelete(){
      this.comfirmDeleteVisible = false
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
        this.tableData=[]
        for(var id in rs['data']['data']){
         
          this.tableData.push({
            name: rs['data']['data'][id].name,
            email: false,
            message: false,
            id:rs['data']['data'][id].id
          })
        }
      })
      
    },
    submitCreateRiskConfig(data){
      createRiskConfig(data).then(rs=>{
        console.log(rs)
        this.$emit('save')
        this.handleClose()
      })
    },
    addCondition(){
      if(this.wind_speed_options.length>0){
        this.conditionList.push({
          wind_speed:this.wind_speed_options[0].value,
          compare:1,
          speed:0
        })
        this.conditionListLength=this.conditionList.length
      }
    },
    deleteCondition(index){
      this.conditionList.splice(index,1)
      this.conditionListLength=this.conditionList.length
      
    }
    ,initBaseData(){
      this.minutesOptions=[]
      for(var i=0;i<24;i++){
        this.minutesOptions.push({value:i,label:i})
      }
      
      this.secondOptions=[]
      for(var i=0;i<60;i++){
        this.secondOptions.push({value:i,label:i})
      }
      this.RiskServerity()
      this.RunwayHistoryData()
      this.GroupList()

      
    }
    ,submit(){
      let queryitems=""
      let noticemails=""
      let noticephones=""
      console.log(this.conditionList);
      for(let index in this.conditionList){
        if(queryitems!=""){
          queryitems += ','
        }
        queryitems += this.conditionList[index]['wind_speed']+','+(this.conditionList[index].compare==1?'>':'<')+','+this.conditionList[index].speed
      }

      for(let index in this.tableData){
        if(this.tableData[index].email){
          noticemails +=(noticemails=="")?this.tableData[index].id:','+this.tableData[index].id
        }
        if(this.tableData[index].message){
          noticephones +=(noticephones=="")?this.tableData[index].id:','+this.tableData[index].id
        }
      }

      let submitItem={
        name:this.name,
        site:this.site,
        remark:this.remark,
        severity:this.conditionsLevel,
        source:"runwayHistoryData",
        timespan:"2880000",
        queryitems:queryitems,
        prenoticehour:this.minutes,
        prenoticemin:this.second,
        noticemails:noticemails,
        noticephones:noticephones
      }
      console.log(JSON.stringify(submitItem));
      this.submitCreateRiskConfig(submitItem)

    }
  },
  props: {
    noticeVisible: {
      default: false,
      type: Boolean
    }
  }
}
</script>
<style lang="scss" scoped>
.noticeDialog {
  /deep/.el-dialog {
    background: #2e2b47;
    width: 66.6% !important;
    padding: 0;
    text-align: left;
    height: 71vh;
  }
  /deep/.el-dialog__header {
    text-align: left;
    padding: 16px 20px;
    .el-dialog__title {
      font-size: 32px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 45px;
    }
  }
  /deep/.el-dialog__body {
    padding: 0;
  }
  .name_font {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(221, 221, 221, 1);
    line-height: 28px;
  }
  .content {
    padding: 16px 20px;
    height: 50vh;
    overflow: auto;
    .config {
      .name {
        margin-top: 50px;
        /deep/.el-input__inner {
          margin-top: 11px;
          background-color: #242236;
          color: #888888;
          font-size: 12px;
          border-radius: 4px;
          border: 1px solid rgba(68, 68, 68, 1);
        }
        /deep/.el-input__inner::-webkit-input-placeholder {
          color: #666666;
        }
      }
      .address {
        margin-top: 40px;
        .address_select {
          width: 90px;
          height: 40px;
          margin-top: 11px;
        }
        /deep/.el-input__inner {
          background-color: #3b3757;
          border: none;
        }
      }
      .status {
        margin-top: 40px;
        .status_font {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
        }
        .status_body {
          margin-top: 11px;
        }
      }
      .conditions {
        .list {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .clear_margin {
          margin-bottom: 0px;
        }
        margin-top: 40px;
        /deep/.el-input__inner {
          background-color: #3b3757;
          border: none;
        }
        .conditions_header {
          display: flex;
          justify-content: space-between;
        }
        .conditions_body {
          background: #232038;
          padding: 16px;
          margin-top: 5px;
          .wind_speed_width {
            width: 152px;
            height: 40px;
            /deep/.el-input__inner {
              color: #ffffff;
            }
          }
          .compare_width {
            width: 96px;
            height: 40px;
            /deep/.el-input__inner {
              color: #ffffff;
            }
          }
          .el-input {
            width: 56px;
            /deep/.el-input__inner {
              background-color: #232038;
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: rgba(255, 255, 255, 1);
              line-height: 20px;
              border: 1px solid rgba(68, 68, 68, 1);
            }
          }
          .speed_font {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
          }
          .el-button {
            background: rgba(59, 55, 87, 1);
            border: none;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
            height: 40px;
          }
        }
      }
      .note {
        margin-top: 40px;
        textarea {
          width: 100%;
          height: 128px;
          margin-top: 11px;
          background: rgba(35, 32, 56, 1);
          border-radius: 4px;
          border: 1px solid rgba(68, 68, 68, 1);
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
        }
        textarea::-webkit-input-placeholder {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
        }
      }
      .notice {
        margin-top: 40px;
        .notice_body {
          margin-top: 16px;
          background: #232038;
          padding: 26px 16px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(221, 221, 221, 1);
          line-height: 20px;
          /deep/.el-input__inner {
            background-color: #3b3757;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
            width: 64px;
            border: none;
          }
        }
      }
      .sendMessage {
        margin-top: 40px;
        .sendMessage_body {
          margin-top: 11px;
          background: #232038;
          /deep/.el-table th,
          /deep/.el-table tr {
            background-color: #242236;
          }
          /deep/.el-table th {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #686868;
            line-height: 20px;
          }

          /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: #242236 !important;
          }
          /deep/.el-table th:nth-child(2) {
            text-align: center;
          }
          /deep/.el-table__body td:nth-child(2) {
            text-align: center;
          }
          /deep/.el-table th:nth-child(3) {
            text-align: right;
          }
          /deep/.el-table__body td:nth-child(3) {
            text-align: right;
          }
          .table_font {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
          }
        }
      }
    }
  }
  .footer {
    padding-top: 2.5rem;
    text-align: right;
    padding-right: 20px;
    .save {
      background: #05892a;
    }
    .cancel {
      background: #736ef7;
    }
    .el-button {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      border: none;
      width: 96px;
      height: 40px;
    }
  }
}
</style>