<template>
  <el-config-provider :locale="language"><router-view></router-view></el-config-provider>
</template>

<style>
:root{
  font-family: 'HYWenHei 75W',Inter, Avenir, Helvetica, Arial, sans-serif;
  height: 100%;
  width: 100%;
}
#app{
  width: 100%;
  height: 100%;
}
</style>

<script>
import { ref } from 'vue'
const language = ref('zh-cn')
export default {
  name: "App",
};

</script>