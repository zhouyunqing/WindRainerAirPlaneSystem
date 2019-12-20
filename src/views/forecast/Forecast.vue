<template>
  <div class="forecast">
    <notice-dialog
      :notice-visible="noticeVisible"
      :risk-type-id="riskTypeId"
      @save="RiskConfigList"
      @closeAddNotice="closeAddNotice"
    />
    <delete-tip
      :type="type"
      :tipInformation="tipInformation"
      :delete-tip-visible="deleteTipVisible"
      @deleteTipClose="deleteTipClose"
      @deleteTipDelete="deleteTipDelete"
      @deleteNotice="deleteNotice"
    />
    <h1 class="title-font">预警</h1>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="notice">预警通知</el-menu-item>
      <el-menu-item index="config">预警配置</el-menu-item>
    </el-menu>
    <div v-if="activeIndex=='notice'" class="notice">
      <div class="notice-header">
        <el-input v-model="input" placeholder="搜索预警" prefix-icon="el-icon-search" />
        <!-- <el-button class="input-right"
                   icon="el-icon-plus"
                   @click="addNotice(-1)">
          添加新预警
        </el-button>-->
      </div>
      <div class="notice-table">
        <el-table :data="tableData" style="width: 100%" @current-change="handleCurrentChange">
          <el-table-column :key="Math.random()" property="name" label="名称" />
          <el-table-column :key="Math.random()" property="site" label="地点" />
          <el-table-column :key="Math.random()" property="createtime" label="记录时间" />
          <el-table-column :key="Math.random()" label="预警级别">
            <template slot-scope="scope">
              <span
                :class="scope.row.severity=='一般'?'normal_color':scope.row.severity=='紧急'?'emergency_color':'danger_color'"
              >{{ scope.row.severity }}</span>
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" :width="80" label="执行情况">
            <template slot-scope="scope">
              <span
                :class="scope.row.state=='已处理'?'normal_color':'emergency_color'"
              >{{ scope.row.state }}</span>
            </template>
          </el-table-column>

          <el-table-column class="button-right" :width="160" label :key="Math.random()">
            <template slot-scope="scope">
              <el-button @click="deleteNoticeShow(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="riskInfoPage.total"
          :page.sync="riskInfoPage.listQuery.page"
          :limit.sync="riskInfoPage.listQuery.limit"
          @pagination="riskinfoList"
        />
      </div>
    </div>

    <div v-if="activeIndex=='config'" class="notice">
      <div class="notice-header">
        <el-input v-model="input" placeholder="搜索预警" prefix-icon="el-icon-search" />
        <el-button class="input-right" icon="el-icon-plus" @click="(addNotice(-1))">添加新预警</el-button>
      </div>
      <div class="notice-table">
        <el-table :data="tableDataConfig" style="width: 100%" @current-change="handleCurrentChange">
          <el-table-column :key="Math.random()" property="name" label="名称" :width="configWidth" />
          <el-table-column :key="Math.random()" property="site" label="地点" :width="configWidth" />
          <el-table-column
            :key="Math.random()"
            property="creater"
            :width="configWidth"
            label="收件人"
          />
          <el-table-column :key="Math.random()" :width="configWidth" label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isactive" active-color="#48FF47" disabled />
              <span v-if="scope.row.isactive">开启</span>
              <span v-else>关闭</span>
            </template>
          </el-table-column>
          <el-table-column :key="Math.random()" class="button-right" property="status" label>
            <template slot-scope="scope">
              <el-button @click="addNotice(scope.row.id)">修改</el-button>
              <el-button @click="deletebtn(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :total="riskConfigPage.total"
          :page.sync="riskConfigPage.listQuery.page"
          :limit.sync="riskConfigPage.listQuery.limit"
          @pagination="RiskConfigList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import noticeDialog from "./noticeDialog";
