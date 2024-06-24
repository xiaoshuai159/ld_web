<template>
  <div ref="chartsRef" class="echarts" />
</template>
<script lang="ts" setup>
import service from '@/api/request';
import * as echarts from 'echarts'
import { EChartsType } from 'echarts/core'
import { nextTick, onMounted, ref, reactive,PropType, watch} from 'vue'
import dayjs from 'dayjs';
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

let colorList = ['#46ea91', '#2ba0ff', '#ed593b', '#7357ff', '#f2d750']
let xData = ref([])
let sjData = ref([])
let tyData = ref([])


let chart: EChartsType
const initChart = () => {
  const chart = echarts.init(chartsRef.value)
  const options = {
    title: {
      text: '漏洞类型数量变化', // 设置标题文本
      textStyle: {
        fontSize: '18',
        color: '#5fe5ff',
      },
      top: '10',
      left: '10',
    },
    // legend: {
    //   icon: 'circle',
    //   top: '5%',
    //   right: '5%',
    //   itemWidth: 6,
    //   itemGap: 5,
    //   textStyle: {
    //     color: '#fff',
    //     padding: [3, 0, 0, 0],
    //   },
    // },
    tooltip: {
      trigger: 'axis',
      // backgroundColor: 'rgba(0,0,0,0.7)',
      borderWidth: 0,
      // borderColor: 'rgba(0,0,0,0.7)',
      // formatter: (name, val) => {
      //   const tipHtml = `
      //                <div class="m-info" style=" opacity: 0.95;font-size: 12px; color: white;" >
      //                    <div class="title" ></div>
      //                    <div class="title" >漏洞类型数量：${name[0].data}万</div>
      //            </div>`
      //   return tipHtml
      // },
    },
    grid: {
      top: '25%',
      left: '3%',
      right: '4%',
      bottom: '4%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: xData.value,
        axisLine: {
          lineStyle: {
            color: '#33BBFF',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: '#5FBBEB',
          },
          // 默认x轴字体大小
          fontSize: 12,
          // margin:文字到x轴的距离
          margin: 10,
          rotate: 45,
        },
        axisPointer: {
          label: {
            // padding: [11, 5, 7],
            padding: [0, 0, 0, 0],
            // 这里的margin和axisLabel的margin要一致!
            margin: 10,
            // 移入时的字体大小
            fontSize: 12,
            backgroundColor: 'rgba(0,0,0,0)',
          },
        },
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        name: '单位（类）',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#05D5FF',
          },
        },
        axisLabel: {
          textStyle: {
            color: '#5FBBEB',
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '事件型漏洞',
        type: 'line',
        data: sjData.value,
        symbolSize: 1,
        symbol: 'circle',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
            {
              offset: 0,
              color: '#fc937e ',
            },
            {
              offset: 1,
              color: '#ed593b',
            },
          ]),
          shadowColor: 'rgb(252, 147, 126,.3)',
          shadowBlur: 2,
          shadowOffsetY: 2,
        },
        itemStyle: {
          normal: {
            color: colorList[2],
            borderColor: colorList[2],
          },
        },
      },

      {
        name: '通用型漏洞',
        type: 'line',
        data: tyData.value,
        symbolSize: 1,
        symbol: 'circle',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
            {
              offset: 0,
              color: '#ffeb86',
            },
            {
              offset: 1,
              color: '#f2d750',
            },
          ]),
          shadowColor: 'rgba(255, 235, 134, .5)',
          shadowBlur: 5,
          shadowOffsetY: 5,
        },
        itemStyle: {
          normal: {
            color: colorList[4],
            borderColor: colorList[4],
          },
        },
      },
    ],
  }
  chart.setOption(options)
  return chart
}
onMounted(() => {
  getVulTypeAPI()

})
const getVulTypeAPI = async () => {
  const { data: res } = await service.get("/api/v1/get_vul_type_trend")
  const eventData = res.data["事件型漏洞"];
  const commonData = res.data["通用型漏洞"];

  xData.value = (eventData.map(entry => dayjs(entry.date).format('YYYY-MM-DD'))).reverse();
  tyData.value = (commonData.map(entry => entry.num)).reverse();
  sjData.value = (eventData.map(entry => entry.num)).reverse();
  nextTick(() => {
    chart = initChart()
    window.addEventListener('resize', function () {
      chart && chart.resize()
    })
  })

}
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
