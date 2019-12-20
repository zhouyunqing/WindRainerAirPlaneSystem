<template>
  <div>
    <el-dialog title="删除通知"
               :visible.sync="deleteTipVisible"
               width="30%"
               :before-close="deleteTipClose"
               class="deleteTip">
      <!-- <div class="content">执行此操作将会删除预警配置信息，您确定要继续删除吗？</div> -->
      <div class="content">{{tipInformation}}</div>
      <div class="footer">
        <span class="span_foot" @click="deleteTipClose">取消</span>
        <el-button @click="deleteTipDelete">确认删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'deleteTip',
  data () {
    return {
    }
  },
  methods: {
    deleteTipClose (done) {
      this.$emit('deleteTipClose')
    },
    deleteTipDelete(done){
      if(this.type === 1){
        this.$emit('deleteTipDelete')
      }else{
        this.$emit('deleteNotice')
      }
    }
  },
  props: {
    deleteTipVisible: {
      default: false,
      type: Boolean
    },
    tipInformation: {
      default: '',
      type: String
    },
    type: {
      default: '',
      type: Number
    }
  }
}
</script>
<style lang="scss" scoped>
.deleteTip {
  /deep/.el-dialog {
    background: #2e2b47;
    padding: 0;
    text-align: left;
    width: 3.35rem !important;
  }
  /deep/.el-dialog__header {
    display: flex;
    text-align: left;
    padding: 0.16rem 0.2rem;
    .el-dialog__title {
      font-size: 0.20rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 0.28rem;
    }
  }
  /deep/.el-dialog__body {
    padding: 0 0.2rem;
  }
  .content {
    margin-top: 0.13rem;
    font-size: 0.14rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 0.20rem;
  }
  .footer {
    text-align: right;
    padding-top: 0.30rem;
    padding-bottom: 0.25rem;
    .span_foot {
      font-size: 0.14rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 0.20rem;
      margin-right: 0.30rem;
    }
    /deep/.el-button {
      width: 1.20rem;
      height: 0.40rem;
      background: rgba(237, 34, 60, 1);
      border-radius: 0.04rem;
      font-size: 0.14rem;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 0.20rem;
      border: none;
    }
  }
}
</style>
