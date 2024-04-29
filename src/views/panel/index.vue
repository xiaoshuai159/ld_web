<template>
  <div class="app-container">
    <div class="app-container-inner">
      <!-- Header start ------------------------- -->
      <el-row>
        <el-col :span="6">
          <div class="container">
            <div class="circle" style="background-color: #b7bace">
              <svg
                t="1713406679891"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="1465"
                width="20"
                height="20"
              >
                <path
                  d="M940 512H792V412c76.8 0 139-62.2 139-139 0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 34.8-28.2 63-63 63H232c-34.8 0-63-28.2-63-63 0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 76.8 62.2 139 139 139v100H84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h148v96c0 6.5 0.2 13 0.7 19.3C164.1 728.6 116 796.7 116 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-44.2 23.9-82.9 59.6-103.7 6 17.2 13.6 33.6 22.7 49 24.3 41.5 59 76.2 100.5 100.5S460.5 960 512 960s99.8-13.9 141.3-38.2c41.5-24.3 76.2-59 100.5-100.5 9.1-15.5 16.7-31.9 22.7-49C812.1 793.1 836 831.8 836 876c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-79.3-48.1-147.4-116.7-176.7 0.4-6.4 0.7-12.8 0.7-19.3v-96h148c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM716 680c0 36.8-9.7 72-27.8 102.9-17.7 30.3-43 55.6-73.3 73.3-20.1 11.8-42 20-64.9 24.3V484c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v396.5c-22.9-4.3-44.8-12.5-64.9-24.3-30.3-17.7-55.6-43-73.3-73.3C317.7 752 308 716.8 308 680V412h408v268z"
                  p-id="1466"
                ></path>
                <path
                  d="M304 280h56c4.4 0 8-3.6 8-8 0-28.3 5.9-53.2 17.1-73.5 10.6-19.4 26-34.8 45.4-45.4C450.9 142 475.7 136 504 136h16c28.3 0 53.2 5.9 73.5 17.1 19.4 10.6 34.8 26 45.4 45.4C650 218.9 656 243.7 656 272c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8 0-40-8.8-76.7-25.9-108.1-17.2-31.5-42.5-56.8-74-74C596.7 72.8 560 64 520 64h-16c-40 0-76.7 8.8-108.1 25.9-31.5 17.2-56.8 42.5-74 74C304.8 195.3 296 232 296 272c0 4.4 3.6 8 8 8z"
                  p-id="1467"
                ></path>
              </svg>
            </div>
            <div class="text">
              <div class="top-text">漏洞数量</div>
              <div class="bottom-text">{{ bugNum }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="container">
            <div class="circle" style="background-color: #aec9de">
              <svg
                t="1713406825408"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2536"
                width="20"
                height="20"
              >
                <path
                  d="M497.69083 562.529258L3.577293 281.264629 497.69083 0l522.731877 281.264629zM93.009607 281.264629l404.681223 229.841048 427.486463-229.841048-426.59214-230.28821z"
                  fill="#0F3567"
                  p-id="2537"
                ></path>
                <path
                  d="M497.69083 793.264629L3.577293 512l148.01048-84.066376 21.910917 38.903057-79.59476 45.163319 404.681223 229.841048 427.486463-229.841048-90.773799-48.740611 21.463755-39.350219 163.661135 88.09083-522.731877 281.264629z"
                  fill="#0F3567"
                  p-id="2538"
                ></path>
                <path
                  d="M497.69083 1024L3.577293 742.735371l131.465502-74.675982 22.358078 38.903056-63.496943 35.772926 404.681223 230.28821 427.486463-230.28821-67.968559-36.667249 21.016594-39.350218 141.303056 76.017467-522.731877 281.264629z"
                  fill="#0F3567"
                  p-id="2539"
                ></path>
              </svg>
            </div>
            <div class="text">
              <div class="top-text">资产数量</div>
              <div class="bottom-text">{{ propertyNum }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="container">
            <div class="circle" style="background-color: #f6e1c0">
              <svg
                t="1713406899122"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3557"
                width="20"
                height="20"
              >
                <path
                  d="M663.808 212.16c1.408 0.384 2.752 0.768 4.16 1.152 20.096 5.632 29.504 28.608 19.2 46.528-19.136 33.408-38.464 66.688-57.728 99.968-77.824 134.848-155.648 269.632-233.472 404.544-3.136 5.44-6.848 10.176-12.224 13.44-3.456 2.112-7.296 3.392-11.2 4.352-0.512 0.128-1.024 0.384-1.472 0.64-2.752 0-5.504 0-8.256 0-1.024-0.384-2.048-0.768-3.072-1.024-15.424-3.776-25.6-17.152-24.896-32.896 0.192-4.992 1.6-9.728 4.096-14.144 57.536-99.712 115.136-199.36 172.672-299.072 39.616-68.672 79.296-137.28 118.848-205.952 3.84-6.656 8.832-11.904 15.936-14.848 2.368-0.96 4.864-1.472 7.36-2.176 0.448-0.128 0.832-0.32 1.216-0.512C657.92 212.16 660.864 212.16 663.808 212.16z"
                  p-id="3558"
                ></path>
                <path
                  d="M64.064 496.64c0.384-0.832 0.896-1.6 1.088-2.432 1.408-6.272 4.48-11.584 8.96-16.064 55.616-55.616 111.232-111.296 166.912-166.848 9.152-9.152 20.416-11.776 32.64-7.808 12.352 3.968 19.712 12.8 21.76 25.6 1.664 10.56-1.408 19.968-9.088 27.648C247.744 395.328 209.088 433.92 170.432 472.576 159.68 483.328 148.928 494.08 138.176 504.896 137.664 505.408 137.152 505.92 136.576 506.56 137.28 507.392 137.92 508.096 138.624 508.8c49.216 49.216 98.432 98.432 147.648 147.648 17.6 17.6 9.984 47.296-14.016 53.76-11.776 3.2-22.4 0.448-31.168-8.192-10.432-10.304-20.736-20.736-31.104-31.104C165.12 625.984 120.192 581.056 75.2 536.128 70.08 531.072 66.432 525.44 65.024 518.336c-0.128-0.64-0.64-1.28-0.96-1.856C64.064 509.824 64.064 503.232 64.064 496.64z"
                  p-id="3559"
                ></path>
                <path
                  d="M958.72 518.08c-0.32 1.088-0.64 2.24-0.96 3.328-1.536 5.12-4.224 9.472-8 13.312-18.816 18.816-37.568 37.696-56.32 56.512-6.336 6.4-12.672 12.736-19.008 19.136-22.272 22.336-44.544 44.672-66.816 67.008-8.192 8.256-16.256 16.64-24.64 24.768-9.344 9.024-20.544 11.584-32.768 7.552-12.352-4.096-19.648-13.056-21.568-26.048-1.536-10.624 1.792-19.712 9.344-27.264 24.32-24.448 48.64-48.832 72.96-73.28 20.928-20.992 41.792-41.984 62.72-62.976 4.416-4.416 8.896-8.704 13.568-13.312-0.832-0.896-1.408-1.536-2.048-2.176-10.88-10.944-21.76-21.824-32.576-32.768-28.096-28.16-56.192-56.384-84.288-84.544-10.304-10.304-20.736-20.544-30.848-31.04-8.64-8.96-11.392-19.776-7.744-31.744 3.648-11.904 11.904-19.456 24.064-22.08 11.392-2.432 21.44 0.768 29.696 9.024 22.4 22.464 44.8 44.992 67.2 67.456 24.896 25.024 49.856 50.048 74.752 75.008 8.192 8.256 16.448 16.448 24.64 24.768 4.224 4.352 7.232 9.408 8.128 15.552 0.064 0.256 0.32 0.448 0.448 0.64C958.72 502.656 958.72 510.4 958.72 518.08z"
                  p-id="3560"
                ></path>
              </svg>
            </div>
            <div class="text">
              <div class="top-text">探测脚本数量</div>
              <div class="bottom-text">{{ scriptNum }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="container">
            <div class="circle" style="background-color: #d4d2fb">
              <svg
                t="1713406995341"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4598"
                width="20"
                height="20"
              >
                <path
                  d="M831.825474 63.940169H191.939717C121.2479 63.940169 63.940169 121.2479 63.940169 191.939717v639.885757C63.940169 902.517291 121.2479 959.825022 191.939717 959.825022h639.885757c70.691817 0 127.999548-57.307731 127.999548-127.999548V191.939717C959.825022 121.2479 902.517291 63.940169 831.825474 63.940169zM895.884854 831.998871A63.835408 63.835408 0 0 1 831.912173 895.884854H192.087827c-17.112123 0-33.270563-6.574639-45.372232-18.67631S127.880338 849.110994 127.880338 831.998871V192.001129A64.236389 64.236389 0 0 1 192.087827 127.880338h639.824346A64.037705 64.037705 0 0 1 895.884854 192.001129v639.997742z"
                  fill=""
                  p-id="4599"
                ></path>
                <path
                  d="M791.998335 351.851551h-255.999097a31.970084 31.970084 0 0 0 0 63.940169h255.999097a31.970084 31.970084 0 0 0 0-63.940169zM791.998335 607.973471h-255.999097a31.970084 31.970084 0 0 0 0 63.940169h255.999097a31.970084 31.970084 0 0 0 0-63.940169zM344.001722 527.997686c-61.855792 0-111.985607 50.144265-111.985607 111.985606s50.144265 111.985607 111.985607 111.985607 111.985607-50.144265 111.985606-111.985607-50.129815-111.985607-111.985606-111.985606z m33.982213 145.982269a48.045438 48.045438 0 1 1 14.088511-33.982213 47.745605 47.745605 0 0 1-14.088511 33.985826zM417.395643 297.394035L311.999125 402.78694 270.6078 361.392003a31.970084 31.970084 0 1 0-45.213286 45.213285l63.997968 64.001581a31.970084 31.970084 0 0 0 45.213286 0l127.999548-127.999549a31.970084 31.970084 0 0 0-45.209673-45.213285z"
                  fill=""
                  p-id="4600"
                ></path>
              </svg>
            </div>
            <div class="text">
              <div class="top-text">任务数量</div>
              <div class="bottom-text">{{ taskNum }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- Header end ------------------------- -->
      <el-divider />
      <!-- middle start ------------------------ -->
      <el-row>
        <el-col :span="11">
          <div style="height: 200px; padding: 10px 0px">
            <div
              id="myhistogram1"
              style="width: 96%; margin: 0 auto; border: 1px Dashed #797979; height: 96%; border-radius: 15px; padding-top: 10px"
            >
            </div>
          </div>
        </el-col>
        <el-col :span="13">
          <div style="height: 200px; padding: 10px 0px">
            <div style="position: relative; float: right; transform: translate(-20px, 5px); z-index: 99 !important">
              <el-radio-group v-model="radio" size="small" @change="changeRadio">
                <el-radio-button label="近一周" value="近一周" />
                <el-radio-button label="月度" value="月度" />
              </el-radio-group>
            </div>
            <div
              id="mylinechart"
              style="width: 96%; margin: 0 auto; border: 1px Dashed #797979; height: 96%; border-radius: 15px; padding-top: 10px"
            >
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div style="height: 600px; padding: 10px 0px">
            <div
              id="myMap"
              style="width: 96%; margin: 0 auto; border: 1px Dashed #797979; height: 96%; border-radius: 15px; padding-top: 10px"
            >
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="12">
              <div style="height: 290px; padding: 10px 0px">
                <div
                  id="myPieChart1"
                  style="width: 94%; margin: 0 auto; border: 1px Dashed #797979; height: 96%; border-radius: 15px; padding-top: 10px"
                >
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="height: 290px; padding: 10px 0px">
                <div
                  id="myPieChart2"
                  style="width: 92%; margin: 0 auto; border: 1px Dashed #797979; height: 96%; border-radius: 15px; padding-top: 10px"
                >
                </div>
              </div>
            </el-col>
          </el-row>
          <div>
            <div style="height: 290px; padding: 10px 0px">
              <div
                id="mylineChart2"
                style="width: 96%; margin: 0 auto; border: 1px Dashed #797979; height: 92%; border-radius: 15px; padding-top: 10px"
              >
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- middle end -------------------------- -->
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import china from '@/assets/china.json'
  import * as echarts from 'echarts'
  import service from '@/api/request'
  onMounted(() => {
    loadAPI()
  })
  const loadAPI = () => {
    let xData = ['信息泄露', '文件包含', '命令注入', '弱口令爆破', '远程代码执行']
    let yData = ['123440', '118966', '35678', '25858', '15865']
    drawHistogram1(xData.reverse(), yData.reverse())
    let xData2 = [202401, 202402, 202403, 202404, 202405, 202406, 202407, 202408, 202409, 202410, 202411, 202412]
    let yData2 = [1435, 1243, 1023, 1411, 932, 2335, 2031, 1509, 1523, 2476, 2045, 1689]
    radio.value = '近一周'
    let xData3 = [20240101, 20240102, 20240103, 20240104, 20240105, 20240106]
    let yData3 = [932, 2335, 2031, 1509, 1523, 2476, 2045]
    drawlineChart(xData2, yData2)
    let data = [
      { name: '北京市', value: 6 },
      { name: '吉林省', value: 1 },
      { name: '上海市', value: 16 },
      { name: '长春市', value: 6 },
      { name: '重庆市', value: 1 },
      { name: '杭州市', value: 16 },
      { name: '甘肃省', value: 6 },
      { name: '深圳市', value: 1 },
      { name: '沈阳市', value: 16 },
    ]
    drawmapChart(data)
    let pieData = [
      { name: '北京市', value: 6 },
      { name: '吉林省', value: 1 },
      { name: '上海市', value: 16 },
      { name: '长春市', value: 6 },
      { name: '重庆市', value: 1 },
      { name: '杭州市', value: 16 },
      { name: '甘肃省', value: 6 },
      { name: '深圳市', value: 1 },
      { name: '沈阳市', value: 16 },
    ]
    drawPiechart1(pieData)
    let pieData2 = [
      { name: '北京市', value: 6 },
      { name: '吉林省', value: 1 },
      { name: '上海市', value: 16 },
      { name: '长春市', value: 6 },
      { name: '重庆市', value: 1 },
      { name: '杭州市', value: 16 },
      { name: '甘肃省', value: 6 },
      { name: '深圳市', value: 1 },
      { name: '沈阳市', value: 16 },
    ]
    drawPiechart2(pieData2)
    let xData4 = [20240101, 20240102, 20240103, 20240104, 20240105, 20240106]
    let yData4 = [932, 2335, 2031, 1509, 1523, 2476, 2045]
    drawlineChart2(xData4, yData4)
  }
  // Header start ----------------------
  let bugNum = ref('15213012')
  let propertyNum = ref('10256387')
  let scriptNum = ref('2623')
  let taskNum = ref('2589')
  // Header end ------------------------

  // middle start ------------------------
  let radio = ref('近一周')
  const changeRadio = (value) => {
    if (value == '近一周') {
      let xData2 = [202401, 202402, 202403, 202404, 202405, 202406, 202407, 202408, 202409, 202410, 202411, 202412]
      let yData2 = [1435, 1243, 1023, 1411, 932, 2335, 2031, 1509, 1523, 2476, 2045, 1689]
      drawlineChart(xData2, yData2)
    } else {
      let xData3 = [20240101, 20240102, 20240103, 20240104, 20240105, 20240106]
      let yData3 = [932, 2335, 2031, 1509, 1523, 2476, 2045]
      drawlineChart(xData3, yData3)
    }
  }
  function drawHistogram1(xData, yData) {
    if (document.getElementById('myhistogram1') == null) {
      return
    }
    echarts.dispose(document.getElementById('myhistogram1'))
    const myChart = echarts.init(document.getElementById('myhistogram1'))
    let option = {
      title: {
        // 添加标题配置项
        text: '漏洞数量TOP5', // 设置标题文本
        textStyle: {
          fontSize: '14',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross', // 将type设置为'cross'
          label: {
            backgroundColor: '#6e7079',
          },
        },
      },
      // legend: {},
      grid: {
        top: '14%',
        left: '3%',
        right: '5%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        // boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: xData,
      },

      series: [
        {
          name: '漏洞种类排名',
          type: 'bar',
          data: yData,
        },
      ],
    }
    option && myChart.setOption(option)
  }
  function drawlineChart(xData, yData) {
    const mylineChart = echarts.init(document.getElementById('mylinechart'))
    let option = {
      title: {
        // 添加标题配置项
        text: '漏洞数量趋势变化', // 设置标题文本
        textStyle: {
          fontSize: '14',
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: '26%',
        left: '3%',
        right: '5%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
      },
      yAxis: {
        type: 'value',
        name: '单位（万）',
      },
      series: [
        {
          name: '漏洞数量',
          type: 'line',
          stack: 'Total',
          data: yData,
        },
      ],
    }
    option && mylineChart.setOption(option)
  }
  function drawmapChart(data) {
    let chinaChart = echarts.init(document.getElementById('myMap'))
    echarts.registerMap('china', { geoJSON: china })
    let option = {
      title: {
        // 添加标题配置项
        text: '地域分布图', // 设置标题文本
        textStyle: {
          fontSize: '14',
        },
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1,
        scaleLimit: {
          min: 1,
          max: 3,
        },
      },
      series: [
        {
          type: 'map',
          geoIndex: 0,
          data: data,
        },
      ],
      tooltip: {
        formatter(params) {
          if (params.data == undefined) {
            return `${params.name}<br/>数量：0`
          } else {
            return `${params.data.name}<br/>数量：${params.data.value}`
          }
        },
      },
      visualMap: {
        min: 0,
        max: 20,
        inRange: {
          color: ['rgb(69,182,69)', '#fff', 'rgb(235,60,60)'],
        },
      },
    }
    chinaChart.setOption(option)
    window.addEventListener('resize', function () {
      chinaChart && chinaChart.resize()
    })
  }
  function drawPiechart1(data) {
    if (document.getElementById('myPieChart1') == null) {
      return
    }
    echarts.dispose(document.getElementById('myPieChart1'))
    const pie_chart1 = echarts.init(document.getElementById('myPieChart1'))
    let option = {
      title: {
        // 添加标题配置项
        text: '漏洞危害性占比', // 设置标题文本
        textStyle: {
          fontSize: '14',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '14%',
        orient: 'vertical',
        right: 'right',
      },
      series: [
        {
          name: '数量',
          type: 'pie',
          radius: ['35%', '60%'],
          center: ['36%', '50%'],
          avoidLabelOverlap: false,
          padAngle: 2,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 26,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    }
    option && pie_chart1.setOption(option)
  }
  function drawPiechart2(data) {
    if (document.getElementById('myPieChart2') == null) {
      return
    }
    echarts.dispose(document.getElementById('myPieChart2'))
    const pie_chart1 = echarts.init(document.getElementById('myPieChart2'))
    let option = {
      title: {
        // 添加标题配置项
        text: '漏洞来源厂商', // 设置标题文本
        textStyle: {
          fontSize: '14',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '14%',
        orient: 'vertical',
        right: 'right',
      },
      series: [
        {
          name: '数量',
          type: 'pie',
          radius: ['35%', '60%'],
          center: ['36%', '50%'],
          avoidLabelOverlap: false,
          padAngle: 2,
          itemStyle: {
            borderRadius: 10,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 26,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    }
    option && pie_chart1.setOption(option)
  }
  function drawlineChart2(xData, yData) {
    const mylineChart = echarts.init(document.getElementById('mylineChart2'))
    let option = {
      title: {
        // 添加标题配置项
        text: '漏洞类型数量变化', // 设置标题文本
        textStyle: {
          fontSize: '14',
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: '26%',
        left: '3%',
        right: '5%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
      },
      yAxis: {
        type: 'value',
        name: '单位（万）',
      },
      series: [
        {
          name: '漏洞数量',
          type: 'line',
          stack: 'Total',
          data: yData,
        },
      ],
    }
    option && mylineChart.setOption(option)
  }
  // middle end --------------------------
</script>
<style lang="scss" scoped>
  // Header start ----------------------
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 20px;
    padding: 8px 0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    /* 添加阴影样式 */
  }

  .circle {
    width: 50px;
    height: 50px;
    // background-color: #b7bace;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text {
    margin-left: 20px;
    /* 可以根据需要调整间距 */
  }

  .top-text {
    font-size: 12px;
    color: #79797b;
  }

  .bottom-text {
    font-size: 24px;
  }

  // Header end ------------------------

  .el-divider--horizontal {
    margin-top: 16px;
    margin-bottom: 4px;
  }
</style>
