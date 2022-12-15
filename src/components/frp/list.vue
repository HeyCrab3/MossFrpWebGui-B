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
            <h2>激活码列表  <el-button  @click="router.push('/code/add')">新建穿透码</el-button></h2>  
            <input id="copy" style="visibility: hidden"/>
            <el-table v-loading="isTableLoading" empty-text="没有激活码诶 快去创建一个罢" :data="tableData" style="width: 90%;height:100%;margin-left:20px" max-height="100%">
              <el-table-column fixed prop="node" label="节点" width="150" />
              <el-table-column prop="activity" label="活动创建码" width="120" />
              <el-table-column prop="number" label="序号" width="120" />
              <el-table-column prop="code" label="穿透码" width="200" ><template #default="scope"><el-tooltip content="鼠标双击可以全选激活码复制">{{scope.row.code}}</el-tooltip></template></el-table-column>
              <el-table-column prop="ID" label="唯一标识符" width="120" />
              <el-table-column prop="band" label="带宽" width="60" />
              <el-table-column prop="outdated" label="过期时间" width="400" />
              <el-table-column prop="status" label="状态" width="120" ><template #default="scope"><el-tag>{{scope.row.status}}</el-tag></template></el-table-column>
              <el-table-column fixed="right" label="操作">
                <template #default="scope">
                <el-button style="margin-left:2px;margin-top:4px" type="success" size="small" @click.prevent="bandCode(scope.$index)">升配</el-button>
                <el-button style="margin-left:2px;margin-top:4px" type="primary" size="small" @click.prevent="renewCode(scope.$index)">续期</el-button>
                <el-button style="margin-left:2px;margin-top:4px" type="danger" size="small" @click.prevent="deleteCode(scope.$index)">删除</el-button> 
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
</template>
  
<script lang="ts" setup>
import { Menu as IconMenu, House,Setting, Cpu, Shop, Wallet, ArrowDown,ArrowRight, Delete } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import { ref, markRaw } from 'vue';
import { GetStatusCode, isPassedVerifictionInt } from '../../modules/StatusCodeParser';
import { GetCookie } from '../../modules/CookieHelper';
import axios from 'axios';
import { Action, ElMessage, ElMessageBox } from 'element-plus';
import router from '../router';
const route = useRoute();
let username = ref('**');
let email = ref('**')
let tableData = ref(null);
let isTableLoading = ref(true);

const logout = () => {
  ElMessageBox.confirm('确认退出登录？','退出登录')
  .then(function(){
    RemoveCookie('token')
    router.push('/login')
    ElMessage.success('您已退出登录')
  })
}

const deleteCode = (index: number) => {
  var val = tableData.value[index];
  ElMessageBox.confirm(
    `您正在尝试删除编号为 ${val['node']}-${val['number']} 的穿透码，此操作一经确认无法撤销！是否确认删除？`,
    '警告',
    {
      type: 'warning',
      icon: markRaw(Delete),
      confirmButtonText: '确认删除',
      cancelButtonText: '不',
      callback: (action: Action) => {
      if (action == "confirm"){
        axios.get(`/api?type=removeCode&token=${GetCookie('token')}&node=${val['node']}&number=${val['number']}`)
        .then(function(Response){
          const ResponseCode = GetStatusCode(Response);
          if (isPassedVerifictionInt(ResponseCode,200) == true){
              ElMessage.success(`删除穿透码成功！已退回${Response.data['coin']}银币`)
              window.location.reload();
          }else{
              if (ResponseCode == 423){
                  ElMessage.error("⚡您请求的太快啦！请一分钟后再试噢 ！⚡")
              }
              else if(ResposeCode == "401"){
                  ElMessage.error("您还没有登录噢！")
                  router.push('/login')
              }
              else{
                ElMessage.error(`删除失败：${Response.data['message']}`)
              }
          }
      })
      }
    },
    }
  )
}

const renewCode = (index: number) => {
  var val = tableData.value[index];
  ElMessageBox.prompt(`为编号为 ${val['node']}-${val['number']} 的穿透码续期，在下方输入天数`,'续期穿透码')
  .then(({ value }) => {
    axios.get(`/api?type=dateCode&token=${GetCookie('token')}&node=${val['node']}&number=${val['number']}&date=${value}`)
        .then(function(Response){
          const ResponseCode = GetStatusCode(Response);
          if (isPassedVerifictionInt(ResponseCode,200) == true){
              ElMessage.success(`续期穿透码成功！已扣除${Response.data['coin']}银币`)
              window.location.reload();
          }else{
              if (ResponseCode == 423){
                  ElMessage.error("⚡您请求的太快啦！请一分钟后再试噢 ！⚡")
              }
              else if(ResposeCode == "401"){
                  ElMessage.error("您还没有登录噢！")
                  router.push('/login')
              }
              else{
                ElMessage.error(`删除失败：${Response.data['message']}`)
              }
          }
      })
  })
}

const bandCode = (index: number) => {
  var val = tableData.value[index];
  ElMessageBox.prompt(`为编号为 ${val['node']}-${val['number']} 的穿透码升配，在下方输入增加的带宽（Mbps）**注意不是增加到的带宽，是增加的带宽**`,'升配穿透码')
  .then(({ value }) => {
    axios.get(`/api?type=bandCode&token=${GetCookie('token')}&node=${val['node']}&number=${val['number']}&band=${value}`)
        .then(function(Response){
          const ResponseCode = GetStatusCode(Response);
          if (isPassedVerifictionInt(ResponseCode,200) == true){
              ElMessage.success(`升配穿透码成功！已扣除${Response.data['coin']}银币`)
              window.location.reload();
          }else{
              if (ResponseCode == 423){
                  ElMessage.error("⚡您请求的太快啦！请一分钟后再试噢 ！⚡")
              }
              else if(ResposeCode == "401"){
                  ElMessage.error("您还没有登录噢！")
                  router.push('/login')
              }
              else{
                ElMessage.error(`删除失败：${Response.data['message']}`)
              }
          }
      })
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

axios.get(`/api?type=userCode&token=${GetCookie('token')}`)
.then(function(Response){
  const ResponseCode = GetStatusCode(Response);
    if (isPassedVerifictionInt(ResponseCode,200) == true){
      var codeList = [];
      for (var i=0;i<Response['data']['codeList'].length;i++){
          var a = Response['data']['codeList'][i]
          console.log(Response['data']['codeData'][a])
          var globalItem = Response['data']['codeData'][a];
          // 墨守我谢谢你
          let bread = ref(globalItem['activity'])
          let apple = ref(globalItem['status'])
          // 判断激活码是不是活动创建（此种激活码不允许删除）
          if (bread == false){
            bread.value = "否"
          }else{
            bread.value = "否"
          }
          // 判断激活码状态
          if (apple == "run"){
            apple.value = "正常运行"
          }
          else if (apple == "banned"){
            apple.value = "封禁"
          }
          else if (apple == "outdated"){
            apple.value = "过期"
          }
          var outdatedTime = new Date(parseInt(globalItem['stop']));
          const outDatedTime = outdatedTime.toLocaleDateString().replace(/\//g, "/") + " " + outdatedTime.toTimeString()
          var data = {"ID": globalItem['ID'], "node": globalItem['node'], "code": globalItem['code'], "number": globalItem['number'], "band": globalItem['band'], "status": apple.value, "activity": bread.value, "outdated": outDatedTime};
          codeList.push(data)
      }
      console.log(codeList)
      tableData.value = codeList;
      isTableLoading = false;
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
.el-button{
    margin-left: 69.4%;
    margin-top: -0.1%;
}
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
  