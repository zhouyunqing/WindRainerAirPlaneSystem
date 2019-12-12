<template>
  <div>
    <comfirm-delete
      :comfirm-delete-visible="comfirmDeleteVisible"
      @closeComfirmDelete="closeComfirmDelete"
      @comfirmDelete="comfirmDelete"
    />
    <el-dialog
      title="预警配置"
      :visible.sync="noticeVisible"
      width="30%"
      :before-close="handleClose"
      class="noticeDialog"
    >
      <div class="content">
        <section class="config">
          <article class="name">
            <div class="name_font">名称</div>
            <el-input v-model="riskTypeId.name" placeholder="在这里填写报警名称" />
          </article>
          <article class="address">
            <div class="name_font">预警地点</div>
            <el-select
              v-model="riskTypeId.site"
              :popper-append-to-body="false"
              class="address_select"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </article>
          <article v-if="riskTypeId.id>0" class="status">
            <div class="name_font">状态</div>
            <div class="status_body">
              <el-switch v-model="riskTypeId.status" active-color="#13ce66" />
              <span v-if="riskTypeId.status" class="status_font">开</span>
              <span v-else class="status_font">关</span>
            </div>
          </article>
          <article class="conditions">
            <div class="conditions_header">
              <span class="name_font">预警条件</span>
              <el-select
                :popper-append-to-body="false"
                v-model="riskTypeId.conditionsLevel"
                class="address_select2"
                :class="riskTypeId.conditionsLevel==riskTypeId.conditionsOptions[0].key?'normal_color':riskTypeId.conditionsLevel==riskTypeId.conditionsOptions[1].key?'more_color':'danger_color'"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in riskTypeId.conditionsOptions"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </div>
            <div class="conditions_body">
              <div v-for="(itemp,index) in riskTypeId.conditionList" :key="index" class="list">
                <div>
                  <el-select v-model="itemp.wind_speed" class="wind_speed_width" placeholder="请选择">
                    <el-option
                      v-for="item in riskTypeId.wind_speed_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select v-model="itemp.compare" class="compare_width" placeholder="请选择">
                    <el-option
                      v-for="item in compareOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-input v-model="itemp.speed" />
                  <span class="speed_font">m/s</span>
                </div>
                <div>
                  <el-button
                    v-show="index==riskTypeId.conditionListLength-1"
                    @click="addCondition"
                  >添加</el-button>
                  <el-button v-show="index>0" @click="deleteCondition(index)">删除</el-button>
                </div>
              </div>
            </div>
          </article>
          <article class="note">
            <div class="name_font">备注</div>
            <textarea
              id
              v-model="riskTypeId.remark"
              name
              cols="30"
              rows="10"
              placeholder="在这里填写你想要的警报信息"
            />
          </article>
          <article class="notice">
            <div class="name_font">预警通知</div>
            <div class="notice_body">
              <span>将在预警发生前</span>
              <el-select v-model="riskTypeId.minutes" class="compare_width" placeholder="请选择">
                <el-option
                  v-for="item in minutesOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <span>小时</span>
              <el-select v-model="riskTypeId.second" class="compare_width" placeholder="请选择">
                <el-option
                  v-for="item in secondOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <span>分钟收到通知</span>
            </div>
          </article>
          <article class="sendMessage">
            <div class="name_font">发送信息到群组</div>
            <div class="sendMessage_body">
              <el-table :data="riskTypeId.tableData" style="width: 100%">
                <el-table-column prop="name" label="姓名">
                  <template slot-scope="scope">
                    <i class="el-icon-user" />
                    <span class="table_font" v-html="scope.row.name" />
                  </template>
                </el-table-column>
                <el-table-column label="邮件">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.email" />
                  </template>
                </el-table-column>
                <el-table-column label="短信">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.message" />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </article>
        </section>
      </div>
      <footer class="footer">
        <el-button class="cancel" @click="comfirmDeleteOpen">取消</el-button>
        <el-button class="save" @click="submit">保存</el-button>
      </footer>
    </el-dialog>
  </div>
