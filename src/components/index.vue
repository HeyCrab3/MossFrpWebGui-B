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
            <el-menu-item index="/afdian"><el-icon><Wallet /></el-icon>螃蟹的爱发电</el-menu-item>
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
            <el-alert title="欢迎加入官方群：609996925，螃蟹WebUI群：231254430" type="info" style="margin-left:20px;width: 50%;" show-icon/>
            <el-alert title="测试版WebUI可能会存在部分问题，请加群反馈" type="warning" style="margin-left:20px;width:50%;margin-top:10px" show-icon />
            <el-card class="card">
                <span>欢迎回来，</span>
                <i class="el-icon-edit"><h2>{{username}}</h2></i>
            </el-card>
            <el-card class="card">
                <span>用户UID</span>
                <h2>{{userId}}<a href="/#/settings"><el-icon><ArrowRight /></el-icon></a></h2>
            </el-card>
            <el-card class="card">
                <span>金币</span>
                <h2>{{gold}}<a href="/#/store"><el-icon><ArrowRight /></el-icon></a></h2>
            </el-card>
            <el-card class="card">
                <span>银币</span>
                <h2>{{silver}}<a href="/#/store"><el-icon><ArrowRight /></el-icon></a></h2>
            </el-card>

          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
</template>
  
<script lang="ts" setup>
import { Menu as IconMenu, House,Setting, Cpu, Shop, Wallet, ArrowDown,ArrowRight } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { GetStatusCode, isPassedVerifictionInt } from '../modules/StatusCodeParser';
import { GetCookie, RemoveCookie } from '../modules/CookieHelper';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from './router';
const route = useRoute();
let username = ref('**');
let gold = ref('--');
let silver = ref('--')
let userId = ref('0')
let email = ref('**')
const logout = () => {
  ElMessageBox.confirm('确认退出登录？','退出登录')
  .then(function(){
    RemoveCookie('token')
    router.push('/login')
    ElMessage.success('您已退出登录')
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
            ElMessage.error("IP黑名单，请稍后再试")
        }else{
            ElMessage.error("未登录")
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
</style>
  