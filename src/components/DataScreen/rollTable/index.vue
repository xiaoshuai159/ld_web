<template>
  <div>
    <span style="display: inline-block; color: #7fe6ff; font-size: 18px; font-weight: 600; margin: 10px 0 15px 15px">热门漏洞</span>
    <div class="title_top1">
      <span>漏洞名称</span>
      <span>漏洞类型</span>
      <span>漏洞来源</span>
      <span>发布时间</span>
    </div>
    <div style="width: 100%">
      <vue3-seamless-scroll :list="vulnerabilities" :speed="80" class="seamless-warp1" :class-option="defaultOption">
        <ul style="color: white; margin-left: 0; list-style: none; padding: 0">
          <li v-for="vulnerability in vulnerabilities" :key="vulnerability.vul_name">
            <span>{{ vulnerability.vul_name }}</span>
            <span>{{ vulnerability.vul_type }}</span>
            <span>{{ vulnerability.vul_from }}</span>
            <span>{{ vulnerability.vul_date }}</span>
          </li>
        </ul>
      </vue3-seamless-scroll>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import service from '@/api/request';
  import { Vue3SeamlessScroll } from 'vue3-seamless-scroll' // 导入自定义的无缝滚动逻辑
  import dayjs from 'dayjs'
import { onMounted, ref, reactive,PropType, watch, computed  } from 'vue'
const props = defineProps({
  dateValue: {
    type: String as PropType<string>,
    required: true
  }
});
watch(()=>props.dateValue, (newValue, oldValue) => {
  let formatDate = dayjs(newValue).format('YYYY-MM-DD')
  console.log("子组件的newValue："+formatDate);
},{
    immediate:true
})
  const vulnerabilities = ref([
    // { id: 1, name: '漏洞1', type: '类型1', from: '来源1', date: '2022-01-01' },
    // { id: 2, name: '漏洞2', type: '类型2', from: '来源2', date: '2022-02-01' },
    // { id: 3, name: '漏洞3', type: '类型3', from: '来源3', date: '2022-03-01' },
    // { id: 4, name: '漏洞4', type: '类型4', from: '来源4', date: '2022-04-01' },
    // { id: 5, name: '漏洞5', type: '类型5', from: '来源5', date: '2022-01-01' },
    // { id: 6, name: '漏洞6', type: '类型6', from: '来源6', date: '2022-02-01' },
    // { id: 7, name: '漏洞7', type: '类型7', from: '来源7', date: '2022-03-01' },
    // { id: 8, name: '漏洞8', type: '类型8', from: '来源8', date: '2022-04-01' },
  ])
  // 使用自定义的无缝滚动逻辑
  //   const { startScrolling } = useSeamlessScroll();

  const defaultOption = computed(() => {
    return {
      step: 0.5, // 数值越大速度滚动越快
      limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
      hoverStop: true, // 是否开启鼠标悬停stop
      direction: 1, // 0向下 1向上 2向左 3向右
      openWatch: true, // 开启数据实时监控刷新dom
      singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
      singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
    }
  })
  onMounted(() => {
    getTableAPI()
  })
  const getTableAPI = async () => {
    const {data:res} = await service.get('/api/v1/get_vul_hot')
    
    if(res.code == 200){
      vulnerabilities.value = res.data
    }
  }
</script>

<style lang="scss" scoped>
  .title_top1 {
    width: 100%;
    height: 17%;
    background-color: transparent;
    border: 1px solid #1f436c;
    padding: 1% 0;
  }

  .title_top1 span:nth-child(1) {
    display: inline-block;
    width: 25%;
    line-height: 17%;
    color: #80a2c0;
    text-align: center;
    font-size: 14px;
  }

  .title_top1 span:nth-child(2) {
    display: inline-block;
    width: 16%;
    line-height: 17%;
    color: #80a2c0;
    text-align: center;
    font-size: 14px;
    margin-left: 1%;
  }

  .title_top1 span:nth-child(3) {
    display: inline-block;
    width: 25%;
    line-height: 17%;
    color: #80a2c0;
    text-align: center;
    font-size: 14px;
    margin-left: 3%;
  }

  .title_top1 span:nth-child(4) {
    display: inline-block;
    width: 20%;
    line-height: 17%;
    color: #80a2c0;
    text-align: center;
    font-size: 14px;
    margin-left: 2%;
  }

  .seamless-warp1 ul {
    list-style: none; //去掉标签默认的左边符号
    // display:flex;
    // flex-wrap:wrap;
  }

  .seamless-warp1 {
    height: 170px;
    overflow: hidden;
  }

  .seamless-warp1 li {
    list-style-type: none;
    list-style: none;
    height: 28px;
    line-height: 28px;
    width: 100%;
    border: 1px solid #1f436c;
    // margin-top: 10px;
    box-sizing: border-box;
  }

  .seamless-warp1 span:nth-child(1) {
    display: inline-block;
    width: 25%;
    height: 100%;
    text-align: center;
    font-size: 10px;
    -webkit-transform: scal(0.83);
    overflow: hidden;
  }

  .seamless-warp1 span:nth-child(2) {
    display: inline-block;
    width: 16%;
    margin-left: 1%;
    height: 100%;
    text-align: center;
    font-size: 10px;
    -webkit-transform: scal(0.83);
    overflow: hidden;
  }

  .seamless-warp1 span:nth-child(3) {
    display: inline-block;
    width: 25%;
    margin-left: 3%;
    height: 100%;
    text-align: center;
    font-size: 10px;
    -webkit-transform: scal(0.83);
    overflow: hidden;
  }

  .seamless-warp1 span:nth-child(4) {
    display: inline-block;
    width: 20%;
    margin-left: 2%;
    height: 100%;
    text-align: center;
    font-size: 10px;
    -webkit-transform: scal(0.83);
    overflow: hidden;
  }
</style>
