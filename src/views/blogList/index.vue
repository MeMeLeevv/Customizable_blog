<template>
  <div class="blogList" ref="blogWrap">
    <div v-if="isBlogger" class="control-button-wrapper">
      <div class="iconBar">
        <button class="editbtn" id="addBtn" @click.stop="goBlankEditBlog">新建文章</button>
      </div>
      <div class="iconBar">
        <button class="btn" @click="$emit('update:showEditDialog', true)">
          <svg-icon class="icon" icon-class="editPan" />
        </button>
        <button class="btn">
          <svg-icon class="icon upIcon" icon-class="fullArrow" />
        </button>
        <button class="btn">
          <svg-icon class="icon downIcon" icon-class="fullArrow" />
        </button>
      </div>
    </div>
    <div v-if="showEditDialog" class="editDialog">
      <!-- 注意dialog要放在父级，否则编辑刷新时dialog会消失 -->
      <div class="hide" @click="$emit('update:showEditDialog', false)"><svg-icon class="icon" icon-class="cancel" /></div>
      <div class="header">格式</div>
      <div class="content">
        <div v-if="showDialogKey.layout" class="item">
          <label class="label">布局</label>
          <div class="itemBlock">
            <el-select class="select noneBorder" v-model="blogListSetting.layout" placeholder="请选择">
              <el-option
                v-for="item in layoutOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="showDialogKey.align" class="item">
          <label class="label">文本对齐</label>
          <div class="itemBlock">
            <el-select class="select noneBorder" v-model="blogListSetting.align" placeholder="请选择">
              <el-option
                v-for="item in alignOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="showDialogKey.img" class="item">
          <label class="label">图片位置</label>
          <div class="itemBlock">
            <el-select
              class="select noneBorder"
              v-model="blogListSetting.imgPlace"
              placeholder="请选择"
            >
              <el-option
                v-for="item in imgOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="showDialogKey.columns" class="item">
          <label class="label">columns</label>
          <div class="itemBlock">
            <el-select
              class="select noneBorder"
              v-model="blogListSetting.columns"
              placeholder="请选择"
            >
              <el-option
                v-for="item in columnOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <!-- 单列布局 -->
    <div v-if="blogListSetting.layout === '1'" class="blogWrapper blog-single-column">
      <article
        :class="`blog-single-column--container ${blogListSetting.imgPlace === '1' ? 'imgReverse' : 'imgNormal'}`"
        v-for="(item, index) in blogData"
        :key="index"
        @click="toDetailPage(item.articleId)"
      >
        <div class="hr"></div>
        <div
          :class="`blog-single-column--text ${blogListSetting.align === '1' ? 'text-left' :blogListSetting.align === '2' ? 'text-center' :'text-right'}`"
        >
          <h1 ref="single_title" class="blog-title">{{item.title}}</h1>
          <div class="blog-desc">{{item.Summary}}</div>
          <div class="blog-meta">{{item.publicTime}}·{{item.author}}</div>
        </div>
        <div class="blog-article-spacer"></div>
        <div class="blog-single-column--img">
          <img ref="cover" :src="item.cover" @load="getImgSize.apply(this, [$event,index])" alt />
        </div>
      </article>
    </div>
    <!-- 双列交叉布局 -->
    <div v-else-if="blogListSetting.layout === '2'" class="blogWrapper blog-sideBySide-row">
      <article
        v-for="(item, index) in blogData"
        :key="index"
        :class="`blog-sideBySide-row--container ${index % 2 === 0 ? 'rowReverse' : ''}`"
        @click="toDetailPage(item.articleId)"
      >
        <div
          :class="`blog-sideBySide-row--text ${blogListSetting.align === '1' ? 'text-left' :blogListSetting.align === '2' ? 'text-center' :'text-right'}`"
        >
          <div class="blog-meta">{{item.publicTime}}·{{item.author}}</div>
          <h1 class="blog-title">{{item.title}}</h1>
          <div class="blog-desc">{{item.Summary}}</div>
        </div>
        <div class="blog-article-spacer"></div>
        <div class="blog-sideBySide-row--img">
          <img :src="item.cover" ref="cover" alt @load="getImgSize.apply(this, [$event,index])" />
        </div>
      </article>
    </div>
    <!-- 多列布局 -->
    <div v-else-if="blogListSetting.layout === '3'" class="blogWrapper blog-grid-row">
      <article
        v-for="(item, index) in blogData"
        :key="index"
        :class="`blog-grid-row--container ${blogListSetting.imgPlace === '1' ? 'imgReverse' : 'imgNormal'}`"
        :style="`${blogListSetting.columns === '3' ? 'width:31% ' : blogListSetting.columns === '2' ? 'width:47% ' : blogListSetting.columns === '4' ? 'width:23% ' : ''}`"
        @click="toDetailPage(item.articleId)"
      >
        <div
          :class="`blog-grid-row--text ${blogListSetting.align === '1' ? 'text-left' :blogListSetting.align === '2' ? 'text-center' :'text-right'}`"
        >
          <div class="blog-meta">{{item.publicTime}}</div>
          <h1 class="blog-title">{{item.title}}</h1>
          <div class="blog-desc">{{item.Summary}}</div>
        </div>
        <div class="blog-article-spacer"></div>
        <div class="blog-grid-row--img">
          <img ref="cover" :src="item.cover" alt @load="getImgSize.apply(this, [$event,index])" />
        </div>
      </article>
    </div>
    <!-- 瀑布流 -->
    <div
      v-else-if="blogListSetting.layout === '4'"
      ref="MasonryWrapper"
      :class="`blogWrapper ${blogListSetting.columns === '3' ? 'blog-Masonry-3-row' : blogListSetting.columns === '2' ? 'blog-Masonry-2-row' : blogListSetting.columns === '4' ? 'blog-Masonry-4-row' : ''}`"
    >
      <article
        v-for="(item, index) in blogData"
        :key="index"
        ref="articles"
        :class="`blog-Masonry-row--container ${blogListSetting.imgPlace === '1' ? 'imgReverse' : 'imgNormal'}`"
        :style="`${blogListSetting.columns === '3' ? 'width:31% ' : blogListSetting.columns === '2' ? 'width:47% ' : blogListSetting.columns === '4' ? 'width:23% ' : ''}`"
        @click="toDetailPage(item.articleId)"
      >
        <div
          :class="`blog-Masonry-row--text ${blogListSetting.align === '1' ? 'text-left' :blogListSetting.align === '2' ? 'text-center' :'text-right'}`"
        >
          <div class="blog-meta">{{item.publicTime}}</div>
          <h1 class="blog-title">{{item.title}}</h1>
          <div class="blog-desc">{{item.Summary}}</div>
        </div>
        <div class="blog-article-spacer"></div>
        <div class="blog-Masonry-row--img" ref="img">
          <img ref="cover" :src="item.cover" alt @load="getImgSize.apply(this, [$event,index])" />
        </div>
      </article>
      <span class="blog-Masonry-row--container break"></span>
      <span class="blog-Masonry-row--container break"></span>
      <span class="blog-Masonry-row--container break"></span>
    </div>
    <son :keke="123" yy="00" v-bind="$attrs"></son>
  </div>
