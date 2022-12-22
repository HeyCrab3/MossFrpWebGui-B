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
          <el-scrollbar >
            <h2>激活码列表  <el-button @click="centerDialogVisible = true">新建穿透码</el-button></h2>  
            <el-dialog v-model="centerDialogVisible"  title="新建穿透码" width="40%" height="30%"  align-center>
              <el-container>
        <el-main>
          <el-scrollbar v-loading="isCreating">
            <strong style="margin-left: 20px;margin-top:10px;display:block; color: #FF0000;">禁止使用穿透服务搭建以下服务：爆破、漏洞注入、VPN、游戏私服，发现立即封禁隧道</strong>
            <div style="margin-left:20px;">
              <el-row><span class="ml-3 w-35 text-gray-600 inline-flex items-center">节点</span><el-select style="margin-left:20px;margin-top:-6px;" v-model="a" class="m-2" placeholder="选择节点"  no-data-text="这里不应该没有数据"><el-option v-for="item in listV" :key="item.value" :label="item.label" :value="item.value"/></el-select></el-row>
              <el-row>
                <span style="margin-top:5px;" class="ml-3 w-35 text-gray-600 inline-flex items-center">带宽</span><el-input min="1" type="number" v-model="band" style="margin-left:20px; width: 7em;" ></el-input><span style="margin-top:7px;margin-left:10px;" class="ml-3 w-35 text-gray-600 inline-flex items-center">Mbps</span>
              </el-row>
              <el-row>
                <span style="margin-top:5px;" class="ml-3 w-35 text-gray-600 inline-flex items-center"><el-tooltip content="时长不可小于3天，大于360天">时长</el-tooltip></span><el-input min="3" max="360" type="number" maxlength="3" v-model="time" style="margin-left:20px; width: 7em;" ></el-input><span style="margin-top:6px;margin-left:10px;" class="ml-3 w-35 text-gray-600 inline-flex items-center">天</span>
              </el-row>
              <el-row><el-button @click="centerDialogVisible = false;createCode();" type="primary" size="large">创建激活码</el-button></el-row>
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
  </el-dialog>
            <input id="copy" style="visibility: hidden"/>
            <el-table v-loading="isTableLoading" empty-text="没有激活码诶 快去创建一个罢" :data="tableData" style="width: 90%;height:100%;margin-left:20px" max-height="100%">
              <el-table-column fixed prop="node" label="节点" width="150" />
              <el-table-column prop="number" label="序号" width="120" />
              <el-table-column prop="code" label="穿透码" width="200" ><template #default="scope"><el-tooltip content="鼠标双击可以全选激活码复制">{{scope.row.code}}</el-tooltip></template></el-table-column>
              <el-table-column prop="band" label="带宽" width="60" />
              <el-table-column prop="outdated" label="过期时间" width="400" />
              <el-table-column prop="status" label="状态" width="120" ><template #default="scope"><el-tag>{{scope.row.status}}</el-tag></template></el-table-column>
              <el-table-column prop="activity" label="活动创建码" width="120" />

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
import {createApp} from 'vue'
import { ref, markRaw } from 'vue';
import { GetStatusCode, isPassedVerifictionInt } from '../../modules/StatusCodeParser';
import { GetCookie } from '../../modules/CookieHelper';
import axios from 'axios';
import { ElNotification } from 'element-plus';
import { Action, ElMessage, ElMessageBox } from 'element-plus';
import router from '../router';
const route = useRoute();
let username = ref('**');
let gold = ref('--');
let silver = ref('--')
let email = ref('**')
let userId = ref('0')
let tableData = ref(null);
let isTableLoading = ref(true);
let a = ref('')
let listV = ref(null)
let band = ref(null)
let time = ref(3)
let isCreating = ref(false)


const centerDialogVisible = ref(false)

