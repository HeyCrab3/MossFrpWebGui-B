<template>
<div class="background" v-loading="isLoading">
  <div id="regBox" v-loading="isLoading">
      <h2 style="font-size:var(--el-font-size-extra-large)">注册</h2>
      <el-input ref="v1" v-model="eMail" placeholder="邮箱" />
      <el-input ref="v1" v-model="userName" placeholder="用户名" />
      <el-input ref="v2" type="password" v-model="passWord" placeholder="密码" />
      <el-input class="verification" ref="v1" v-model="verification" placeholder="验证码" />      <el-button class="getcode" @click="getCode" >获取验证码</el-button>
      <el-button @click="RegButtonClicked" type="primary" size="large" color="#114514" style="margin-left:1px;width:100px;" class="regbutton">注册</el-button>
      <el-button type="text" @click="dialogVisible = true">忘记密码？</el-button>

      <el-dialog v-model="dialogVisible" title="忘记密码？" width="30%"><span>如果您记得自己的密码却显示密码错误，这是由于后端密码加密格式的更改，请在<strong>私信</strong>中回复指令 #更新信息 重置密码才能登陆成功</span><br/><span>如果您忘记了密码，请在<strong>私信</strong>中回复指令 #更新信息 重置密码。</span><template #footer><span class="dialog-footer"><el-button type="primary" size="large" color="#114514" @click="dialogVisible = false">好</el-button></span></template></el-dialog>
  </div>
</div>
</template>
<style>
.background{
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        position: relative;
        background-image: url("https://api.lazy.ink/img");
}
  .left-float{
      float: left
  }
  #regBox{
    color: blanchedalmond;
        float:right;
        width:20%;
        padding:10px 15px;
        margin-top: 9%;
        height: 60%;
        margin-right: 25%;
        border-radius:10px;
        transform: translate(-200px);
        background: rgb(46 36 36 / 70%);
        box-shadow: 0px 15px 25px #00000020;
  }
  #regBox .el-input,#regBox .el-button{
      margin-top:20px;
  }
  .getcode{
    background-color: #0000007e;
  }
  .verification{
      width: 157px;
  }
  .regbutton{
    margin-left: 1px;
  }
  #regBox .el-button {
        color: #ffebcd;
        margin-top:20px;
    }
    #regBox .el-input{
        color: blanchedalmond;
        margin-top:20px;
        --el-input-focus-border-color: #ffebcd;
        --el-input-text-color: #ffebcd;
        --el-input-placeholder-color: #ffebcd;
    }
    #regBox .el-input__wrapper{
        background-color: #0000007e;
    }
    .el-loading-mask{
        border-radius:10px;
        background: rgb(46 36 36 / 70%);
    }
</style>
<script lang="ts" setup>
import { ref } from 'vue';
import router from '../router/index'
import { ElMessage, ElNotification, ElLoading } from 'element-plus';
import axios from 'axios';
import { GetStatusCode,isPassedVerifictionInt } from '../../modules/StatusCodeParser.js';
import { SetCookie } from '../../modules/CookieHelper.js';
const eMail = ref('')
const userName = ref('')
const verification = ref('')
const passWord = ref('')
const dialogVisible = ref(false)
const isLoading = ref(false);
const getCode = () => {
    const loginContainerInstance = document.getElementById("regBox");
    const loadingInstance = ElLoading.service({target: loginContainerInstance, text: "少女祈祷中..", background: '#FFFFFF'});
    axios.get(`/api?type=verification&email=${eMail.value}&key=register`)
      .then(function(Response){
          loadingInstance.close();
          const ResponseCode = GetStatusCode(Response)
          if (isPassedVerifictionInt(ResponseCode,200) == true){
              SetCookie('token',Response['data']['token'])
              ElMessage.success("发送成功")
          }else{
              if (ResponseCode == 423){
                  ElMessage.error("IP黑名单，请稍后再试")
              }else{
                  ElMessage.error("您好像还没有填写邮箱捏！")
              }
          }
      })
}
const RegButtonClicked = () => {
  if (userName.value == '' && passWord.value =='' && verification.value ==''){
      ElMessage.error('用户名，密码和验证码不可为空')
  }else{
      const loginContainerInstance = document.getElementById("regBox");
      const loadingInstance = ElLoading.service({target: loginContainerInstance, text: "少女祈祷中..", background: '#FFFFFF'});
      axios.get(`/api?type=register&email=${eMail.value}&username=${userName.value}&code=${verification.value}&password=${passWord.value}`)
      .then(function(Response){
          loadingInstance.close();
          const ResponseCode = GetStatusCode(Response)
          if (isPassedVerifictionInt(ResponseCode,200) == true){
              SetCookie('token',Response['data']['token'])
              ElMessage.success("登陆成功")
              router.push('/')
          }else{
              if (ResponseCode == 423){
                  ElMessage.error("IP黑名单，请稍后再试")
              }else{
                  ElMessage.error("用户名、密码或验证码错误")
              }
          }
      })
      .catch(function(){
          ElNotification.error({title: "错误", message: "无法连接到后端服务，请联系墨守"})
      })
  }
}
</script>