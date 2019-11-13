<template>
  <div>
    <el-dialog title="删除未保存信息"
               :visible.sync="comfirmDeleteVisible"
               width="30%"
               :before-close="comfirmDeleteClose"
               class="comfirmDelete">
      <div class="content">执行此操作将会删除未保存信息，您确定要继续删除吗？</div>
      <div class="footer">
        <span class="span_foot" @click="comfirmDeleteClose">取消</span>
        <el-button @click="comfirmDelete">确认删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'comfirmDelete',
  data () {
    return {
    }
  },
  methods: {
    comfirmDeleteClose (done) {
      this.$emit('closeComfirmDelete')
    },
    comfirmDelete(done){
      this.$emit('comfirmDelete')
    }
  },
  props: {
    comfirmDeleteVisible: {
      default: false,
      type: Boolean
    }
  }
}
</script>
<style lang="scss" scoped>
.comfirmDelete {
  /deep/.el-dialog {
    background: #2e2b47;
    padding: 0;
    text-align: left;
    width: 3.35rem !important;
  }
  /deep/.el-dialog__header {
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
    margin-top: 0.32rem;
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