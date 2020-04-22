<template>
  <div class="uploadImage">
    <el-upload
      :action="action"
      list-type="picture-card"
      name="file"
      :show-file-list="showFileList"
      :before-upload="beforeAvatarUpload"
      :on-success="uploadSuccess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="limit"
      :on-exceed="imgExceed"
    >
      <i class="el-icon-plus"></i>
      <div slot="tip" class="showMsg el-upload__tip" v-if="imgList.length !== 0">
        <span class="msgItem" v-for="(item) in imgList" :key="item.id">{{`( ${item.width} * ${item.height} )`}}</span>
      </div>
      <div slot="tip" class="el-upload__tip">{{ addMsg }}</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible"
      ><!-- 预览图片 -->
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 信息如果都已经验证成功，则用formData结合上传后台，触发父元素刷新表格
  name: 'uploadImage',
  props: {
    action: {
      type: String,
      default: '/api/uploadFile'
    },
    limit: {
      type: Number,
      default: 1
    },
    addMsg: {
      type: String,
      default: '上传图片不超过200kb'
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    inputName: { /* 图片信息对应的key值，方便在父组件里整合成form一起提交到数据库 */
      type: String,
      default: ''
    }
  },
  data () {
    return {
      imgList: [], // 已上传的图片信息数组
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      multiple: false
    }
  },
  created () {
    this.fileList = []
    this.imgList = []
  },
  methods: {
    /*
    作用：上传成功后触发父组件的getImgMsg方法
    @response: Object 上传的响应结果
    @file: Object  该次请求结果返回的文件和响应信息
    @fileList: Array  请求结果返回的所有文件和响应信息
    @return void
    */
    uploadSuccess (response, file, fileList) {
      const that = this
      const imgLen = fileList.length
      if (imgLen > 1) { // 多图上传
        if (response.code === '1') {
          const data = response.data
          data.uid = file.uid
          that.imgList.push(data)
          if (that.imgList.length === imgLen) {
            that.$emit('getImgMsg', that.inputName, that.imgList)
          }
        } else {
          that.$message.error(response.msg)
        }
      } else {
        const code = response.code
        if (code === '1') {
          const data = response.data
          data.uid = file.uid
          that.imgList.push(data)
        } else {
          that.$message.error(response.msg)
        }
        that.$emit('getImgMsg', that.inputName, that.imgList)
      }
    },
    /*
    作用：移除已上传的图片，并且要在imgList将它移除
    @file: Object  该次请求结果返回的文件和响应信息
    @fileList: Array  请求结果返回的所有文件和响应信息
    @return void
    */
    handleRemove (file, fileList) { //
      const index = this.imgList.findIndex((item, index) => item.uid === file.uid)
      this.imgList.splice(index, 1)
      console.log(this.imgList, 'this.imgList')
      this.$emit('getImgMsg', this.inputName, this.imgList, true) // true表示是移除操作
    },
    /*
    作用：预览图片
    @file: Object  该次请求结果返回的文件和响应信息
    @return void
    */
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /*
    作用：上传图片前，需要先判断文件格式以及大小是否不合格
    @file: Object  该次请求结果返回的文件和响应信息
    @return void
    */
    beforeAvatarUpload (file) { /* 上传前 */
      console.log(file.type, 'file.type')
      const isJPG = this.isImage(file.type)
      const isLt2M = (file.size / 1024 / 200).toPrecision(3) < 1
      if (!isJPG) {
        this.$message.error('请上传图片格式的文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 200k!')
      }
      return isJPG && isLt2M
    },
    /*
    作用：判断图片格式
    @ext: String  图片后缀格式
    @return void
    */
    isImage (ext) {
      return (
        [
          'png',
          'jpg',
          'jpeg',
          'bmp',
          'gif',
          'webp',
          'psd',
          'svg',
          'tiff',
          'image/jpeg',
          'image/png',
          'image/gif'
        ].indexOf(ext) !== -1
      )
    },
    /*
    作用：超出上传图片指定数量
    @return void
    */
    imgExceed () {
      this.$message({
        message: '图片只能上传指定数量！,请先删除已存在的图片！',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.showMsg
  line-height: 20px
  color: gray
  font-size: 14px
  .msgItem
    width: 146px
    height: 18px
    text-align: center
</style>
