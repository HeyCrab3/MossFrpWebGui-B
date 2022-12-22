<template>
    <el-container class="main-layout">
      <el-aside width="200px">
          <el-menu :default-active="route.path" :router="true">
            <el-menu-item disabled>MossFrp 控制台</el-menu-item>
            <el-menu-item index="/"><el-icon><house/></el-icon>主页</el-menu-item>
            <el-menu-item index="/status"><el-icon><Cpu /></el-icon>节点状态</el-menu-item>
            <el-menu-item index="/code"><el-icon><IconMenu /></el-icon>激活码列表</el-menu-item>
            <el-menu-item index="/store"><el-icon><Shop /></el-icon>商店</el-menu-item>
            <el-menu-item index="/settings"><el-icon><Setting /></el-icon>个人设置</el-menu-item>
          </el-menu>
      </el-aside>
  
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <div class="toolbar">
            <el-dropdown>
              <el-icon style="margin-right: 8px; margin-top: 1px"
                ><setting
              /></el-icon>
              <template #dropdown>
              </template>
            </el-dropdown>
            <el-dropdown><span class="el-dropdown-link"><span id="userName">欢迎您，{{username}}</span><el-icon class="el-icon--right"><arrow-down /></el-icon></span><template #dropdown><el-dropdown-menu><a href="https://afdian.net/@HeyCrab" target="_blank"><el-dropdown-item>打赏螃蟹</el-dropdown-item></a><el-dropdown-item @click="logout">退出登录</el-dropdown-item></el-dropdown-menu></template></el-dropdown>
        </div>
        </el-header>
  
        <el-main>
          <el-scrollbar>
            <h2>个人设置</h2>
            <div style="margin-left:20px">
              <el-avatar :icon="UserFilled" />
              <span style="margin-left: 20px;">您好，{{username}}</span>
              <el-collapse style="margin-top: 20px">
                <el-collapse-item title="您的用户信息" name="1">
                  <div>
                    用户名：{{username}}<br/>
                    UID：{{userId}}<br/>
                    金币：{{gold}}<br/>
                    银币：{{silver}}<br/>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="更改用户名" name="2">
                  <div>
                    <el-input v-model="input1" style="width: 40%; display:block; margin-top: 20px;" placeholder="新用户名"></el-input>
                    <el-input v-model="input2" style="width: 40%; display:inline-block; margin-top: 20px;" placeholder="邮件验证码"></el-input>
                    <el-button style="margin-left:20px;" :disabled="isSended" :loading="isSending" @click="sendVerificationCode">{{ButtonData}}</el-button>
                    <el-button style="display: block; margin-top: 20px" type="primary" size="large" @click="updateUserName">更新</el-button>
                  </div>
                  <div>
                    如查收不到邮件验证码，请检查垃圾箱
                  </div>
                </el-collapse-item>
                <el-collapse-item title="Efficiency" name="3">
                  <div>
                    Simplify the process: keep operating process simple and intuitive;
                  </div>
                  <div>
                    Definite and clear: enunciate your intentions clearly so that the
                    users can quickly understand and make decisions;
                  </div>
                  <div>
                    Easy to identify: the interface should be straightforward, which helps
                    the users to identify and frees them from memorizing and recalling.
                  </div>
                </el-collapse-item>
                <el-collapse-item title="Controllability" name="4">
                  <div>
                    Decision making: giving advices about operations is acceptable, but do
                    not make decisions for the users;
                  </div>
                  <div>
                    Controlled consequences: users should be granted the freedom to
                    operate, including canceling, aborting or terminating current
                    operation.
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
</template>
  
<script lang="ts" setup>
import { Menu as IconMenu, House,Setting, Cpu, Shop, Wallet, ArrowDown,ArrowRight, Delete, UserFilled } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import { ref, markRaw } from 'vue';
import { GetStatusCode, isPassedVerifictionInt } from '../../modules/StatusCodeParser';
import { GetCookie, RemoveCookie } from '../../modules/CookieHelper';
import axios from 'axios';
import { Action, ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import router from '../router';
const route = useRoute();
let username = ref('**');
let gold = ref('--');
let silver = ref('--')
let userId = ref('0')
let email = ref('**')
let isSended = ref(false)
let isSending = ref(false)
let input1 = ref(null)
let input2 = ref(null)
let input3 = ref(null)
let input4 = ref(null)
let input5 = ref(null)
let ButtonData = ref('发送验证码')

const logout = () => {
  ElMessageBox.confirm('确认退出登录？','退出登录')
  .then(function(){
    RemoveCookie('token')
    router.push('/login')
    ElMessage.success('您已退出登录')
  })
}

const updateUserName = () => {
  axios.get(`/api?type=infoUpdate&key=username&value=${input1.value}&code=${input2.value}&token=${GetCookie('token')}`)
  .then(function(Response){
    const ResponseCode = GetStatusCode(Response);
    if (isPassedVerifictionInt(ResponseCode,200) == true){
        ElMessage.success('已更新用户名！刷新后生效')
    }else{
        if (ResponseCode == 423){
            ElMessage.error("IP黑名单，请稍后再试")
        }else{
            ElMessage.error(Response['data']['message'])
        }
    }
  })
  .catch(function(Response){
    ElNotification.error('恭喜您中奖了！无法连接到服务器')
  })
}

const sendVerificationCode = () => {
  isSended.value = true;
  isSending.value = true;
  axios.get(`/api?type=verification&email=${email.value}&key=infoUpdate`)
  .then(function(Response){
    const ResponseCode = GetStatusCode(Response);
    if (isPassedVerifictionInt(ResponseCode,200) == true){
        ElMessage.success('已发送验证码！请查看邮箱')
    }else{
        if (ResponseCode == 423){
            ElMessage.error("IP黑名单，请稍后再试")
        }else{
            ElMessage.error("未登录")
            router.push('/login')
        }
    }
  })
  .catch(function(Response){
    ElNotification.error('恭喜您中奖了！无法连接到服务器')
  })
}

axios.get(`/api?type=userInfo&token=${GetCookie('token')}`)
.then(function(Response){
    const ResponseCode = GetStatusCode(Response);
    if (isPassedVerifictionInt(ResponseCode,200) == true){
        var userData = Response['data']['userInfo']
        username.value = userData['username']
        gold.value = userData['gold']
        silver.value = userData['silver']
        userId.value = userData['userID']
        email.value = userData['email']
    }else{
        if (ResponseCode == 423){
            ElMessage.error("⚡您请求的太快啦！请一分钟后再试噢 ！⚡")
        }else{
            ElMessage.error("您还没有登录噢！")
            router.push('/login')
        }
    }
})
</script>
  
<style scoped>
.main-layout .el-header {
  position: relative;
}
.main-layout{
    height: 100%;
}
.main-layout .el-menu{
    height: 100%;
}

.card{
    width:300px;
    margin-left:20px;
    margin-top:10px;
    border:0;
    border-radius:10px;
    background: linear-gradient(135deg,#02dd2a,#1ae78b);
    color: #FFF;
    display: inline-block
}

.card a{
    color:#FFF;
}

.main-layout .el-main {
  padding: 0;
}
.main-layout .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  right: 20px;
  height:100%;
}

.main-layout h2{
  margin-left: 20px;
}
</style>
  