</template>
<script>
import comfirmDelete from "./comfirmDelete";
import deleteTip from "./deleteTip";
import { createRiskConfig, updateRiskConfig } from "../../api/alert.js";
export default {
  name: "NoticeDialog",
  components: {
    comfirmDelete
  },
  props: {
    noticeVisible: {
      default: false,
      type: Boolean
    },
    riskTypeId: {
      default: -1,
      type: Object
    }
  },
  data() {
    return {
      comfirmDeleteVisible: false,
      options: [
        {
          label: "ZBAA",
          value: "ZBAA"
        }
      ],
      compareOptions: [
        {
          label: "大于",
          value: 1
        },
        {
          label: "小于",
          value: 2
        }
      ],
      secondOptions: [],
      minutesOptions: [],
      show: false
    };
  },
  mounted() {
    this.initBaseData();
  },
  methods: {

    handleClose(done) {
      this.$emit("closeAddNotice");
    },
    comfirmDeleteOpen() {
      this.comfirmDeleteVisible = true;
    },
    closeComfirmDelete() {
      this.comfirmDeleteVisible = false;
    },
    comfirmDelete() {
      this.closeComfirmDelete();
      this.handleClose();
    },
    submitCreateRiskConfig(data) {
      createRiskConfig(data).then(rs => {
        console.log(rs);
        this.$emit("save");
        this.handleClose();
      });
    },
    submitUpdateRiskConfig(data) {
      updateRiskConfig(data).then(rs => {
        console.log(rs);
        this.$emit("save");
        this.handleClose();
      });
    },
    addCondition() {
      if (this.riskTypeId.wind_speed_options.length > 0) {
        this.riskTypeId.conditionList.push({
          wind_speed: this.riskTypeId.wind_speed_options[0].value,
          compare: 1,
          speed: 0
        });
        this.riskTypeId.conditionListLength = this.riskTypeId.conditionList.length;
      }
    },
    deleteCondition(index) {
      this.riskTypeId.conditionList.splice(index, 1);
      this.riskTypeId.conditionListLength = this.conditionList.length;
    },
    initBaseData() {
      this.minutesOptions = [];
      for (var i = 0; i < 24; i++) {
        this.minutesOptions.push({ value: i, label: i });
      }

      this.secondOptions = [];
      for (var i = 0; i < 60; i++) {
        this.secondOptions.push({ value: i, label: i });
      }
    },
    submit() {
      let queryitems = "";
      let noticemails = "";
      let noticephones = "";

      for (const index in this.riskTypeId.conditionList) {
        if (queryitems != "") {
          queryitems += ",";
        }
        queryitems +=
          this.riskTypeId.conditionList[index]["wind_speed"] +
          "," +
          (this.riskTypeId.conditionList[index].compare == 1 ? ">" : "<") +
          "," +
          this.riskTypeId.conditionList[index].speed;
      }

      for (const index in this.riskTypeId.tableData) {
        if (this.riskTypeId.tableData[index].email) {
          noticemails +=
            noticemails == ""
              ? this.riskTypeId.tableData[index].id
              : "," + this.riskTypeId.tableData[index].id;
        }
        if (this.riskTypeId.tableData[index].message) {
          noticephones +=
            noticephones == ""
              ? this.riskTypeId.tableData[index].id
              : "," + this.riskTypeId.tableData[index].id;
        }
      }

      const submitItem = {
        name: this.riskTypeId.name,
        site: this.riskTypeId.site,
        remark: this.riskTypeId.remark,
        severity: this.riskTypeId.conditionsLevel,
        source: "runwayHistoryData",
        timespan: "2880000",
        queryitems: queryitems,
        prenoticehour: this.riskTypeId.minutes,
        prenoticemin: this.riskTypeId.second,
        noticemails: noticemails,
        noticephones: noticephones,
        isactive: this.riskTypeId.status
      };
      console.log(JSON.stringify(submitItem));
      if (this.riskTypeId.id < 0) {
        this.submitCreateRiskConfig(submitItem);
      } else {
        submitItem.id = this.riskTypeId.id;
        this.submitUpdateRiskConfig(submitItem);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.noticeDialog {
  /deep/.el-dialog {
    background: #2e2b47;
    width: 66.6% !important;
    padding: 0;
    text-align: left;
    // height: 71vh;
  }
  /deep/.el-dialog__header {
    display: flex;
    text-align: left;
    padding: 0.16rem 0.2rem;
    .el-dialog__title {
      font-size: 0.32rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      // line-height: 0.45rem;
    }
  }
  /deep/.el-dialog__body {
    padding: 0;
  }

  .name_font {
    font-size: 0.2rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(221, 221, 221, 1);
    line-height: 0.28rem;
  }
  .content {
    padding: 0.16rem 0.2rem;
    height: 50vh;
    overflow: auto;
    /deep/.el-select-dropdown {
      border: 1px solid #3b3757ff;
    }
    /deep/.el-select-dropdown__list {
      background: #3b3757ff !important;
    }
    /deep/.el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
      background-color: #2e2b47ff;
    }
    .address_select {
      width: 0.9rem;
      height: 0.4rem;
      margin-top: 0.11rem;
      /deep/.el-popper /deep/.popper__arrow {
        display: none !important;
      }
      /deep/.el-input__inner {
        color: #ffffff;
      }
    }
    .address_select2 {
      width: 0.9rem;
      height: 0.4rem;
      margin-top: 0.11rem;
      /deep/.el-popper /deep/.popper__arrow {
        display: none !important;
      }
      /deep/.el-input__inner {
        color: #ffffff;
      }
      .el-select-dropdown__item {
        &:last-child {
          color: #f53f57ff;
        }
        &:first-child {
          color: #b6ffb5ff;
        }
        &:nth-child(2) {
          color: #ff9b00ff;
        }
      }
    }
    .normal_color {
      /deep/.el-input__inner {
        color: #b6ffb5ff;
      }
    }
    .more_color {
      /deep/.el-input__inner {
        color: #ff9b00ff;
      }
    }
    .danger_color {
      /deep/.el-input__inner {
        color: #f53f57ff;
      }
    }
    .config {
      .name {
        margin-top: 0.34rem;
        /deep/.el-input__inner {
          margin-top: 0.11rem;
          background-color: #242236;
          color: #888888;
          font-size: 0.12rem;
          border-radius: 0.04rem;
          border: 0.01rem solid rgba(68, 68, 68, 1);
        }
        /deep/.el-input__inner::-webkit-input-placeholder {
          color: #666666;
        }
      }
      .address {
        margin-top: 0.4rem;
        /deep/.el-input__inner {
          background-color: #3b3757;
          border: none;
        }
      }
      .status {
        margin-top: 0.4rem;
        .status_font {
          font-size: 0.14rem;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 0.2rem;
        }
        .status_body {
          margin-top: 0.11rem;
        }
      }
      .conditions {
        .list {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.16rem;
        }
        .clear_margin {
          margin-bottom: 0rem;
        }
        margin-top: 0.4rem;

        /deep/.el-input__inner {
          background-color: #3b3757;
          border: none;
        }
        .conditions_header {
          display: flex;
          justify-content: space-between;
        }
        .conditions_body {
          border-radius: 0.04rem;
          background: #232038;
          padding: 0.16rem;
          margin-top: 0.05rem;
          .wind_speed_width {
            width: 1.52rem;
            height: 0.4rem;
            /deep/.el-input__inner {
              color: #ffffff;
            }
          }
          .compare_width {
            width: 0.96rem;
            height: 0.4rem;
            /deep/.el-input__inner {
              color: #ffffff;
            }
          }
          .el-input {
            width: 0.56rem;
            /deep/.el-input__inner {
              background-color: #232038;
              font-size: 0.14rem;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: rgba(255, 255, 255, 1);
              line-height: 0.2rem;
              border: 1px solid rgba(68, 68, 68, 1);
            }
          }
          .speed_font {
            font-size: 0.14rem;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 0.2rem;
          }
          .el-button {
            background: rgba(59, 55, 87, 1);
            border: none;
            font-size: 0.14rem;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 0.2rem;
            height: 0.4rem;
          }
        }
      }
      .note {
        margin-top: 0.4rem;
        textarea {
          width: 100%;
          height: 1.28rem;
          margin-top: 0.11rem;
          background: rgba(35, 32, 56, 1);
          border-radius: 0.04rem;
          border: 0.01rem solid rgba(68, 68, 68, 1);
          font-size: 0.14rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 0.2rem;
        }
        textarea::-webkit-input-placeholder {
          font-size: 0.14rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 0.2rem;
        }
      }
      .notice {
        margin-top: 0.4rem;
        .notice_body {
          border-radius: 0.04rem;
          margin-top: 0.16rem;
          background: #232038;
          padding: 0.26rem 0.16rem;
          font-size: 0.14rem;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(221, 221, 221, 1);
          line-height: 0.2rem;
          /deep/.el-input__inner {
            background-color: #3b3757;
            font-size: 0.14rem;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 0.2rem;
            width: 0.64rem;
            border: none;
          }
        }
      }
      .sendMessage {
        margin-top: 0.4rem;
        .sendMessage_body {
          margin-top: 0.11rem;
          background: #232038;
          /deep/.el-table--fit {
            border-radius: 0.04rem;
          }
          /deep/.el-table th,
          /deep/.el-table tr {
            background-color: #242236;
          }
          /deep/.el-table th {
            font-size: 0.14rem;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #686868;
            line-height: 0.2rem;
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
            font-size: 0.14rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 0.2rem;
          }
        }
      }
    }
  }
  .footer {
    padding: 0.4rem 0.2rem 0.26rem;
    text-align: right;
    .save {
      background: #05892a;
    }
    .cancel {
      background: #736ef7;
    }
    .el-button {
      font-size: 0.14rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 0.2rem;
      border: none;
      width: 0.96rem;
      height: 0.4rem;
    }
  }
}
</style>
