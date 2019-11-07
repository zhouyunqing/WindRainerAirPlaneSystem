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
    width: 335px !important;
  }
  /deep/.el-dialog__header {
    text-align: left;
    padding: 16px 20px;
    .el-dialog__title {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 28px;
    }
  }
  /deep/.el-dialog__body {
    padding: 0 20px;
  }
  .content {
    margin-top: 32px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
  }
  .footer {
    text-align: right;
    padding-top: 30px;
    padding-bottom: 25px;
    .span_foot {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      margin-right: 30px;
    }
    /deep/.el-button {
      width: 120px;
      height: 40px;
      background: rgba(237, 34, 60, 1);
      border-radius: 4px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      border: none;
    }
  }
}
</style>