import deleteTip from "./deleteTip";
import {
  getOptions,
  getRiskConfigList,
  deleteRiskConfig,
  getRiskInfoes,
  getGroupList,
  getRiskConfig,
  timestampToTime,
  updateRiskInfo
} from "../../api/alert.js";
import { constants } from "fs";
export default {
  name: "Forecast",
  components: {
    noticeDialog,
    Pagination,
    deleteTip
  },
  data() {
    return {
      type: 1,
      tipInformation: "",
      deleteId: "",
      deleteTipVisible: false,
      // 分页控制
      riskInfoPage: {
        total: 0,
        listQuery: {
          page: 1,
          limit: 5
        }
      },
      riskConfigPage: {
        total: 0,
        listQuery: {
          page: 1,
          limit: 5
        }
      },

      noticeVisible: false,
      riskTypeId: {},
      value: true,
      activeIndex: "notice",
      noticeWidth: 190,
      configWidth: 220,
      input: "",
      tableDataConfig: [],
      tableData: [],
      runwayHistoryData: [],
      riskServerity: [],
      wind_speed_options: [],
      groupList: [],
      allGroupList: [],
      riskStateDic: []
    };
  },
  beforeMount() {
    this.RunwayHistoryData();
    this.GroupList();
    this.RiskServerity();
    this.getRiskStateDic();
  },
  mounted() {
    this.RiskConfigList();
    this.riskinfoList();
    // 预警通知 暂时注释下一步实现
    this.popWindow();
  },
  methods: {
    deleteNoticeShow(id){
      this.deleteId = id;
      this.deleteTipVisible = true;
      this.type = 2
      this.tipInformation =
        "执行此操作将会删除预警通知信息，您确定要继续删除吗？";
    },
    deleteNotice(){
        updateRiskInfo({ id: this.deleteId,state: 0 }).then(rs => {
          console.log(rs);
          this.riskinfoList();
          this.deleteTipVisible = false;
        });
    },
    deletebtn(id) {
      this.deleteId = id;
      this.deleteTipVisible = true;
      this.type = 1
      this.tipInformation =
        "执行此操作将会删除预警配置信息，您确定要继续删除吗？";
    },
    deleteTipClose() {
      this.deleteTipVisible = false;
    },
    deleteTipDelete() {
      this.deleteRiskConfigItem(this.deleteId);
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    addNotice(id) {
      this.initRiskTypeId(id);
      this.noticeVisible = true;
    },
    closeAddNotice() {
      this.noticeVisible = false;
    },
    riskinfoList() {
      // params={
      //   configId:-1,
      //   isActive:-1,
      //   pageSize:10,
      //   skipped:0,
      //   state:-1
      // }

      const params = {
        configId: -1,
        isActive: -1,
        state: -1,
        pageSize: this.riskInfoPage.listQuery.limit,
        skipped: 0
      };
      if (this.riskInfoPage.total > 0) {
        params.skipped =
          (this.riskInfoPage.listQuery.page - 1) *
          this.riskInfoPage.listQuery.limit;
      }
      getRiskInfoes(params).then(rs => {
        console.log(rs);
        this.tableData = [];
        this.riskInfoPage.total = rs["data"].totalSize;
        for (const id in rs["data"]["pagedList"]) {
          const severity = this.findObjByKey(
            this.riskServerity,
            rs["data"]["pagedList"][id].severity
          );
          const riskstate = this.findObjByKey(
            this.riskStateDic,
            rs["data"]["pagedList"][id].state
          );
          const item = {
            id: rs["data"]["pagedList"][id].id,
            name: rs["data"]["pagedList"][id].name,
            site: "ZABB",
            createtime: timestampToTime(
              rs["data"]["pagedList"][id].createtime / 1000
            ),
            severityId: rs["data"]["pagedList"][id].severity,
            severity:
              typeof severity === "undefined"
                ? this.riskServerity[0].value
                : severity.value,
            stateId: rs["data"]["pagedList"][id].state,
            state:
              typeof riskstate === "undefined"
                ? this.riskStateDic[0].value
                : riskstate.value
          };
          this.tableData.push(item);
        }
      });
    },
    RiskConfigList() {
      const params = {
        isActive: -1,
        pageSize: this.riskConfigPage.listQuery.limit,
        skipped: 0
      };
      if (this.riskConfigPage.total > 0) {
        params.skipped =
          (this.riskConfigPage.listQuery.page - 1) *
          this.riskConfigPage.listQuery.limit;
      }

      getRiskConfigList(params).then(rs => {
        this.riskConfigPage.total = rs["data"].totalSize;
        this.tableDataConfig = [];

        for (const id in rs["data"]["data"]) {
          let noticemails = "";
          const t = rs["data"]["data"][id].noticemails.split(",");
          if (rs["data"]["data"][id].noticemails != "") {
            for (let i = 0; i < t.length; i++) {
              const obj = this.allGroupList.find(function(x) {
                return x.id == t[i];
              });

              if (!!obj && !!obj.name && obj.name.length > 0) {
                if (noticemails.length > 0) {
                  noticemails += ",";
                }
                noticemails += obj.name;
              }
            }
          }

          const item = {
            id: rs["data"]["data"][id].id,
            name: rs["data"]["data"][id].name,
            site: rs["data"]["data"][id].site,
            creater: noticemails,
            isactive: rs["data"]["data"][id].isactive
          };
          this.tableDataConfig.push(item);
          // console.log(item)
        }
      });
    },
    RiskServerity() {
      getOptions({ catagory: "RiskServerity" }).then(rs => {
        this.riskServerity = [];
        if (rs["data"]["data"].length > 0) {
          this.conditionsLevel = rs["data"]["data"][0].value;
        }
        for (const id in rs["data"]["data"]) {
          this.riskServerity.push({
            key: rs["data"]["data"][id].key,
            value: rs["data"]["data"][id].value
          });
        }
      });
    },
    RunwayHistoryData() {
      const that = this;
      getOptions({ catagory: "runwayHistoryData" }).then(rs => {
        this.wind_speed_options = [];
        if (rs["data"]["data"].length > 0) {
          this.wind_speed = rs["data"]["data"][0].key;
        }
        for (const id in rs["data"]["data"]) {
          this.wind_speed_options.push({
            value: rs["data"]["data"][id].key,
            label: rs["data"]["data"][id].value
          });
        }
      });
    },
    getRiskStateDic() {
      const that = this;
      getOptions({ catagory: "RiskState" }).then(rs => {
        this.riskStatDic = [];
        for (const id in rs["data"]["data"]) {
          this.riskStateDic.push({
            key: rs["data"]["data"][id].key,
            value: rs["data"]["data"][id].value
          });
        }
      });
    },
    GroupList() {
      this.allGroupList = [];
      this.groupList = [];
      getGroupList({ isActive: 1 }).then(rs => {
        for (const id in rs["data"]["data"]) {
          this.groupList.push({
            name: rs["data"]["data"][id].name,
            id: rs["data"]["data"][id].id
          });

          this.allGroupList.push({
            name: rs["data"]["data"][id].name,
            id: rs["data"]["data"][id].id
          });
        }
      });

      getGroupList({ isActive: 0 }).then(rs => {
        for (const id in rs["data"]["data"]) {
          this.allGroupList.push({
            name: rs["data"]["data"][id].name,
            id: rs["data"]["data"][id].id
          });
        }
      });
    },
    deleteRiskConfigItem(id) {
      console.log("deleteRiskConfigid=" + id);
      if (id != "undefined") {
        deleteRiskConfig({ id: id }).then(rs => {
          console.log(rs);
          this.RiskConfigList();
          this.deleteTipVisible = false;
        });
      }
    },
    initRiskTypeId(id) {
      // init item
      let conditionList = [];
      conditionList.push({
        wind_speed: this.wind_speed_options[0].value,
        compare: 1,
        speed: 0
      });

      const groupItems = [];
      for (const item in this.groupList) {
        groupItems.push({
          name: this.groupList[item].name,
          email: false,
          message: false,
          id: this.groupList[item].id
        });
      }

      this.riskTypeId = {
        name: "",
        site: "ZABB",
        status: true,
        conditionsLevel: this.riskServerity[0].key,
        conditionList: conditionList,
        remark: "",
        minutes: 0,
        second: 0,
        tableData: groupItems,
        conditionListLength: conditionList.length,
        wind_speed_options: this.wind_speed_options,
        id: -1,
        conditionsOptions: this.riskServerity
      };
      if (id > -1) {
        getRiskConfig(id).then(rs => {
          console.log(rs);

          const data = rs["data"]["data"];
          if (data.queryitems.length > 0) {
            const t = data.queryitems.split(",");
            conditionList = [];
            for (let len = t.length, i = 0; i < len / 3; i++) {
              conditionList.push({
                wind_speed: t[i * 3],
                compare: t[i * 3 + 1] == ">" ? 1 : 2,
                speed: t[i * 3 + 2]
              });
            }
          }

          if (data.noticemails.length > 0) {
            const t = data.noticemails.split(",");
            for (let len = t.length, i = 0; i < len; i++) {
              const groupItem = groupItems.find(function(x) {
                return x.id == t[i];
              });
              groupItem.email = true;
            }
          }

          if (data.noticephones.length > 0) {
            const t = data.noticephones.split(",");
            for (let len = t.length, i = 0; i < len; i++) {
              const groupItem = groupItems.find(function(x) {
                return x.id == t[i];
              });
              groupItem.message = true;
            }
          }

          this.riskTypeId.name = data.name;
          this.riskTypeId.state = data.isactive;
          this.riskTypeId.conditionsLevel = data.severity;
          this.riskTypeId.conditionList = conditionList;
          this.riskTypeId.remark = data.remark;
          this.riskTypeId.minutes = data.prenoticehour;
          this.riskTypeId.second = data.prenoticemin;
          this.riskTypeId.tableData = groupItems;
          this.riskTypeId.conditionListLength = conditionList.length;
          this.riskTypeId.id = data.id;
        });
      }
    },

    findObjByKey(objs, key) {
      return objs.find(function(x) {
        return x.key == key;
      });
    },

    popWindow() {
      this.$notify({
        title: "1个新的预警",
        message: `<div class="tips">
                <div class= "wind_forecast" >
                  <div class="wind_forecast_tittle">大风预警</div>
                  <div class="wind_forecast_body">
                    <div>ZBAA</div>
                    <div>1小时前</div>
                  </div>
                </div>
                <div class="happen_time">
                  <div class="happen_time_tittle">发生时间</div>
                  <div class="happen_time_body">
                    <span>10:20</span>
                    <span>2019.09.20</span>
                  </div>
                </div>
                <div class="happen_time">
                  <div class="happen_time_tittle">预警规则</div>
                  <div class="happen_time_body">
                    <div>头风分量 大于5m/s</div>
                    <div>侧风分量 大于3m/s</div>
                  </div>
                </div>
                <div class="happen_time">
                  <div class="happen_time_tittle">备注规则</div>
                  <div class="happen_time_body">
                    大风预警
                  </div>
                </div>
            </div > `,
        duration: 0,
        dangerouslyUseHTMLString: true,
        position: "bottom-right"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.forecast {
  background: #242236;
  height: 100vh;
  padding: 0.31rem 0.58rem 0rem 0.58rem;
  .title-font {
    font-size: 0.32rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 0.45rem;
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
    font-size: 0.14rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 0.2rem;
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
      padding-top: 0.28rem;
      .el-input {
        width: 3.7rem;
        height: 0.4rem;
        /deep/.el-input__inner {
          background-color: #242236;
          color: #888888;
          font-size: 0.12rem;
          border-radius: 0.04rem;
          border: 1px solid rgba(68, 68, 68, 1);
        }
      }
      .el-button {
        background-color: #242236;
        color: #888888;
        font-size: 0.12rem;
      }
    }
    .notice-table {
      margin-top: 0.37rem;
      /deep/.el-table th,
      /deep/.el-table tr {
        border-bottom: 1px solid #ffffff66;
        background-color: #242236;
        &:last-child {
          border-bottom: 1px solid #ffffff33;
        }
      }
      /deep/.el-table .cell {
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      /deep/.el-table td {
        border-bottom: 1px solid #ffffff33;
      }
      .el-table::before {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0px;
      }
      .el-table th {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(136, 136, 136, 1);
        line-height: 0.2rem;
      }
      /deep/.el-table td {
        font-size: 0.14rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 0.2rem;
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
        font-size: 0.14rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 0.2rem;
      }

      .pagination-container {
        background-color: #242236;
      }
      .normal_color {
        color: #48ff47ff;
      }
      .emergency_color {
        color: #ffbe3aff;
      }
      .danger_color {
        color: #d92d39ff;
      }
    }
  }
}
</style>
