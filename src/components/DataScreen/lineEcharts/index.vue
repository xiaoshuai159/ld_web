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
let xData = ref([])
let yData = ref([])

const options = {
  title: {
    text: '漏洞数量趋势变化', // 设置标题文本
    textStyle: {
      fontSize: '18',
      color: '#5fe5ff',
    },
    top: '10',
    left: '10',
  },
  grid: {
    top: '25%',
    left: '3%',
    right: '4%',
    bottom: '4%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0.7)',
    formatter: (name, val) => {
      const tipHtml = `
                     <div class="m-info" style=" opacity: 0.95;font-size: 12px; color: white;" >
                         <div class="title" ></div>
                         <div class="title" >漏洞数量：${name[0].data}</div>
                 </div>`
      return tipHtml
    },
  },
  yAxis: {
    // 设置坐标轴的 文字样式
    axisLabel: {
      color: '#bbdaff',
      margin: 20, // 刻度标签与轴线之间的距离。
    },
    // 坐标轴轴线相关设置。
    splitLine: {
      lineStyle: {
        color: '#2d5baf',
      },
    },
    type: 'value',
    name: '单位（万）',
    nameTextStyle: {
      color: '#58d0fa', // 设置单位名称的字体颜色
    },
  },
  xAxis: {
    splitLine: {
      show: false,
    },
    // 坐标轴轴线相关设置。
    axisLine: {
      lineStyle: {
        color: '#2d5baf',
      },
    },
    type: 'category',
    data: xData.value,
    axisLabel: {
      // 设置坐标轴的 文字样式
      color: '#bbdaff',
      margin: 20, // 刻度标签与轴线之间的距离。
    },
    boundaryGap: false, // 设置坐标轴两边的留白 ，从刻度原点开始，
    axisTick: {
      // 取消坐标轴刻度线
      show: false,
    },
  },
  series: [
    {
      name: '今日',
      type: 'line',
      symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
      showAllSymbol: true,
      symbolSize: 10,
      lineStyle: {
        normal: {
          width: 4,
          color: "#6c50f3", // 线条颜色
        },
      },
      itemStyle: {
        color: "#6c50f3",
        borderWidth: 3,
        borderColor: "#fff"
      },
      label: {
        show: true,
      },
      data: yData.value
    },
    // {
    //   data: [154, 230, 224, 218, 135, 147, 260],
    //   type: 'line',
    //   // smooth:false,   //关键点，为true是不支持虚线的，实线就用true
    //   symbolSize: 12, // 拐点圆的大小
    //   symbol: 'circle',
    //   markLine: {
    //     silent: true,
    //   },
    //   itemStyle: {
    //     normal: {
    //       color: '#920783', // 设置 symbol的颜色
    //       lineStyle: {
    //         width: 3,
    //         color: '#920783',
    //         type: 'solid', // 'dotted'虚线 'solid'实线
    //       },
    //     },
    //   },
    // },
  ],
}

let chart: EChartsType
const initChart = () => {
  const chart = echarts.init(chartsRef.value)
  chart.setOption(options)
  return chart
}
onMounted(() => {
  getVulTrendAPI()

})
const getVulTrendAPI = async () => {
  const { data: res } = await service.get("/api/v1/get_vul_num_trend")
  if (res.code == 200) {
    res.data.forEach(item => {
      // 将日期字符串格式化为所需格式
      const formattedDate = dayjs(item.date).format('YYYY-MM-DD');
      xData.value.push(formattedDate); // 将格式化后的日期字符串添加到 xData 数组中
      yData.value.push(item.vul_num); // 将 vul_num 值添加到 yData 数组中
      chart = initChart()
      window.addEventListener('resize', function () {
        chart && chart.resize()
      })
    });
  }

}
</script>
<style lang="scss" scoped>
.echarts {
  height: 100%;
  width: 100%;
}
</style>
