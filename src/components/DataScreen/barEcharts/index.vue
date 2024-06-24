<template>
  <div ref="chartsRef" class="echarts" />
</template>
<script setup lang="ts">
import service from '@/api/request';
import BarCharts from './components/bar.vue'
import * as echarts from 'echarts'
import { EChartsType } from 'echarts/core'
import dayjs from 'dayjs'
import { onMounted, ref, reactive,PropType, watch  } from 'vue'
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
const chartsRef = ref<HTMLElement | null>()
const data = ref([]) // 100, 135, 218, 224, 230
const color = ['#fa796f', '#54c1fb', '#ca6cd4', '#59dcc1', '#09a4ea', '#e98f4d', '#ea8e49']
const dataOptions = []
let xData = ref([])
let yData = ref([])
data.value.forEach((item, index) => {
  let obj = {
    value: data[index],
    itemStyle: {
      color: color[index],
    },
  }
  dataOptions.push(obj)
})

let chart: EChartsType
const initChart = () => {
  const chart = echarts.init(chartsRef.value)
  const options = {
    title: {
      text: '漏洞数量TOP5', // 设置标题文本
      textStyle: {
        fontSize: '18',
        color: '#5fe5ff',
      },
      top: '10',
      left: '10',
    },
    color,
    grid: {
      top: '19%',
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    tooltip: {
      // trigger: 'axis',
      // backgroundColor: 'rgba(0,0,0,0.7)',
      // borderWidth: 0,
      // borderColor: 'rgba(0,0,0,0.7)',
      // formatter: (name, val) => {
      //   const tipHtml = `
      //                <div class="m-info" style=" opacity: 0.95;font-size: 12px; color: white;" >
      //                    <div class="title" ></div>
      //                    <div class="title" >漏洞种类数量：${vul_type[0].vul_num}</div>
      //            </div>`
      //   return tipHtml
      // },
    },
    yAxis: {
      type: 'category',
      data: xData.value,
      // 设置坐标轴的 文字样式
      axisLabel: {
        color: '#bbdaff',
        margin: 20, // 刻度标签与轴线之间的距离。
      },
      axisTick: {
        // 取消坐标轴刻度线
        show: false,
      },
      // 坐标轴轴线相关设置。
      splitLine: {
        lineStyle: {
          color: '#2d5baf',
        },
      },
    },
    xAxis: {
      type: 'value',
      // type: 'category',
      splitLine: {
        show: false,
      },
      // 坐标轴轴线相关设置。
      axisLine: {
        lineStyle: {
          color: '#2d5baf',
        },
      },

      axisLabel: {
        // 设置坐标轴的 文字样式
        color: '#bbdaff',
        margin: 20, // 刻度标签与轴线之间的距离。
      },
      axisTick: {
        // 取消坐标轴刻度线
        show: false,
      },
    },
    series: [
      // {
      //   name: '漏洞种类排名',
      //   data: dataOptions,
      //   type: 'bar',
      //   barMaxWidth: 18,
      //   markLine: {
      //     silent: true,
      //   },
      // },
      {
        // name: '审限内结案率',
        data: dataOptions,
        type: 'pictorialBar',
        symbol: 'roundRect',
        symbolRepeat: true,
        symbolSize: [20, 7],
        // symbolOffset: symbolOffset,
        // barWidth:'40%',
        itemStyle: {
          color: 'rgba(15, 189, 200, 1)'
        }
      },
    ],
  }
  chart.setOption(options)
  return chart
}
onMounted(() => {
  getVulTopAPI()
  // chart = initChart()
  // window.addEventListener('resize', function () {
  //   chart && chart.resize()
  // })
})
const getVulTopAPI = async () => {
  const { data: res } = await service.get("/api/v1/get_vul_top")
  let sortData = res.data.sort((a, b) => a.vul_num - b.vul_num);
  sortData.forEach(item => {
    xData.value.push(item.vul_type);
    yData.value.push(item.vul_num); // 将 vul_num 值添加到 yData 数组中
  });
  yData.value.forEach((item, index) => {
    let obj = {
      value: yData.value[index],
      itemStyle: {
        color: color[index],
      },
    }
    dataOptions.push(obj)
  })
  chart = initChart()
  window.addEventListener('resize', function () {
    chart && chart.resize()
  })
}
</script>
<style lang="scss" scoped>
.echarts {
  height: 100%;
  width: 100%;
}
</style>
