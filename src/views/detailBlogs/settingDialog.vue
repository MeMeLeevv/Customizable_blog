<template>
  <div class="settingDialog">
    <div v-if="editSetting" class="editSetting" @click.stop="$emit('update:editSetting', false)">
      <div class="editWrap" @click.stop="$emit('update:editSetting', true)">
        <el-form
          :model="detailarticleMsg"
          :rules="rules"
          ref="ruleForm"
          label-width="73px"
          class="demo-ruleForm"
        >
          <div class="titleM">编辑帖子</div>
          <div class="editContent">
            <div class="coverWrap">
              <div class="title">封面图片</div>
              <div class="coverUpload">
                <uploadImg :small="false" :fileList="fileList"></uploadImg>
              </div>
            </div>
            <div class="field_rhs">
              <div class="title">摘要（用于首页文章卡片的文字展示）</div>
              <textarea
                v-model="detailarticleMsg.Summary"
                class="textarea"
                name
                id
                cols="60"
                rows="6"
              ></textarea>
              <div class="postType">
                <el-form-item label="文章类型" prop="postTypeValue">
                  <el-select
                    size="mini"
                    class="noneBorderW"
                    v-model="detailarticleMsg.postTypeValue"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in postTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-show="detailarticleMsg.postTypeValue === '2' || detailarticleMsg.postTypeValue === '3'"
                  label="参考地址"
                  prop="ReprintURL"
                >
                  <el-input
                    class="noneBorderW"
                    placeholder="请输入参考地址"
                    v-model="detailarticleMsg.ReprintURL"
                    clearable
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="detailWrap block">
            <div class="tapWrap">
              <div class="tag">
                <span class="title">标签</span>
                <span class="button-new-tag" @click="showInput">
                  <svg-icon class="icon" icon-class="add" />
                </span>
                <el-tag
                  size="mini"
                  :key="tag"
                  v-for="tag in detailarticleMsg.tapsArr"
                  closable
                  :disable-transitions="false"
                  @close="handleTapClose(tag)"
                >{{tag}}</el-tag>
                <div class="addTag" v-if="tagInputVisible">
                  <div class="title">添加标签</div>
                  <el-input
                    class="input-new-tag noneBorderW"
                    v-model="tagValue"
                    ref="saveTagInput"
                    size="mini"
                    @keyup.enter.native="handleTapConfirm"
                    @blur="handleTapConfirm"
                    placeholder="请填写标签"
                  ></el-input>
                </div>
              </div>
              <div class="category">
                <span class="title">分类</span>
                <el-select
                  class="noneBorderW"
                  v-model="detailarticleMsg.categoryValue"
                  size="mini"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择或创建类别"
                >
                  <el-option
                    v-for="item in categoryArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="commentSet">
              <span class="title"></span>
              <el-form-item label="评论设置" prop="commentValue">
                <el-select
                  size="mini"
                  class="noneBorderW"
                  v-model="detailarticleMsg.commentValue"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in commentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="statusSet">
              <el-form-item label="状态设置" prop="statusValue">
                <el-select
                  size="mini"
                  class="noneBorderW"
                  v-model="detailarticleMsg.statusValue"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="btnWrap">
            <div class="btn cancel" @click.stop="hideSetting">取消</div>
            <div class="btn delete" @click.stop="deleteT">删除</div>
            <div class="btn apply" @click.stop="submitForm('ruleForm')">应用</div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import uploadImg from '@/components/uploadImg/index.vue'
