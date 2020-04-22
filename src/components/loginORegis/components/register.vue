<template>
  <div class="register">
      <div class="title">来吧~ <br /> 快加入我们!</div>
      <div class="content">
        <itemInput v-for="(item, index) in displayData" :key="index" class="item" :type="item.type" :name="item.name" :placeholder="item.placeholder" :errorTip="item.errorTip"
        :RegExp="item.RegExp"
        @setFormData="setFormData" @validForm="val => isCorrectForm = val"></itemInput>
      </div>
      <div class="tip smallWord">
        <span class="policy">创建账户即为您需要同意我们的 <br />
        <span class="underline redFont">使用条款和隐私政策</span></span>
      </div>
      <div class="textCenter"><button class="RegisterBtn" @click="register">注册</button></div>
      <div class="tip underline" @click="$emit('changeLogin')"> 已有账户？</div>
  </div>
</template>
<script>
import itemInput from '@/components/loginORegis/components/itemInput.vue'
import { Message } from 'element-ui'

export default {
  name: 'register',
  data () {
    return {
      showMinelog: false,
      displayData: [
        {
          name: 'account',
          type: 'text',
          placeholder: '请输入邮箱',
          errorTip: '请输入正确的邮箱',
          RegExp: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
        },
        {
          name: 'password',
          type: 'password',
          placeholder: '请输入6位以上的密码',
          errorTip: '请输入6位以上的密码',
          RegExp: /^[a-zA-Z0-9_.-]{6,}$/
        },
        {
          name: 'passwordComfirm',
          placeholder: '请再次确认密码',
          type: 'password',
          errorTip: '密码前后不匹配！请重试！',
          RegExp: this.form && this.form.password // this.form是undefined时不可取属性
        }
      ],
      form: {
        account: '',
        password: '',
        passwordComfirm: '',
        blogId: '',
        avatar: 'https://gss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/8cb1cb13495409231efd8e7d9458d109b3de4919.jpg',
        starIdArr: [],
        desc: '这个人很懒，什么也没留下',
        name: '小可爱一枚~' // 在navbar里也可以修改个人信息，无须点开博客设置
      },
      isCorrectForm: false
    }
  },
  created () {
  },
  computed: {},
  mounted () {},
  methods: {
    setFormData (name, value) {
      this.form[name] = value
    },
    register () {
      for (const i in this.form) {
        if (i === 'account' || i === 'password' || i === 'passwordComfirm') {
          if (!this.form[i]) { // 任何一项为空
            Message({
              message: '请正确填写信息！',
              type: 'error',
              duration: 3 * 1000
            })
            return
          }
        }
      }
      if (this.isCorrectForm) {
        //
        this.$store.dispatch('user/register', this.form).then((res) => {
          this.$store.dispatch('app/setLogin0Regis', false)
        }).catch(err => {
          console.log(new Error(err))
        })
      }
    }
  },
  components: {
    itemInput
  }
}
</script>
<style lang="scss" scoped>
.redFont {
  color: $font_error;
}
.register {
  .title {
    padding-left: 10px;
    width: 70%;
    font-size: 28px;
    margin-bottom: 40px;
  }
  .content {
    .item {
      margin: 20px 0;
    }
  }
  .RegisterBtn {
    margin-top: 20px;
    padding: 7px 12px;
    color: white;
    font-size: 20px;
    background-color: $darkMColor;
    box-shadow: $shadow;
  }
  .tip {
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
      color: $font_tip;
      line-height: 14px;
    }
    .tip:hover {
      cursor: pointer;
    }
    .smallWord {
      font-size: 10px;
      .checkbox {
        vertical-align: top;
        color: $darkMColor;
      }
      .policy {
        vertical-align: top;
      }
    }

}
</style>
