<template>
  <div class="detailBlogs">
    <div v-if="editSetting" class="editSetting" @click.stop="editSetting = false">
      <div class="editWrap" @click.stop="editSetting = true">
        <div class="title">编辑帖子</div>
        <div class="editContent">
          <div class="coverWrap">
            <div class="coverTitle">封面图片</div>
            <div class="coverUpload"><uploadImg></uploadImg></div>
          </div>
          <div class="field_rhs"></div>
        </div>
      </div>
    </div>
    <div class="date">May 30</div>
    <titleBlog :needTitle="true" :content="content"></titleBlog>
    <div class="public">
      <button @click="editSetting = true" title="发布">
        <svg-icon class="icon" icon-class="publish" />
      </button>
    </div>
    <div class="comments">
      <h1>Comments(0)</h1>
      <div class="uiArea">
        <div class="input">
          <textarea v-model="comment" name id></textarea>
        </div>
        <div class="submit">
          <span class="btn">发布评论</span>
        </div>
      </div>
    </div>
    <div class="pagination">
      <span class="pre">
        <svg-icon class="icon" icon-class="arrow" />
        <a href>Pastels</a>
      </span>
      <span class="next">
        <a href>Edges</a>
        <svg-icon class="icon" icon-class="arrow" />
      </span>
    </div>
  </div>
</template>
<script>
import titleBlog from '@/components/addComponents/editor/index.vue'
import uploadImg from '@/components/uploadImg/index.vue'
export default {
  name: 'detailBlogs',
  data () {
    return {
      editSetting: false,
      content: '<h1>1234</h1><p>ahhahah</p>',
      comment: '666666666666666666666'
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {},
  components: {
    titleBlog,
    uploadImg
  }
}
</script>
<style lang="scss" scoped>
.detailBlogs {
  width: 50%;
  margin: 0 auto;
  margin-top: 50px;
  .editSetting {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba($color: #000000, $alpha: .5);
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
      .title {
        padding: 11px 0;
        border-bottom: 1px solid #e4e4e4;
      }
      .editContent {
        height: 80vh;
        overflow-y: auto;
        .coverWrap {
          display: inline-block;
          .coverUpload {
            margin-top: 5px;
            width: 150px;
            height: 150px;
            overflow: hidden;
          }
        }
        .field_rhs {
          display: inline-block;
        }
      }
    }
  }
  .public {
    position: fixed;
    right: 6vw;
    top: 48%;
    font-size: 24px;
  }
  .date {
    font-size: 14px;
    letter-spacing: 0.01rem;
    font-weight: 400;
    margin-bottom: 5px;
  }
  .uiArea {
    margin-bottom: 15px;
    border-radius: 3px;
    background: white;
    border: 1px solid #eaeaea;
    .input {
      textarea {
        width: 100%;
        height: 140px;
        padding: 15px;
        line-height: 1.5em;
      }
    }
    .submit {
      height: 59px;
      text-align: right;
      padding: 10px;
      position: relative;
      .btn {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 1em 2.004em;
        font-size: 15px;
        background: #a8a6a1;
        color: white;
        text-align: center;
        cursor: pointer;
        font-weight: 500;
        letter-spacing: 0.02em;
        font-size: 16px;
      }
    }
  }
  .pagination {
    padding: 3vw 0 3vw;
    margin: 0 -12vw;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 33px;
    .pre {
      .icon {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
