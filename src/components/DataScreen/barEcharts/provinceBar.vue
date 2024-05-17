<template>
  <div ref="chartsRef" class="echarts" />
</template>
<script setup lang="ts">
  import BarCharts from './components/bar.vue'
  import * as echarts from 'echarts'
  import { EChartsType } from 'echarts/core'
  import { onMounted, ref, reactive } from 'vue'
  const chartsRef = ref<HTMLElement | null>()
  const data = [240, 224, 218, 135, 100, 82, 66]
  const color = ['#59dcc1', '#09a4ea', '#e98f4d', '#ea8e49', '#fa796f', '#54c1fb', '#ca6cd4']
  const dataOptions = []

  data.forEach((item, index) => {
    let obj = {
      value: data[index],
      itemStyle: {
        color: color[index],
      },
    }
    dataOptions.push(obj)
  })

  const options = {
    title: {
      text: '省份排行', // 设置标题文本
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
      data: ['广东省', '河南省', '山东省', '山西省', '陕西省', '北京市', '上海市'],
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
    series: [
      {
        name: '漏洞种类排名',
        data: dataOptions,
        type: 'bar',
        barMaxWidth: 18,
        markLine: {
          silent: true,
        },
      },
    ],
  }

  let chart: EChartsType
  const initChart = () => {
    const chart = echarts.init(chartsRef.value)
    chart.setOption(options)
    return chart
  }
  onMounted(() => {
    chart = initChart()
    window.addEventListener('resize', function () {
      chart && chart.resize()
    })
  })
</script>
<style lang="scss" scoped>
  .echarts {
    height: 100%;
    width: 100%;
  }
</style>
