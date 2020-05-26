<template>
  <div class="addComponents">
    <div class="wrap">
      <div class="left">
        <div class="close" @click="$emit('closeAddComponents')">关闭</div>
        <div class="title">加入新元素</div>
        <div class="menu">
          <configMenu
            @menuClick="menuClick"
            :isAddComponents="true"
            :subMenu="true"
            :menuData="menuData"
          ></configMenu>
        </div>
      </div>
      <div class="right">
        <div v-for="(item, index) in displaySection" :key="index">
          <div v-if="showActive === item.belong" class="showBlock">
          <div class="innerWrap" v-for="(i, j) in item.content" :key="j">
            <img
              class="item"
              :style="`width: ${i.width}px;height: ${i.height}px`"
              :src="i.image"
              @click="$emit('clickNewSection',showActive, i.id)"
              alt
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import configMenu from '@/components/configMenu'

export default {
  name: 'addComponents',
  data () {
    return {
      showActive: '', // 组件库里哪个组件页面被激活
      menuData: [
        {
          name: '标题',
          hover: false,
          path: 'headlines'
        },
        {
          name: '画廊',
          hover: false,
          path: 'gallery'
        },
        {
          name: '图片',
          hover: false,
          path: 'images'
        },
        {
          name: '文本',
          hover: false,
          path: 'text'
        },
        {
          name: '视频',
          hover: false,
          path: 'video'
        },
        {
          name: '引用',
          hover: false,
          path: 'quote'
        }
      ],
      displaySection: [{
        belong: 'headlines',
        content: [
          {
            id: '1',
            width: '454',
            height: '180',
            image:
            'https://gblobscdn.gitbook.com/assets%2F-M2My8NMVFW2o4zRm3mw%2F-M4J-mXV6x7dEeGWpst4%2F-M4J2GpTorlPMjdPYff0%2F%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200407174719.png?alt=media&token=25c62305-76d8-4355-b3b7-700dc4574549'
          },
          {
            id: '3',
            width: '454',
            height: '180',
            image:
            'https://gblobscdn.gitbook.com/assets%2F-M2My8NMVFW2o4zRm3mw%2F-M4J-mXV6x7dEeGWpst4%2F-M4J2PFKi-uxdxSONVa1%2F%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200407174932.png?alt=media&token=5cbcff62-6c07-4c50-98c5-b7aa35929463'
          },
          {
            id: '2',
            width: '454',
            height: '126',
            image:
            'https://gblobscdn.gitbook.com/assets%2F-M2My8NMVFW2o4zRm3mw%2F-M4J-mXV6x7dEeGWpst4%2F-M4J280rtOMuW94lu27x%2F%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200407174757.png?alt=media&token=52b9a236-333d-43ac-9e93-3b8218b8d289'
          },
          {
            id: '5',
            width: '454',
            height: '180',
            image:
            'https://gblobscdn.gitbook.com/assets%2F-M2My8NMVFW2o4zRm3mw%2F-M4J-mXV6x7dEeGWpst4%2F-M4J2KcBYpq4zsgqvkxq%2F%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200407174851.png?alt=media&token=3e24256d-7fef-4ce6-adb6-12e225a583df'
          },
          {
            id: '4',
            width: '454',
            height: '180',
            image:
            'https://img-blog.csdnimg.cn/20200524214858602.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTA0Njk2MQ==,size_16,color_FFFFFF,t_70'
          }
        ]
      },
      {
        belong: 'gallery',
        content: [
          {
            id: '1',
            width: '454',
            height: '254',
            image:
            'https://gblobscdn.gitbook.com/assets%2F-M2My8NMVFW2o4zRm3mw%2F-M4J-mXV6x7dEeGWpst4%2F-M4J4_MazGEI6v3Y_jWo%2F%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200407180059.png?alt=media&token=b0d94a8f-32b8-43a8-99e0-fab5319191e0'
          },
          {
            id: '2',
            width: '454',
            height: '130',
            image:
            'https://gblobscdn.gitbook.com/assets%2F-M2My8NMVFW2o4zRm3mw%2F-M4J-mXV6x7dEeGWpst4%2F-M4J5GBI0VIgmMEKACCG%2F%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200407180053.png?alt=media&token=f28bdbf2-6506-40cf-9a93-c31995a75e75'
          }
        ]
      }]
    }
  },
  watch: {
  },
  created () {
    this.showActive = this.menuData[0].path
  },
  computed: {},
  mounted () {},
  methods: {
    menuClick (activeItem) {
      this.showActive = activeItem
    }
  },
  components: { configMenu }
}
</script>
<style lang="scss" scoped>
.addComponents {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  .wrap {
    width: calc(100vw - 132px);
    height: calc(100vh - 132px);
    background: white;
    padding: 33px;
    padding-bottom: 0;
    .left {
      display: inline-block;
      .close {
        position: relative;
        z-index: 0;
        width: 50px;
        height: 33px;
        line-height: 33px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        font-weight: 6500;
      }
      .close::before {
        content: "";
        transition: transform 0.3s;
        transform-origin: left;
        transform: scale(0);
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: #ebebeb;
      }
      .close:hover::before {
        transform: scale(1);
      }
      .title {
        margin: 33px 0;
        font-size: 20px;
        font-weight: 500;
      }
      .menu {
        height: calc(100vh - 290px);
        overflow-y: auto;
        overflow-x: auto;
        width: 298px;
      }
    }
    .right {
      display: inline-block;
      width: calc(100vw - 500px);
      height: calc(100vh - 169px);
      overflow-y: auto;
      .showBlock{
        width: 100%;
        column-count: 2;
        column-width: 454px;
        column-gap: 10px;
        text-align: center;
        .innerWrap {
          margin: 0 0 30px auto;
          transition: transform 0.3s;
          .item {
            display: inline-block;
            break-inside: avoid;
            background-size: cover;
            box-shadow: $shadow;
          }
        }
        .innerWrap:hover {
          cursor: pointer;
          transform: translateY(-5px);
        }
      }
    }
  }
}
</style>
