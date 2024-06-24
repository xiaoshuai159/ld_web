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
let legendData = ['主动探测', '关联入库'];
let xAxisData = ref([])
let seriesData = ref([])
let seriesData1 = ref([])


let chart: EChartsType
const initChart = () => {
   const chart = echarts.init(chartsRef.value)
   const options = {
      title: {
         text: '漏洞资产发现趋势', // 设置标题文本
         textStyle: {
            fontSize: '18',
            color: '#5fe5ff',
         },
         top: '10',
         left: '10',
      },
      tooltip: {
         trigger: 'axis',
         axisPointer: {
            type: 'shadow'
         }
         //   trigger: 'axis',
         //   backgroundColor: 'rgba(0,0,0,0.7)',
         //   borderWidth: 0,
         //   borderColor: 'rgba(0,0,0,0.7)',
         //   formatter: (name, val) => {
         //     const tipHtml = `
         //                  <div class="m-info" style=" opacity: 0.95;font-size: 12px; color: white;" >
         //                      <div class="title" ></div>
         //                      <div class="title" >数量：${name[0].data}</div>
         //              </div>`
         //     return tipHtml
         //   },
      },
      grid: {
         top: '25%',
         left: '3%',
         right: '4%',
         bottom: '4%',
         containLabel: true,
      },
      legend: {
         icon: 'rect',
         right: "right",
         top: '2%',
         itemWidth: 7, // 设置宽度
         itemHeight: 7, // 设置高度
         itemGap: 15, // 设置间距
         textStyle: { //图例文字的样式
            color: '#89BFE5',
            fontSize: 12
         }
      },
      xAxis: {
         boundaryGap: true,
         data: xAxisData.value,
         axisLine: {
            lineStyle: {
               color: "rgba(117, 168, 202, 0.4)"
            }
         },
         axisTick: {
            show: false
         },
         axisLabel: {
            color: '#fff'
         }
      },
      yAxis: [{
         // name: '单位：个',
         // type: "value",
         inverse: false,
         splitLine: {
            show: true,
            lineStyle: {
               color: 'rgba(117, 168, 202, 0.3)',
               type: 'dashed'
            }
         },
         axisLine: {
            show: false,
            lineStyle: {
               color: "#0A5C95"
            }
         },
         axisLabel: {
            formatter: "{value}",
            textStyle: {
               color: '#89BFE5',
               fontSize: 12
            }
         },
         nameTextStyle: {
            color: '#89BFE5',
            padding: [0, 0, 0, 15],
            fontSize: 12
         },
         axisTick: {
            show: false
         }
      }],
      series: [
         {
            name: legendData[0],
            type: "line",
            symbol: 'circle', //设定为实心点
            showAllSymbol: true,
            symbolSize: 5,
            smooth: true,
            itemStyle: {
               normal: {
                  color: `#2BDFD4`,
                  lineStyle: { //线的颜色
                     color: `#2BDFD4`,
                     width: 1.5
                  },
                  areaStyle: {
                     //type: 'default',
                     //旧版渐变色实现
                     // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, //变化度
                     //    //三种由深及浅的颜色
                     //    [{
                     //       offset: 0,
                     //       color: 'rgba(1, 180, 255, 0.2)'
                     //    }, {
                     //       offset: 1,
                     //       color: 'rgba(1, 180, 255, 0.1)'
                     //    }])

                     //新版渐变色实现
                     color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                           {
                              offset: 0,
                              color: 'rgba(1, 180, 255, 0.2)'
                           },
                           {
                              offset: 1,
                              color: 'rgba(1, 180, 255, 0.1)'
                           }
                        ]
                     }
                  },
               }
            },
            data: seriesData.value
         },
         {
            name: legendData[1],
            type: "line",
            symbol: 'circle', //设定为实心点
            showAllSymbol: true,
            symbolSize: 5,
            smooth: true,
            itemStyle: {
               normal: {
                  color: `#FFD076`,
                  lineStyle: { //线的颜色
                     color: `#FFD076`,
                     width: 1.5
                  },
                  areaStyle: {
                     //旧版渐变色实现
                     // type: 'default',                 
                     // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, //变化度
                     //    //三种由深及浅的颜色
                     //    [{
                     //       offset: 0,
                     //       color: 'rgba(255, 223, 4, 0.2)'
                     //    }, {
                     //       offset: 1,
                     //       color: 'rgba(255, 223, 4, 0.1)'
                     //    }])
                     //新版渐变色实现
                     color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                           {
                              offset: 0,
                              color: 'rgba(255, 223, 4, 0.2)'
                           },
                           {
                              offset: 1,
                              color: 'rgba(255, 223, 4, 0.1)'
                           }
                        ]
                     }
                  },
               }
            },
            data: seriesData1.value
         }
      ]
   }
   chart.setOption(options)
   return chart
}
onMounted(() => {
   getTrendAPI()
   // chart = initChart()
   // window.addEventListener('resize', function () {
   //    chart && chart.resize()
   // })
})
const getTrendAPI = async () => {
   const { data: res } = await service.get('/api/v1/get_trend')
   if (res.code == 200) {
      const searchData = res.data["search"];
      const detectData = res.data["detect"];
      let legendData = ['主动探测', '关联入库'];
      let xData = searchData.map(item => item.date)
      let tyData = searchData.map(item => item.num)
      let sjData = detectData.map(item => item.num)
      xAxisData.value = xData.reverse()
      seriesData.value = sjData.reverse()
      seriesData1.value = tyData.reverse()
      chart = initChart()
      window.addEventListener('resize', function () {
         chart && chart.resize()
      })
   }
}
</script>
<style lang="scss" scoped>
.echarts {
   height: 100%;
   width: 100%;
}
</style>