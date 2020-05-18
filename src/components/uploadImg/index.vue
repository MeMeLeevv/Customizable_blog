<template>
  <div class="uploadImage">
    <el-upload
      :class="`${small ? 'small-uploader':'cover-uploader'}`"
      :action="action"
      list-type="picture-card"
      name="file"
      :show-file-list="showFileList"
      :before-upload="beforeAvatarUpload"
      :on-success="uploadSuccess"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="limit"
      :on-exceed="imgExceed"
    >
      <i class="el-icon-plus"></i>
      <img v-if="dialogImageUrl" :src="dialogImageUrl" :class="`${small ? 'smallCover' : 'cover'}`">
    </el-upload>
    <el-dialog :visible.sync="dialogVisible"
      ><!-- 预览图片 -->
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
    },
    small: {
      type: Boolean,
      defalut: false
    },
    fileList: {
      type: Array, // [{name: 'detailBlogCover.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      multiple: false
    }
  },
  created () {
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
      // console.log(response, 'fileSeccess')
      this.fileList.push({ name: 'articleCover.jpg', url: `/api/images/${response.filename}` })
      this.$emit('update:fileList', this.fileList)
      this.$emit('update')
    },
    /*
    作用：移除已上传的图片，并且要在imgList将它移除
    @file: Object  该次请求结果返回的文件和响应信息
    @fileList: Array  请求结果返回的所有文件和响应信息
    @return void
    */
    handleRemove (file, fileList) { //
      this.fileList.splice(0, 1)
      this.$emit('update:fileList', this.fileList)
    },
    /*
    作用：上传图片前，需要先判断文件格式以及大小是否不合格
    @file: Object  该次请求结果返回的文件和响应信息
    @return void
    */
    beforeAvatarUpload (file, fileList) { /* 上传前 */
      const isJPG = this.isImage(file.type)
      const isLt2M = (file.size / 1024 / 200).toPrecision(3) < 1
      if (!isJPG) {
        this.$message.error('请上传图片格式的文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 200k!')
        return false
      }
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
.uploadImage
  .cover
    width: 250px
    height: 250px
  .smallCover
    width: 80px
    height: 80px
</style>
