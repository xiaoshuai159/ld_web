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
const data = ref([])
let xData = ref([])
const color = ['#59dcc1', '#09a4ea', '#e98f4d', '#ea8e49', '#fa796f', '#54c1fb', '#ca6cd4']
const dataOptions = []
const options = {
  title: {
    text: '漏洞分布排行', // 设置标题文本
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
    trigger: 'axis',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 0,
    borderColor: 'rgba(0,0,0,0.7)',
    formatter: (name, val) => {
      const tipHtml = `
                       <div class="m-info" style=" opacity: 0.95;font-size: 12px; color: white;" >
                           <div class="title" ></div>
                           <div class="title" >数量：${name[0].value}</div>
                   </div>`
      return tipHtml
    },
  },
  yAxis: {
    type: 'value', // 将 y 轴类型设为 value
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
  xAxis: {
    type: 'category', // 将 x 轴类型设为 category
    data: xData.value,
    // 设置坐标轴的 文字样式
    axisLabel: {
      color: '#bbdaff',
      margin: 20, // 刻度标签与轴线之间的距离。
      rotate: 45,
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
      name: "数量",
      type: "pictorialBar",
      symbolSize: [20, 8],//调整截面形状
      symbolOffset: [0, 2],
      z: 12,
      itemStyle: {
        "normal": {
          color: '#0075ec'
        }
      },
      data: dataOptions
    },
    //柱体
    {
      name: '数量',
      type: 'bar',
      barWidth: 20,
      itemStyle: {
        // shadowOffsetX: 200,
        // shadowOffsetY: 200,
        "normal": {
          "color": {
            "x": 0,
            "y": 0,
            "x2": 0,
            "y2": 1,
            "type": "linear",
            "global": false,
            "colorStops": [{//第一节下面
              "offset": 0,
              "color": "#026ee7"
            }, {
              "offset": 1,
              "color": "#06cffa"
            }]
          }
        }
      },
      showBackground: true,
      backgroundStyle: {
        color: "#001246"
      },
      data: dataOptions
    },
    //柱顶圆片
    {
      name: "数量",
      type: "pictorialBar",
      symbolSize: [20, 8],//调整截面形状
      symbolOffset: [0, -6],
      z: 12,
      symbolPosition: "end",
      itemStyle: {
        normal: {
          color: '#01b0f2',
        }
      },
      label: {
        show: true,
        position: "top",
        color: "#fff",
        fontSzie: 14
      },
      data: dataOptions
    }
  ],
}

let chart: EChartsType
const initChart = () => {
  const chart = echarts.init(chartsRef.value)
  chart.setOption(options)
  return chart
}
onMounted(() => {
  getProvinceAPI()
  chart = initChart()
  window.addEventListener('resize', function () {
    chart && chart.resize()
  })
})
const getProvinceAPI = async () => {
  const { data: res } = await service.get("/api/v1/get_provinces")
  res.data.forEach(item => {
    // 将日期字符串格式化为所需格式
    xData.value.push(item.province); // 将格式化后的日期字符串添加到 xData 数组中
    data.value.push(item.vul_num); // 将 vul_num 值添加到 yData 数组中

  });
  data.value.forEach((item, index) => {
    let obj = {
      value: data.value[index],
      itemStyle: {
        // color: color[index],
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