</template>
<script>
import { createArticle } from '@/api/article'
import { updateBlogSetting } from '@/api/blog'
import son from '@/views/blogList/grantson.vue'
export default {
  name: 'blogList',
  props: {
    showEditDialog: {
      type: Boolean,
      default: false
    },
    blogData: Array
  },
  data () {
    return {
      isBlogger: false,
      layoutOptions: [
        {
          value: '1',
          label: '单列排序'
        },
        {
          value: '2',
          label: '双列交叉排序'
        },
        {
          value: '3',
          label: '多列排序'
        },
        {
          value: '4',
          label: '瀑布流排序'
        }
      ],
      imgOptions: [
        {
          value: '1',
          label: '上'
        },
        {
          value: '2',
          label: '下'
        }
      ],
      alignOptions: [
        {
          value: '1',
          label: 'left'
        },
        {
          value: '2',
          label: 'center'
        },
        {
          value: '3',
          label: 'right'
        }
      ],
      columnOptions: [
        {
          value: '2',
          label: '2列'
        },
        {
          value: '3',
          label: '3列'
        },
        {
          value: '4',
          label: '4列'
        }
      ],
      showDialogKey: {
        // 在点击编辑icon时需要显示的dialog条例
      },
      articleH: [], // 保存article高度集合
      articleMaxH: [0, 0, 0, 0], // 保存article对应列数的累积高度
      marginBottom: 0, // 每行article的marginBottom累加
      imgMaxH: '',
      blogListSetting: {
        layout: this.$store.state.blog.blogSetting.blogListSetting.layout, // 1为单列
        align: this.$store.state.blog.blogSetting.blogListSetting.align,
        columns: this.$store.state.blog.blogSetting.blogListSetting.columns,
        imgPlace: this.$store.state.blog.blogSetting.blogListSetting.imgPlace
      }
    }
  },
  watch: {
    '$store.state.user.isBlogger': {
      handler (val) {
        this.isBlogger = val
      },
      immediate: true
    },
    '$store.state.blog.fullPage': {
      handler (val) {
        this.$emit('refreshBlogList')
      }
    },
    blogListSetting: {
      handler: function (newV, oldV) {
        console.log(newV, 'blogListSetting')
        updateBlogSetting({ blogId: this.$store.state.user.blogId, blogListSetting: newV }).then(res => {
          this.$store.dispatch('blog/setBlogListSetting', newV)
        })
      },
      deep: true
    },
    'blogListSetting.layout': {
      // 布局和列数改变时需要重新刷新，保证图片正确显示
      handler: function (newV, oldV) {
        this.$emit('update:showEditDialog', true)
        this.$emit('refreshBlogList')
      }
    },
    'blogListSetting.columns': {
      handler: function (newV, oldV) {
        this.$emit('update:showEditDialog', true)
        this.$emit('refreshBlogList')
      }
    }
  },
  created () {
    this.$store.dispatch('blog/setBlogFresh', true)
    // console.log(this.$store.state.blog.scrollTop, 'this.$store.state.blog.scrollTop')
    /* 初始化时根据布局规定cover最大高度以及编辑dialog需要显示的条例 */
    const layout = this.blogListSetting.layout
    if (layout === '1') {
      // 单列,可图片上下交换、文本左右
      this.imgMaxH = 700
      this.showDialogKey = {
        layout: true,
        img: true,
        align: true,
        columns: false
      }
    } else if (layout === '2') {
      // 双列交叉，可文本左右
      this.imgMaxH = 449
      this.showDialogKey = {
        layout: true,
        img: false,
        align: true,
        columns: false
      }
    } else if (layout === '3' || layout === '4') {
      // 双列交叉 可图片上下交换、文本左右，控制列数
      this.showDialogKey = {
        layout: true,
        img: true,
        align: true,
        columns: true
      }
      if (this.blogListSetting.columns === '2') {
        this.imgMaxH = 319
      } else if (this.blogListSetting.columns === '3') {
        this.imgMaxH = 206
      } else if (this.blogListSetting.columns === '4') {
        this.imgMaxH = 105
      }
    }
  },
  computed: {},
  mounted () {
    const that = this
    this.$nextTick(function (params) {
      console.log(that.$attrs, 'attr') // {hahha: 123} "attr"
      // this.$refs.blogWrap.scrollTop = this.$store.state.blog.scrollTop
    })
  },
  methods: {
    goBlankEditBlog () {
      createArticle({ blogId: this.$store.state.user.blogId }).then(res => {
        this.$router.push(`/${this.$route.params.blogId}/articles/${res.data.articleId}`)
      }) // 如果为空推出后要销毁
    },
    toDetailPage (articleId) {
      this.$router.push(`/${this.$route.params.blogId}/articles/${articleId}`)
    },
    /* 检测加载图片的尺寸，single布局的图片加载高度不超过700 ,图片加载顺序不一致 */
    getImgSize (e, index) {
      const img = e.path[0]
      const disW = img.width // 图片展示宽度
      let oriW, oriH, radio
      if (typeof img.height === 'undefined') {
        // IE 6/7/8
        var i = new Image()
        i.src = img.src
        oriW = i.naturalWidth
        oriH = i.naturalHeight
        radio = oriH / oriW
      } else {
        // HTML5 browsers
        oriW = img.naturalWidth
        oriH = img.naturalHeight
        radio = oriH / oriW
      }
      let disH = disW * radio // 根据disW和原始图片的比例算出对应比例的高度，如果高度大于最大高度maxH，就用top位移，保持图片中心点展示
      img.style.height = `${disH}px`
      if (disH > this.imgMaxH) {
        const topH = (disH - this.imgMaxH) / 2
        img.style.top = `${-topH}px`
        disH = this.imgMaxH
        img.parentNode.style.height = disH + 'px'
      } else {
        img.parentNode.style.height = `${disH}px`
      }

      if (this.blogListSetting.layout === '4') {
        // 当瀑布流显示时需要计算出容器高度
        const textH = this.$refs.articles[index].clientHeight // 这里得到的是没有cover的article高度?? 又包括了？？
        this.articleH[index] = parseInt(textH)
        // this.articleH.push(parseInt(disH - -textH))
        const artMaxIndex = index % this.blogListSetting.columns
        if (artMaxIndex === 1) {
          // 记录每行第一个article，此时容器高度要加一个marginBottom
          this.marginBottom += 50
        }
        this.articleMaxH[artMaxIndex] += Number(this.articleH[index])
        // // console.log(artMaxIndex, 'artMaxIndex')
        // 当加载完毕时计算出列数中的最大值 容器高度 > (容器padding上下:)90 +( 列数最高:)this.articleMaxH + (每行的marginBottom)this.marginBottom + (可能的误差) + 6
        this.$refs.MasonryWrapper.style.height = `${Math.max(
            ...this.articleMaxH
          ) +
            this.marginBottom +
            120 * 2 +
            6}px`
        // console.log(this.articleH, 'this.articleH')
        // // console.log(this.articleMaxH, 'MaxH')
        // // console.log(textH, 'textH') // 当articleH的元素数量等于article的数量时表示全部加载完毕，开始根据columns来分列取得每列最大的数作为container的高度
        // // console.log(this.articleH, 'hh') // 当articleH的元素数量等于article的数量时表示全部加载完毕，开始根据columns来分列取得每列最大的数作为container的高度
      }
    }
  },
  components: {
    son
  }
}
</script>
<style lang="scss" scoped>
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.imgReverse {
  flex-direction: column-reverse;
}
.rowReverse {
  flex-direction: row-reverse;
}
.imgNormal {
  flex-direction: column;
}
.hr {
  height: 1px;
  border-bottom: 1px solid $mainColor;
  margin: 50px 0;
}
.blogList {
  position: relative;
  .control-button-wrapper {
    position: absolute;
    top: 50px;
    right: 22px;
    height: 44px;
    display: flex;
    .iconBar {
      margin-right: 11px;
      padding: 4px;
      height: 44px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.02);
      background-color: #fff;
      border-radius: 8px;
      overflow-x: hidden;
      overflow-y: hidden;
      .editbtn {
        padding: 0 14px;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 36px;
        letter-spacing: 1px;
      }
      .btn {
        border-radius: 4px;
        width: 36px;
        height: 36px;
        .icon {
          font-size: 18px;
        }
        .upIcon {
          transform: rotate(135deg);
        }
        .downIcon {
          transform: rotate(-45deg);
        }
      }
    }
  }
  .editDialog {
    position: absolute;
    top: 100px;
    right: 100px;
    z-index: 10;
    box-shadow: $shadow;
    background: white;
    .hide {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 18px;
      cursor: pointer;
    }
    .header {
      width: 320px;
      height: 55px;
      line-height: 55px;
      background-color: #fff;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
      color: rgb(49, 49, 49);
      text-align: center;
      box-shadow: rgba(0, 0, 0, 0.06) 0px -1px 0px 0px inset; /* 底线 */
    }
    .content {
      height: 250px;
      overflow-x: hidden;
      overflow-y: auto;
      .label {
        letter-spacing: 0.75px;
        font-weight: 500;
        font-size: 9.75px;
        color: #a1a1a1;
        margin-top: 33px;
        padding: 0 22px;
      }
      .itemBlock {
        display: flex;
        justify-content: center;
        .select {
          width: 90%;
        }
      }
    }
  }
  .blogWrapper {
    cursor: pointer;
  }
  .blog-Masonry-2-row {
    width: 100%;
    height: 1800px; // 瀑布流高度必须要有且大于子元素撑起的高度 https://jessieji.com/2019/pure-css-masonry
    padding: 90px;
    display: flex;
    flex-flow: column wrap;
    align-content: space-between;
    /* 重新定义内容块排序优先级，让其横向排序 */
    .blog-Masonry-row--container:nth-child(2n + 1) {
      // 第一列
      order: 1; /* order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。 */
    }
    .blog-Masonry-row--container:nth-child(2n) {
      // 第二列
      order: 2;
    }
  }
  .blog-Masonry-3-row {
    width: 100%;
    height: 1800px; // 瀑布流高度必须要有且大于子元素撑起的高度 https://jessieji.com/2019/pure-css-masonry
    padding: 90px;
    display: flex;
    flex-flow: column wrap;
    align-content: space-between;
    /* 重新定义内容块排序优先级，让其横向排序 */
    .blog-Masonry-row--container:nth-child(3n + 1) {
      // 第一列
      order: 1; /* order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。 */
    }
    .blog-Masonry-row--container:nth-child(3n + 2) {
      // 第二列
      order: 2;
    }
    .blog-Masonry-row--container:nth-child(3n) {
      // 第三列
      order: 3;
    }
  }
  .blog-Masonry-4-row {
    width: 100%;
    height: 1800px; // 瀑布流高度必须要有且大于子元素撑起的高度 https://jessieji.com/2019/pure-css-masonry
    padding: 90px;
    display: flex;
    flex-flow: column wrap;
    align-content: space-between;
    /* 重新定义内容块排序优先级，让其横向排序 */
    .blog-Masonry-row--container:nth-of-type(4n + 1) {
      order: 1; /* order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。 */
    }
    .blog-Masonry-row--container:nth-of-type(4n + 2) {
      order: 2;
    }
    .blog-Masonry-row--container:nth-of-type(4n + 3) {
      order: 3;
    }
    .blog-Masonry-row--container:nth-of-type(4n) {
      order: 4;
    }
    /* Force new columns */
    .break {
      flex-basis: 100%;
      width: 0;
      margin: 0;
      content: "";
      padding: 0;
    }
  }
  .blog-Masonry-row--container {
    display: flex;
    margin-bottom: 50px;
    .blog-Masonry-row--img {
      overflow: hidden;
      display: flex;
      position: relative;
      img {
        display: inline-block;
        width: calc(100%);
        position: absolute;
        left: 0;
      }
    }
    .blog-article-spacer {
      height: 30px;
    }
    .blog-Masonry-row--text {
      .blog-title {
        font-size: 33px;
        font-weight: 500;
      }
      .blog-desc {
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
        font-weight: 300;
        font-size: 15px;
        line-height: 1.8em;
      }
    }
    .blog-meta {
      font-weight: 300;
      font-size: 15px;
      line-height: 1.8;
    }
  }
  .blog-grid-row {
    width: 100%;
    padding: 6vw;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    .blog-grid-row--container {
      display: flex;
      margin-bottom: 50px;
      margin-left: 15px;
      .blog-grid-row--img {
        overflow: hidden;
        display: flex;
        position: relative;
        img {
          display: inline-block;
          width: calc(100%);
          position: absolute;
          left: 0;
        }
      }
      .blog-article-spacer {
        height: 30px;
      }
      .blog-grid-row--text {
        .blog-title {
          font-size: 33px;
          font-weight: 500;
        }
        .blog-desc {
          font-weight: 300;
          font-size: 15px;
          line-height: 1.8em;
        }
      }
      .blog-meta {
        font-weight: 300;
        font-size: 15px;
        line-height: 1.8;
      }
    }
  }
  .blog-sideBySide-row {
    width: 100%;
    padding: 6vw;
    .blog-sideBySide-row--container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 100px;
      .blog-sideBySide-row--img {
        overflow: hidden;
        width: 45%;
        display: flex;
        position: relative;
        max-height: 700px;
        img {
          display: inline-block;
          width: calc(100%);
          position: absolute;
          left: 0;
        }
      }
      .blog-article-spacer {
        width: 15%;
        height: 30px;
      }
      .blog-sideBySide-row--text {
        width: calc(100% - 46% - 10%);
        .blog-title {
          font-size: 42px;
          font-weight: 500;
        }
        .blog-desc {
          font-weight: 300;
          font-size: 15px;
          line-height: 1.8em;
        }
      }
      .blog-meta {
        font-weight: 300;
        font-size: 15px;
        line-height: 1.8;
      }
    }
  }
  .blog-single-column {
    width: 100%;
    padding: 6vw;
    .blog-single-column--container {
      display: flex;
      .blog-single-column--img {
        overflow: hidden;
        width: 46%;
        display: flex;
        position: relative;
        margin: 0 auto;
        img {
          display: inline-block;
          width: calc(100%);
          position: absolute;
          left: 0;
        }
      }
      .blog-article-spacer {
        height: 30px;
      }
      .blog-single-column--text {
        .blog-title {
          margin-top: 0;
          font-size: 60px;
          font-weight: 500;
        }
        .blog-desc {
          font-weight: 300;
          font-size: 15px;
          line-height: 1.8em;
        }
      }
      .blog-meta {
        margin-top: 30px;
        font-weight: 300;
        font-size: 1rem;
        line-height: 1.8;
      }
    }
  }
}
</style>
