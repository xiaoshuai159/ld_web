<template>
  <div ref="chartsRef" class="echarts" />
</template>
<script lang="ts" setup>
import service from '@/api/request';
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
var trafficWay = [
  // {
  //   name: 'CNNVD',
  //   value: 30,
  // },
  // {
  //   name: 'CNVD',
  //   value: 20,
  // },
  // {
  //   name: 'WooYun',
  //   value: 18,
  // },
  // {
  //   name: 'SCAP',
  //   value: 15,
  // },
  // { name: 'Seebug', value: 12 },
]

var data = []
let num = ref('')
var color = ['#fd566a', '#9787ff', '#fdb36a', '#fdd56a', '#6da7ff', '#63e1f2', '#ff3000']
// for (var i = 0; i < trafficWay.length; i++) {
//   data.push(
//     {
//       value: trafficWay[i].value,
//       name: trafficWay[i].name,
//       itemStyle: {
//         normal: {
//           borderWidth: 5,
//           shadowBlur: 20,
//           borderColor: color[i],
//           shadowColor: color[i],
//         },
//       },
//     },
//     {
//       value: 2,
//       name: '',
//       itemStyle: {
//         normal: {
//           label: {
//             show: false,
//           },
//           labelLine: {
//             show: false,
//           },
//           color: 'rgba(0, 0, 0, 0)',
//           borderColor: 'rgba(0, 0, 0, 0)',
//           borderWidth: 0,
//         },
//       },
//     })
// }


let chart: EChartsType
const initChart = () => {
  const chart = echarts.init(chartsRef.value)
  var seriesOption = [
    {
      name: '',
      type: 'pie',
      clockWise: false,
      radius: [78, 90], //  改
      // radius: [105, 109],  // 原
      // radius: [50, 55], //  改
      hoverAnimation: false,
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'outside',

            formatter: function (params) {
              var percent = 0
              var total = 0
              for (var i = 0; i < trafficWay.length; i++) {
                total += trafficWay[i].value
              }
              percent = ((params.value / total) * 100).toFixed(0)
              if (params.name !== '') {
                return params.name + '\t' + percent + '%'
              } else {
                return ''
              }
            },
          },
          labelLine: {
            length: 10,
            length2: 20,
            show: true,
            color: '#00ffff',
          },
        },
      },
      data: data,
    },
  ]
  let options = {
    color: color,
    title: [
      {
        text: '漏洞来源厂商',
        top: '44%',
        textAlign: 'center',
        left: '49.50%',
        backgroundColor: '#163253',
        borderRadius: 100,
        textStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: '400',
        },
      },
      {
        text: num.value,
        top: '53%',
        textAlign: 'center',
        left: '44%',
        textStyle: {
          color: '#f6ea2f',
          fontSize: 25,
          fontWeight: '800',
          fontStyle: 'italic',
        },
      },
      {
        text: '个',
        top: '53.5%',
        textAlign: 'center',
        left: '50.5%',
        textStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '400',
        },
      },
    ],
    tooltip: {
      show: true,
    },

    toolbox: {
      show: false,
    },
    series: seriesOption,
  }
  chart.setOption(options)
  return chart
}
onMounted(() => {

  getPieAPI()
})
const getPieAPI = async () => {
  const { data: res } = await service.get('/api/v1/get_pies')
  if (res.code == 200) {

    const pieFromData = res.data['pie_from']
    for (var i = 0; i < pieFromData.length; i++) {
      data.push(
        {
          value: pieFromData[i].vul_num,
          name: pieFromData[i].vul_from,
          itemStyle: {
            normal: {
              // borderWidth: 5,
              shadowBlur: 20,
              borderColor: color[i],
              shadowColor: color[i],
            },
          },
        },
        // {
        //   value: 2,
        //   name: '',
        //   itemStyle: {
        //     normal: {
        //       label: {
        //         show: false,
        //       },
        //       labelLine: {
        //         show: false,
        //       },
        //       color: 'rgba(0, 0, 0, 0)',
        //       borderColor: 'rgba(0, 0, 0, 0)',
        //       borderWidth: 0,
        //     },
        //   },
        // },
      )
    }
    num.value = data.length.toString()
    console.log(data.length);
    chart = initChart()
    window.addEventListener('resize', function () {
      chart && chart.resize()
    })
  }
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
