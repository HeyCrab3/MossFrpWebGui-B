<template>
    <el-container class="main-layout">
      <el-aside width="200px">
          <el-menu :default-active="route.path" :router="true">
            <el-menu-item index="/"><el-icon><house/></el-icon>主页</el-menu-item>
            <el-menu-item index="/status"><el-icon><Cpu /></el-icon>节点状态</el-menu-item>
            <el-menu-item index="/code"><el-icon><IconMenu /></el-icon>激活码列表</el-menu-item>
            <el-menu-item index="/tunnel"><el-icon><IconMenu /></el-icon>隧道列表</el-menu-item>
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
            <h2>隧道管理 </h2>  
            <div class="bar">
                穿透码 <el-select style="margin-left:20px;margin-top:-6px; margin-right: 20px;" v-model="a" class="m-2" placeholder="选择穿透码"  no-data-text="你还没有穿透码，快去创建一个吧"><el-option v-for="item in tableData" :key="item" :label="item" :value="item"/></el-select>
                类型 <el-input style="margin-left:20px;margin-top:-6px; margin-right: 20px;" v-model="e" placeholder="TCP/UDP"></el-input>
                本地地址（不加端口）<el-input style="margin-left:20px;margin-top:-6px; margin-right: 20px;" v-model="b"></el-input>
                本地端口 <el-input style="margin-left:20px;margin-top:-6px; margin-right: 20px;" min="1" max="65535" v-model="c" type="number"></el-input>
                远程端口 <el-input placeholder="穿透码里告诉你了" style="margin-left:20px;margin-top:-6px; margin-right: 20px;" min="1" max="65535" v-model="d" type="number"></el-input>
                <el-button @click="startTunnel" style="margin-left: 20px; margin-top: -6px" type="success" :loading="isStarting" :disabled="isStarted">{{text}}</el-button>
            </div>
            <div id="terminal">

            </div>
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
import * as fs from 'fs';
import * as path from 'path';
import { GetStatusCode, isPassedVerifictionInt } from '../../modules/StatusCodeParser';
import { GetCookie } from '../../modules/CookieHelper';
import axios from 'axios';
import { ElNotification } from 'element-plus';
import { Action, ElMessage, ElMessageBox } from 'element-plus';
import router from '../router';
import { Terminal } from 'xterm';

const route = useRoute();
let username = ref('**');
let gold = ref('--');
let silver = ref('--')
let email = ref('**')
let userId = ref('0')
let tableData = ref(null);
let a = ref('')
let b = ref(null);
let c = ref(null);
let d = ref(null)
let e = ref(null)
let isStarting = ref(false)
let text = ref('启动穿透进程')
let isStarted = ref(false);

const logout = () => {
  ElMessageBox.confirm('确认退出登录？','退出登录')
  .then(function(){
    RemoveCookie('token')
    router.push('/login')
    ElMessage.success('您已退出登录')
  })
}

function downloadFrpc(){
    text.value = "下载 Frpc"
    try{
        const { DownloaderHelper } = require('node-downloader-helper')
        const downloadInstance = new DownloaderHelper(__dirname, 'http://qd2.mossfrp.cn:9000/client-release/frpc.exe')
        downloadInstance.on('end', () => {ElMessage.success('成功：frpc.exe 下载完成'); writeFrpConfig()})
        downloadInstance.start();
    }catch(err){
        console.error(err)
        text.value = ref('重试')
        ElMessage.error('发生错误！')
        isStarting.value = false;
    }
}

function writeFrpConfig(){
    text.value = ref('正在写配置')
    const config = `
    [common]
    server_addr = ${a.value.substring(1,4)}
    server_port = ${a.value.substring(28,34)}
    token = ${a.value.substring(0,22)}

    [client]
    type = ${e.value}
    local_ip = ${b.value}
    local_port = ${c.value}
    remote_port = ${d.value}
    `
    const file = path.resolve(__dirname, './frp/frpc.ini')
    fs.writeFile(file, config, { encoding: 'utf-8' }, err => {ElMessage.error('发生错误：' + err)})
    startFrpc()
}

function startFrpc(){
    text.value = "正在启动...";
    const terminalInstance = new Terminal();
    terminalInstance.open(document.getElementById('terminal'))
    terminalInstance.write('正在启动 frpc...')
    const child_process = require("child_process");
    const script = (function(data) {
        console.log(data);
    }).toString();
    const node = child_process.spawn(`${__dirname}\\frp.exe`, ["-c", `${__dirname}\\frpc.ini`], {
        stdio: 'pipe'
    });
    node.stdout.on('data', data => {
        console.log(data.toString())
        terminalInstance.write(data.toString())
    })
    isStarted.value = true;
    isStarting.value = false;
    text.value = "已启动"
}

const startTunnel = () => {
    console.log(__dirname)
    if (a.value == '' && b.value == '' && c.value == '' && d.value == ''){
        ElMessage.error('你最好不要把那几个输入框留空，不然会被系统撅')
    }
    else{
        isStarting.value = ref(true);
        text.value = "正在检查环境"
        fs.access('frpc.exe', fs.constants.F_OK, (err) => {
            if (err){
                downloadFrpc();
            }else{
                writeFrpConfig();
            }
        });
    }
}

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

axios.get(`/api?type=userCode&token=${GetCookie('token')}&getAsList=true`)
.then(function(Response){
  const ResponseCode = GetStatusCode(Response);
    if (isPassedVerifictionInt(ResponseCode,200) == true){
      var codeList = [];
      for (var i=0; i < Response.data['codeData'].length; i++){
        codeList.push(`${Response.data['codeData'][i]['code']} - 可用端口 ${Response.data['codeData'][i]['port']}(+10) - 节点 ${Response.data['codeData'][i]['node']}`)
      }
      console.log(codeList)
      tableData.value = codeList;
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

#terminal{
    max-width: 80%;
    height: 400px ;
    margin-left: 20px;
    margin-top: 20px;
    border-radius:5px;
    background: #232323
}

.bar{
    margin-left: 20px;
    padding: 10px 5px;
}

.bar .el-input{
    max-width: 10%;
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
  