const logout = () => {
  ElMessageBox.confirm('确认退出登录？','退出登录')
  .then(function(){
    RemoveCookie('token')
    router.push('/login')
    ElMessage.success('您已退出登录')
  })
}
const createCode = () => {
  if (a.value == "" || band.value == ""){
    ElMessage.warning('节点或带宽不能为空')
  }else{
    isCreating.value = ref(true)
    axios.get(`/api?type=createCode&token=${GetCookie('token')}&node=${a.value}&date=${time.value}&band=${band.value}`)
    .then(function(Response){
      const ResponseCode = GetStatusCode(Response);
      if (isPassedVerifictionInt(ResponseCode,200) == true){
          isCreating.value = ref(false)
          ElMessage.success('成功')
          ElNotification.success({
            title: '穿透码创建成功！',
            dangerouslyUseHTMLString: true,
            message: `穿透码已创建，扣除了${Response['data']['coin']}银币。\n创建穿透码需要一定的时间，建议您前往<a href="https://doca.mossfrp.top" target="_blank">MossFrp 使用文档</a>学习软件的使用方法。`
          })
          location.reload();
      }else{
        isCreating.value = ref(false)
          if (ResponseCode == 423){
              ElMessage.error("⚡您请求的太快啦！请一分钟后再试噢 ！⚡")
          }
          else if(ResponseCode == 401){
              ElMessage.error("您还没有登录噢！")
              router.push('/login')
          }
          else{
            ElMessage.error(`创建失败：${Response.data['message']}`)
            location.reload();
          }
      }
    })
    .catch(function(){
      ElNotification.error({
        title: "后端服务发生错误",
        message: "Error:无法连接后端服务器，请检查网络连接或联系墨守"
      })
    })
  }
}

axios.get(`/api?type=allNode&token=${GetCookie('token')}`)
.then(function(Response){
  const ResponseCode = GetStatusCode(Response);
    if (isPassedVerifictionInt(ResponseCode,200) == true){
      var nodeList = [];
      for (var i=0;i<Response['data']['nodeList'].length;i++){
          var a = Response['data']['nodeList'][i]
          console.log(Response['data']['nodeData'][a])
          nodeList.push(
            {
              value: Response['data']['nodeList'][i],
              label: Response['data']['nodeData'][a]['node']+'-'+Response['data']['nodeData'][a]['address'],
            }
          )
      }
      listV.value = nodeList;
    }else{
        if (ResponseCode == 423){
            ElMessage.error("⚡您请求的太快啦！请一分钟后再试噢 ！⚡")
        }else{
            ElMessage.error("您还没有登录噢！")
            router.push('/login')
        }
    }
})

axios.get(`/api?type=userInfo&token=${GetCookie('token')}`)
.then(function(Response){
    const ResponseCode = GetStatusCode(Response);
    if (isPassedVerifictionInt(ResponseCode,200) == true){
        var userData = Response['data']['userInfo']
        username.value = userData['username']
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
  ElMessageBox.prompt(`为编号为 ${val['node']}-${val['number']} 的穿透码续期，在下方输入天数**续期的天数需大于等于三天**`,'续期穿透码', {
  confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  .then(({ value }) => {
    axios.get(`/api?type=dateCode&token=${GetCookie('token')}&node=${val['node']}&number=${val['number']}&date=${value}`)
        .then(function(Response){
          const ResponseCode = GetStatusCode(Response);
          if (isPassedVerifictionInt(ResponseCode,200) == true){
              ElMessage.success(`续期穿透码成功！已扣除${Response.data['coin']}银币`)
              window.location.reload();
          }else{
              if (ResponseCode == 423){
                  ElMessage.error("⚡您请 求的太快啦！请一分钟后再试噢 ！⚡")
              }
              else if(ResposeCode == "401"){
                  ElMessage.error("您还没有登录噢！")
                  router.push('/login')
              }
              else {
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
          // 哈哈哈，墨守我谢谢你捏
          let bread = ref(globalItem['activity'])
          let banana = ref(globalItem['status'])
          // 判断激活码是不是活动创建（此种激活码不允许删除）
          if (bread == false){
            bread.value = "否"
          }else{
            bread.value = "否"
          }
          // 判断激活码状态
          if (banana == "run"){
            banana.value = " 运行"
          }
          else if (banana == "banned"){
            banana.value = "封禁"
          }
          else if (banana == "outdated"){
            banana.value = "过期"
          }
          var outdatedTime = new Date(parseInt(globalItem['stop']));
          const outDatedTime = outdatedTime.toLocaleDateString().replace(/\//g, "/") + " " + outdatedTime.toTimeString()
          var data = {"ID": globalItem['ID'], "node": globalItem['node'], "code": globalItem['code'], "number": globalItem['number'], "band": globalItem['band'], "status": banana.value, "activity": bread.value, "outdated": outDatedTime};
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
.dialog-footer button:first-child {
  margin-right: 10px;
}
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


.main-layout h2{
  margin-left: 20px;
}

.el-row{
  margin-top: 20px;
}
</style>
  