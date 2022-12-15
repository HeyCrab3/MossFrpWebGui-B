<template>
  <div class="background">
    <div id="loginBox" v-loading="isLoading">
        <h2 style="font-size:var(--el-font-size-extra-large)">请登陆您的账户</h2>
        <el-input ref="v1" v-model="userName" placeholder-color="#ffebcd" placeholder="邮箱" />
        <el-input ref="v2" type="password" v-model="passWord" placeholder="密码" />
        <el-button @click="LoginButtonClicked" type="primary" size="large" color="#114514">登录</el-button>
        <el-button type="text" @click="dialogVisible = true" color="#114514">忘记密码？</el-button>
        <el-button disabled aria-label="暂缓制作" type="text">注册账户</el-button>
        <el-dialog v-model="dialogVisible" title="忘记密码？" width="30%"><span>如果您记得自己的密码却显示密码错误，这是由于后端密码加密格式的更改，请在<strong>私信</strong>中回复指令 #更新信息 重置密码才能欢迎回家 ，博士🥰</span><br/><span>如果您忘记了密码，请在<strong>私信</strong>中回复指令 #更新信息 重置密码。</span><template #footer><span class="dialog-footer"><el-button type="primary" size="large" color="#114514" @click="dialogVisible = false">好</el-button></span></template></el-dialog>
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
    #loginBox{

        color: blanchedalmond;
        float:right;
        width:20%;
        padding:10px 15px;
        margin-top: 13%;
        height: 40%;
        margin-right: 25%;
        border-radius:10px;
        transform: translate(-200px);
        background: rgb(46 36 36 / 70%);
        box-shadow: 0px 15px 25px #00000020;
    }
    #loginBox .el-button {
        color: #ffebcd;
        margin-top:20px;
    }
    #loginBox .el-input{
        color: blanchedalmond;
        margin-top:20px;
        --el-input-focus-border-color: #ffebcd;
        --el-input-text-color: #ffebcd;
        --el-input-placeholder-color: #ffebcd;
    }
    #loginBox .el-input__wrapper{
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
const userName = ref('')
const passWord = ref('')
const dialogVisible = ref(false)
const isLoading = ref(false);
const LoginButtonClicked = () => {
    if (userName.value == '' && passWord.value ==''){
        ElMessage.error('用户名或密码不可为空噢！🙅‍♂️')
    }else{
        const loginContainerInstance = document.getElementById("loginBox");
        const loadingInstance = ElLoading.service({target: loginContainerInstance, text: "少女祈祷中...",  background: 'rgba(0, 0, 0, 0.7)',});
        axios.get(`/api?type=login&loginType=email&account=${userName.value}&password=${passWord.value}`)
        .then(function(Response){
            loadingInstance.close();
            const ResponseCode = GetStatusCode(Response)
            if (isPassedVerifictionInt(ResponseCode,200) == true){
                SetCookie('token',Response['data']['token'])
                ElMessage.success("欢迎回家 ，博士🥰")
                router.push('/')
            }else{
                if (ResponseCode == 423){
                    ElMessage.error("⚡您请求的太快啦！请一分钟后再试噢 ！⚡")
                }else{
                    ElMessage.error("唔，你的账号密码是不是错了捏🤔")
                }
            }
        })
        .catch(function(){
            ElNotification.error({title: "错误", message: "唔，API 貌似无法访问呢！😶‍🌫️"})
        })
    }
}
</script>