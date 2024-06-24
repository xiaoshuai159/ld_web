<template>
  <full-screen-container>
    <div class="m-data-screen">
      <div class="header">
        <div class="header-bg-title">漏洞利用威胁发现态势平台</div>
        <div class="date">{{ timeDate }} {{ hourTime }} </div>
        <div class="daohang">
          <div class="right">
            <el-date-picker
              v-model="dateValue"
              type="date"
              placeholder="请选择日期"
              size="small"
              class="dateClass"
              popper-class="popperClass"
              :clearable="false"
            />
            <!-- <el-dropdown>
              <span class="el-dropdown-link">
                Dropdown List
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>Action 1</el-dropdown-item>
                  <el-dropdown-item>Action 2</el-dropdown-item>
                  <el-dropdown-item>Action 3</el-dropdown-item>
                  <el-dropdown-item disabled>Action 4</el-dropdown-item>
                  <el-dropdown-item divided>Action 5</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown> -->
            <!-- <el-dropdown trigger="click" placement="bottom">
              <div class="right-item">
                <i class="el-icon-menu"></i>
                <div class="user-name">主菜单</div>
              </div>
              <el-dropdown-menu #dropdown class="user-dropdown">
                <router-link to="/">
                  <el-dropdown-item> 首页 </el-dropdown-item>
                </router-link>
                <router-link to="/dataOrigin">
                  <el-dropdown-item> 违规判定数据源 </el-dropdown-item>
                </router-link>
                <router-link to="/lawsManage/lawsManage">
                  <el-dropdown-item> 违规判定知识库 </el-dropdown-item>
                </router-link>
                <router-link to="/incidentSearch">
                  <el-dropdown-item> 违规判定结果 </el-dropdown-item>
                </router-link>
                <router-link to="/encryptedTraffic">
                  <el-dropdown-item> 风险告警结果 </el-dropdown-item>
                </router-link>
                <router-link to="/systemManage">
                  <el-dropdown-item> 系统管理 </el-dropdown-item>
                </router-link>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
        </div>
      </div>
      <div class="center">
        <!-- <div v-for="item in 4" class="item">
          <div class="item-icon item-icon1">
            <img src="@/assets/image/circle-bg.png" class="circle-bg" />
          </div>
          <div class="item-right">
            <div class="item-right-inner">
              <div class="text-title">用户访问量</div>
              <div class="text-number"><count-to :start-val="0" :end-val="6285" :duration="4000" separator=""></count-to></div>
              <div class="text-der text-decenter-wrapr">
                <span class="left">同比昨天</span>
                <img src="@/assets/image/allow.png" />
                <span class="right">+78%</span>
              </div>
            </div>
          </div>
        </div> -->
        <div class="item">
          <div class="item-icon item-icon1">
            <img src="@/assets/image/circle-bg.png" class="circle-bg" />
          </div>
          <div class="item-right">
            <div class="item-right-inner">
              <div class="text-title">漏洞数量</div>
              <div class="text-number"><count-to :start-val="0" :end-val="bug_num" :duration="4000"
                  separator=""></count-to>
              </div>
              <div class="text-der text-decenter-wrapr">
                <span class="left">同比昨天</span>
                <!-- <img :src="vulNumChange >= 0 ? '@/assets/image/allow.png' : '@/assets/image/down.png'" /> -->
                <span :style="{ color: vulNumChange >= 0 ? 'red' : 'limegreen' }" class="right">{{ vulNumChange >= 0 ?
                  '+' : '' }}{{ vulNumChange }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-icon item-icon2">
            <img src="@/assets/image/circle-bg.png" class="circle-bg" />
          </div>
          <div class="item-right">
            <div class="item-right-inner">
              <div class="text-title">资产数量</div>
              <div class="text-number"><count-to :start-val="0" :end-val="property_num" :duration="4000"
                  separator=""></count-to></div>
              <div class="text-der text-decenter-wrapr">
                <span class="left">同比昨天</span>
                <!-- <img :src="assetNumChange >= 0 ? '@/assets/image/allow.png' : '@/assets/image/down.png'" /> -->
                <span :style="{ color: assetNumChange >= 0 ? 'red' : 'limegreen' }" class="right">{{ assetNumChange >= 0
                  ? '+' : '' }}{{ assetNumChange }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-icon item-icon3">
            <img src="@/assets/image/circle-bg.png" class="circle-bg" />
          </div>
          <div class="item-right">
            <div class="item-right-inner">
              <div class="text-title">探测脚本数量</div>
              <div class="text-number"><count-to :start-val="0" :end-val="script_num" :duration="4000"
                  separator=""></count-to></div>
              <div class="text-der text-decenter-wrapr">
                <span class="left">同比昨天</span>
                <!-- <img :src="pocNumChange >= 0 ? '@/assets/image/allow.png' : '@/assets/image/down.png'" /> -->
                <span :style="{ color: pocNumChange >= 0 ? 'red' : 'limegreen' }" class="right">{{ pocNumChange >= 0 ?
                  '+' : '' }}{{ pocNumChange }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-icon item-icon4">
            <img src="@/assets/image/circle-bg.png" class="circle-bg" />
          </div>
          <div class="item-right">
            <div class="item-right-inner">
              <div class="text-title">任务数量</div>
              <div class="text-number"><count-to :start-val="0" :end-val="task_num" :duration="4000"
                  separator=""></count-to>
              </div>
              <div class="text-der text-decenter-wrapr">
                <span class="left">同比昨天</span>
                <!-- <img :src="taskNumChange >= 0 ? '@/assets/image/allow.png' : '@/assets/image/down.png'" /> -->
                <span :style="{ color: taskNumChange >= 0 ? 'red' : 'limegreen' }" class="right">{{ taskNumChange >= 0 ?
                  '+' : '' }}{{ taskNumChange }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="left">
          <div class="item-complex" style="margin-bottom: 20px">
            <line-charts width="100%" height="100%" :dateValue="dateValue"/>
          </div>
          <div class="item-complex" style="margin-bottom: 20px">
            <MultilineCharts :dateValue="dateValue"/>
          </div>
          <div class="item-complex">
            <BarCharts2 width="100%" height="100%" :dateValue="dateValue"/>
          </div>
        </div>
        <div class="middle">
          <div class="migration">
            <migration-charts id="migration" height="100%" width="100%" :dateValue="dateValue"/>
          </div>
          <div class="item-complex" style="transform: translate(-18%,218.5%); margin-bottom: 20px; background-size: 410px 260px; width: 340px;">
            <PieCharts :dateValue="dateValue"/>
          </div>
          <div class="item-complex" style="transform: translate(87%,111%);margin-bottom: 20px; background-size: 410px 260px; width: 340px;">
            <PieCharts2 :dateValue="dateValue"/>
          </div>
        </div>
        <div class="right">
          <div class="item-complex" style="margin-bottom: 20px">
            <BarCharts width="100%" height="100%" :dateValue="dateValue"/>
          </div>
          <div class="item-complex" style="margin-bottom: 20px; ">
            <lineCharts2 :dateValue="dateValue"/>
            <!-- <PieCharts2 style="transform: translate(30%, -100%)" /> -->
          </div>
          <div class="item-complex">
            <rollTable :dateValue="dateValue"></rollTable>
          </div>
        </div>
      </div>
    </div>
  </full-screen-container>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, reactive, watch } from 'vue'
import dayjs from 'dayjs'
import service from '@/api/request'
import FullScreenContainer from './components/full-screen-container.vue'
import CountTo from '@/components/CountTo/index.vue'
import LineCharts from '@/components/DataScreen/lineEcharts/index.vue'
import lineCharts2 from '@/components/DataScreen/lineEcharts/searchAndDetectLine.vue'
import BarCharts from '@/components/DataScreen/barEcharts/index.vue'
import MigrationCharts from '@/components/DataScreen/migrationEcharts/index.vue'
import MultilineCharts from '@/components/DataScreen/Multiline/index'
import PieCharts from '@/components/DataScreen/Pie/index'
import PieCharts2 from '@/components/DataScreen/Pie/industryPie'
import BarCharts2 from '@/components/DataScreen/barEcharts/provinceBar.vue'
import rollTable from '@/components/DataScreen/rollTable/index.vue'

const timeDate = ref()
const hourTime = ref()
const time1 = ref()
let bug_num = ref(124255)
let property_num = ref(34253)
let script_num = ref(6285)
let task_num = ref(341)
let assetNumChange = ref(0)
let pocNumChange = ref(0)
let taskNumChange = ref(0)
let vulNumChange = ref(0)
const getHour = () => {
  let date = new Date()
  let hour = date.getHours().toString().padStart(2, '00')
  let minute = date.getMinutes().toString().padStart(2, '00')
  let second = date.getSeconds().toString().padStart(2, '00')
  hourTime.value = `${hour}:${minute}:${second}`
  time1.value = setTimeout(() => {
    time1.value && clearTimeout(time1.value)
    getHour()
  }, 1000)
}

const getNowTime = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  timeDate.value = `${year}年${month}月${day}日`
  getHour()
}
const calculatePercentageChange = (newValue, oldValue) => {
  return ((newValue - oldValue) / oldValue) * 100;
};
const getHeaderAPI = async () => {
  const { data: res } = await service.get("/api/v1/get_header")
  console.log(res);
  if (res.code == 200) {
    // 使用 Day.js 解析日期字符串
    res.data.forEach(item => {
      item.date = dayjs(item.date);
    });
    res.data.sort((a, b) => a.date - b.date);
    const latestDayData = res.data[res.data.length - 1];
    const previousDayData = res.data[res.data.length - 2];
    // 计算同比昨天的增减百分比
    assetNumChange.value = calculatePercentageChange(latestDayData.asset_num, previousDayData.asset_num);
    pocNumChange.value = calculatePercentageChange(latestDayData.poc_num, previousDayData.poc_num);
    taskNumChange.value = calculatePercentageChange(latestDayData.task_num, previousDayData.task_num);
    vulNumChange.value = calculatePercentageChange(latestDayData.vul_num, previousDayData.vul_num);
    // 输出结果
    // console.log("资产数量同比昨天变化：", assetNumChange.value.toFixed(2) + "%");
    // console.log("POC 数量同比昨天变化：", pocNumChange.value.toFixed(2) + "%");
    // console.log("任务数量同比昨天变化：", taskNumChange.value.toFixed(2) + "%");
    // console.log("漏洞数量同比昨天变化：", vulNumChange.value.toFixed(2) + "%");
    bug_num.value = latestDayData.vul_num
    property_num.value = latestDayData.asset_num
    script_num.value = latestDayData.poc_num
    task_num.value = latestDayData.task_num
  }
}
onMounted(() => {
  getNowTime()
  getHeaderAPI()
})

onBeforeUnmount(() => {
  time1.value = null
})
let dateValue = ref(dayjs().format('YYYY-MM-DD'))
watch(dateValue, (newValue, oldValue) => {
  let formatDate = dayjs(newValue).format('YYYY-MM-DD')
  console.log("newValue："+formatDate);
},{
    immediate:true
})
</script>

<style lang="scss" scoped>
@import './index';
.right {
  // transform: translate(15px,20px)
  // flex: 7;
  // display: flex;
  // align-items: center;
  // justify-content: flex-end;
  // height: 60px !important;
  // padding-right: 20px;
}

.right-item {
  display: flex;
  align-items: center;
  margin: 0px 10px;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

.right-item-img {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.right-item-text {
  color: white;
  margin: 0px 5px;
}
.user-name {
  color: white;
  margin: 0px 5px;
}

.user-dropdown {
  background-color: rgba(3, 33, 66, 0.8);
  /* 设置蓝色背景并增加透明度 */
}

.user-dropdown :deep(.el-dropdown-menu__item) {
  color: white;
  /* 设置字体颜色为白色 */
}

.user-dropdown :deep(.el-dropdown-menu__item:hover) {
  color: black;
  /* 设置鼠标悬浮时的字体颜色为黑色 */
}
:deep(.el-date-editor.el-input){
  width:180px;
}
:deep(.el-input--small .el-input__wrapper){
  background-color: transparent;
}
:deep(.el-input__prefix){
  color:#fdf6ec
}
:deep(.el-input__inner){
  color:#c0c4cc
}
// .popperClass .el-picker-panel{
//   color: #fff;//设置当前面板的月份的字体为白色，记为1
//   background: #002450;//定义整体面板的颜色
//   border: 1px solid #1384b4;//定义整体面板的轮廓
//   .el-picker-panel__icon-btn {//设置年份月份调节按钮颜色，记为2
//     color: #ffffff;
//    }
//   .el-date-picker__header-label{//设置年月显示颜色，记为3
//       color: #ffffff;
//   }
//   .el-date-table th {//设置星期颜色，记为4
//       color:#ffffff;
//   }
// }
</style>
