<template>
    <van-nav-bar title="登录"/>
    <div class="loginBox">
        <h2>请登陆您的账户</h2>
        <van-cell-group inset>
            <van-field
            v-model="qq"
            name="QQ号"
            label="QQ号"
            placeholder="QQ号"
            :rules="[{ required: true, message: '请填写QQ' }]"
            />
            <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
            />
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit" @click="LoginButtonClicked">
            登录
            </van-button>
        </div>
    </div>
</template>
<style>
    .loginBox{
        text-align: center;
    }
</style>
<script lang="ts" setup>
import axios from 'axios';
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
import { SetCookie } from '../../modules/CookieHelper';
import { GetStatusCode, isPassedVerifictionInt } from '../../modules/StatusCodeParser';
import router from '../router';
import { showFailToast, showSuccessToast, showLoadingToast } from 'vant';
    let qq = ref(null)
    let password = ref(null)
    const LoginButtonClicked = () => {
    if (qq.value == '' && password.value ==''){
        showFailToast('用户名和密码不能为空')
    }else{
        showLoadingToast({ message: '少女祈祷中...', forbidClick: true })
        axios.get(`/api?type=login&loginType=QQ&account=${qq.value}&password=${password.value}`)
        .then(function(Response){
            const ResponseCode = GetStatusCode(Response)
            if (isPassedVerifictionInt(ResponseCode,200) == true){
                SetCookie('token',Response['data']['token'])
                showSuccessToast('登陆成功')
                router.push('/m')
            }else{
                if (ResponseCode == 423){
                    showFailToast('IP黑名单，请稍后再试')
                }else{
                    showFailToast('用户名或密码错误')
                }
            }
        })
        .catch(function(){
            ElNotification.error({title: "错误", message: "无法连接到后端服务，请联系墨守"})
        })
    }
}
</script>