import { deepClone, parseTime } from '@/utils/index.js'
export default {
  name: 'settingDialog',
  props: {
    editSetting: Boolean,
    articleMsg: Object
  },
  data () {
    var checkURl = (rule, value, callback) => {
      if (this.detailarticleMsg.postTypeValue === '2' || this.detailarticleMsg.postTypeValue === '3') {
        if (!value) {
          callback(new Error('请输入url'))
        } else {
          if (this.checkURL(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的url'))
          }
        }
      } else {
        callback()
      }
    }
    return {
      rules: {
        postTypeValue: [
          { required: true, message: '请选择文章类型', trigger: 'change' }
        ],
        commentValue: [
          { required: true, message: '请选择评论设置', trigger: 'change' }
        ],
        ReprintURL: [
          { validator: checkURl, trigger: 'blur' }
        ],
        statusValue: [
          { required: true, message: '请选择文章状态', trigger: 'blur' }
        ]
      },
      tagInputVisible: false,
      statusOptions: [
        {
          value: '1',
          label: '发布'
        },
        {
          value: '2',
          label: '草稿'
        }
      ],
      postTypeOptions: [
        {
          value: '1',
          label: '原创'
        },
        {
          value: '2',
          label: '转载'
        },
        {
          value: '3',
          label: '翻译'
        }
      ],
      commentOptions: [
        {
          value: '1',
          label: '开启'
        },
        {
          value: '2',
          label: '关闭'
        }
      ],
      categoryArr: [
        // 从数据库博客里取出博客存在的分类
        {
          value: 'HTML',
          label: 'HTML'
        },
        {
          value: 'CSS',
          label: 'CSS'
        },
        {
          value: 'JavaScript',
          label: 'JavaScript'
        }
      ], // 后台获取所有类别
      tagValue: '',
      fileList: [],
      detailarticleMsg: {}
    }
  },
  created () {
    this.detailarticleMsg = deepClone(this.articleMsg)
    this.fileList = [
      {
        name: 'detailBlogCover.jpg',
        url: this.detailarticleMsg.cover
      }
    ]
  },
  watch: {
    articleMsg: {
      handler (newV) {
        this.detailarticleMsg = deepClone(this.articleMsg)
        if (this.detailarticleMsg.cover) {
          this.fileList = [
            {
              name: 'detailBlogCover.jpg',
              url: this.detailarticleMsg.cover
            }
          ]
        } else {
          this.fileList = []
        }
      },
      deep: true
    }
  },
  computed: {},
  mounted () {},
  methods: {
    checkURL (URL) {
      var str = URL
      // eslint-disable-next-line no-useless-escape
      var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
      var objExp = new RegExp(Expression)
      return objExp.test(str)
    },
    deleteT () {
      this.$confirm('此操作将永久删除此文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.detailarticleMsg.cover = this.fileList[0].url
          // console.log(this.detailarticleMsg.cover, 'this.detailarticleMsg.cover')
          this.detailarticleMsg.publicTime = parseTime(
            new Date(),
            '{y}/{m}/{d} {h}:{i}:{s}'
          )
          /* tap如何处理？ 每个标签都要有数字标出（articleId号）然后每个文章apply的时候用{key（标签值：文章id},
          然后循环tap标签，如果循环到有值！== -1 ，如果key === 此tap的值
          */
          this.$emit('update:articleMsg', this.detailarticleMsg)
          this.$emit('apply')
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    hideSetting () {
      this.$emit('update:editSetting', false)
    },
    handleTapClose (tag) {
      this.detailarticleMsg.tapsArr.splice(
        this.detailarticleMsg.tapsArr.indexOf(tag),
        1
      )
    },

    showInput () {
      this.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleTapConfirm () {
      const tagValue = this.tagValue
      if (tagValue) {
        this.detailarticleMsg.tapsArr.push(tagValue)
      }
      this.tagInputVisible = false
      this.tagValue = ''
    }
  },
  components: {
    uploadImg
  }
}
</script>
<style lang="scss" scoped>
.el-tag {
  /* elementui在自定义类名下不起作用，单独定义起作用 */
  font-size: 9px;
  border-radius: 100px;
  background: #d0d0d0;
  padding: 0 5.5px;
  margin: 2px 1px;
  color: #3e3e3e;
}
.button-new-tag {
  margin: 0 5px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  cursor: pointer;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.title {
  display: inline-block;
  font-weight: bold;
}
.el-select {
  width: 150px;
}
.settingDialog {
  .editSetting {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba($color: #000000, $alpha: 0.5);
    z-index: 200;
    .editWrap {
      width: 750px;
      background: #f6f6f6;
      box-shadow: 0 4px 33px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.04);
      border-radius: 4px;
      max-height: 100%;
      overflow: hidden;
      font-size: 12px;
      color: #3e3e3e;
      text-align: center;
      .titleM {
        font-weight: bold;
        padding: 11px 0;
        border-bottom: 1px solid #e4e4e4;
      }
      .editContent {
        overflow-y: auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 5px;
        .coverWrap {
          text-align: left;
          display: inline-block;
          .coverUpload {
            margin-top: 5px;
            width: 250px;
            height: 250px;
            overflow: hidden;
          }
        }
        .field_rhs {
          display: inline-block;
          margin-left: 20px;
          text-align: left;
          .postType {
            .noneBorderW {
              font-size: 12px;
            }
          }
          .textarea {
            display: block;
            margin-top: 5px;
            padding: 11px;
            background: white;
            white-space: pre-wrap;
            word-wrap: break-word;
            line-height: unset;
            color: #313131;
            line-height: 22px;
          }
        }
      }
      .block {
        display: block;
      }
      .detailWrap {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-top: 20px;
        .tapWrap {
          padding-right: 22px;
          width: 222px;
          position: relative;
          text-align: left;
          .addTag {
            position: absolute;
            top: -40px;
            left: 20px;
            width: 160px;
            line-height: 28px;
            display: inline-block;
            padding: 5px;
            box-shadow: $shadow;
            text-align: left;
            background: #f6f6f6;
            border-radius: 5px;
            .title {
              display: inline-block;
              vertical-align: middle;
            }
          }
          .category {
            margin-top: 5px;
            .title {
              margin-right: 5px;
            }
          }
        }
      }
      .statusSet,
      .commentSet {
        .title {
          margin-right: 5px;
        }
      }
    }
    .btnWrap {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 20px;
      .btn {
        width: 33.33%;
        height: 44px;
        line-height: 44px;
        border-top: 1px solid #e4e4e4;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .btn:hover {
        background: white;
      }
      .btn + .btn {
        border-left: 1px solid #e4e4e4;
      }
    }
  }
}
</style>
