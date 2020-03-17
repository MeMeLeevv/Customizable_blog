<template>
  <div class="login">
      <div class="title"> 您好, <br /> 欢迎回来！</div>
      <div class="content">
        <itemInput v-for="(item, index) in displayData" :key="index" class="item" :type="item.type" :name="item.name" :placeholder="item.placeholder" :errorTip="item.errorTip"
        :RegExp="item.RegExp"
        @setFormData="setFormData" @validForm="val => isCorrectForm = val" :hasFocus.sync="item.hasFocus"></itemInput>
      </div>
      <div class="tip underline">忘记密码 ?</div>
      <div class="textCenter"><button class="loginBtn" @click="login">登录</button></div>
      <div class="tip">新用户?<span class="underline" @click="$emit('changeRegis')"> 那就注册吧~</span></div>
  </div>
</template>
<script>
import itemInput from '@/components/loginORegis/components/itemInput.vue'
import { Message } from 'element-ui'

export default {
  name: 'login',
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
          placeholder: '密码请控制在6位以上',
          errorTip: '请输入6位以上的密码',
          RegExp: /^[a-zA-Z0-9_.-]{6,}$/
        }
      ],
      form: {
        account: '',
        password: ''
      },
      isCorrectForm: false
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
    setFormData (name, value) {
      this.form[name] = value
    },
    login () {
      for (const i in this.form) {
        if (!this.form[i]) { // 任何一项为空
          Message({
            message: '请正确填写信息！',
            type: 'error',
            duration: 3 * 1000
          })
          return
        }
      }
      if (this.isCorrectForm) {
        //
        this.$store.dispatch('user/login', this.form).then(() => {
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

.login {
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
  .loginBtn {
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
    }
    .tip:hover {
      cursor: pointer;
    }

}
</style>
