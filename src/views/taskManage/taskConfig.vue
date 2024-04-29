<template>
  <div class="app-container demo-tabs">
    <div class="my-header">任务配置</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>任务编号：</span>
            <el-input v-model="ldmcInput" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">任务名称：</span>
            <el-input v-model="ldlxInput" style="width: 220px" placeholder="请输入" />

            <span style="margin-left: 10px">任务类型：</span>
            <el-select v-model="lddjValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in lddjOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-col :span="2"></el-col>
        <el-col :span="18">
          <div>
            <span>任务状态：</span>
            <el-select v-model="rwztValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in rwztOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <!-- <span style="margin-left: 10px">运营商：</span>
            <el-select v-model="yysValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in yysOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <span style="margin-left: 10px">日期选择：</span>
            <el-date-picker
              v-model="dateValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="transform: translateY(2px)"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row style="margin-top: 16px">
      <el-col :span="1"></el-col>
      <el-col :span="19">
        <el-button type="primary" :icon="Plus">新建</el-button>
        <el-button>批量删除</el-button>
        <el-button>批量导出</el-button>
      </el-col>
      <el-col :span="4">
        <div>
          <el-button type="primary" @click="searchClick">查 询</el-button>
          <el-button @click="resetClick">重 置</el-button>
          <!-- <a style="margin-left: 14px; cursor: pointer; color: #1675d5" @click="toggleAdvanced">
              {{ isCollapse ? '收起' : '展开' }}
            </a> -->
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 16px">
      <el-col :span="1"></el-col>
      <el-col :span="22">
        <div class="tableClass">
          <el-table
            :data="tableData.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="poc_id" label="任务编号" min-width="80" align="center" />
            <el-table-column prop="vul_name" label="任务名称" min-width="100" align="center" />
            <el-table-column prop="level" label="任务类型" min-width="120" align="center" />
            <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" />
            <el-table-column prop="vul_type" label="任务状态&结果" min-width="180" align="center" />
            <el-table-column prop="operator" label="操作" min-width="200px" align="center" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" icon="Edit" @click="xqClick(scope.row)"> 详情 </el-button>
                <el-button type="primary" size="small" icon="Edit" @click="editHandler(scope.row)"> 编辑 </el-button>
                <el-button type="danger" size="small" icon="Delete" @click="del(scope.row)"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="padding: 30px 0">
          <div style="display: inline-block; color: rgba(0, 0, 0, 0.427450980392157)"
            >共 {{ tableData.length }} 条记录，第 {{ pagination.currentPage }} /
            {{ Math.ceil(tableData.length / pagination.pageSize) }} 页</div
          >
          <div style="display: flex; justify-content: right; margin-top: -24px">
            <el-pagination
              background
              :current-page="pagination.currentPage"
              :page-size="pagination.pageSize"
              layout=" prev, pager, next, jumper"
              :total="tableData.length"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="1"></el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
  import { Plus } from '@element-plus/icons-vue'
  import { ref, reactive, onBeforeMount, Ref } from 'vue'
  import service from '@/api/request'
  const dateValue = ref('')
  const ldmcInput = ref('')
  const ldslInput = ref('')
  const ldlxInput = ref('')
  const yysValue = ref('')
  let yysOptions = ref([])
  const rwztValue = ref('')
  const rwztOptions = ref([
    { label: '待启动', value: '待启动' },
    { label: '执行中', value: '执行中' },
    { label: '已终止', value: '已终止' },
    { label: '已完成', value: '已完成' },
    { label: '错误退出', value: '错误退出' },
  ])
  const lddjValue = ref('')
  let lddjOptions = ref([
    { label: '测试任务', value: '测试任务' },
    { label: '专项任务', value: '专项任务' },
    { label: '扫描任务', value: '扫描任务' },
    { label: '验证任务', value: '验证任务' },
  ])
  let tableData = ref([])
  let curChain = ref('')
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
  })
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
  }
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
    pagination.currentPage = val
  }
  const multipleSelection = ref([])
  const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
  }
  let isCollapse: Ref<boolean> = ref(true)
  const toggleAdvanced = () => {
    isCollapse.value = !isCollapse.value
  }
  const searchClick = async () => {
    // const queryData = {
    //   value: curChain.value,
    //   exchange: lddjValue.value,
    //   nickname: ldslInput.value,
    //   name: ldmcInput.value,
    //   area: ldlxInput.value,
    //   operator: yysValue.value,
    // }
    // const { data: res } = await service.get('/api/v1/query_address', { params: queryData })
    // if (res.code == 200) {
    //   tableData.value = res.data
    //   yysOptions.value = Array.from(new Set(res.data.map((item) => item.operator))).map((operator) => ({
    //     label: operator,
    //     value: operator,
    //   }))
    //   lddjOptions.value = Array.from(new Set(res.data.map((item) => item.exchange))).map((exchange) => ({ label: exchange, value: exchange }))
    // }
  }
  const resetClick = () => {
    ldmcInput.value = ''
    ldlxInput.value = ''
    lddjValue.value = ''
    ldslInput.value = ''
    yysValue.value = ''
    searchClick()
  }
  onBeforeMount(() => {
    searchClick()
  })
  const xqClick = (row) => {
    console.log(row)
  }
  const del = (row) => {
    console.log(row)
  }
  const editHandler = (row) => {
    console.log(row)
  }
</script>
<style lang="scss" scoped>
  .my-header {
    font-size: 18px;
    font-weight: 600;
    transform: translate(6px, 6px);
  }

  .el-pagination {
    margin: 15px 0;
    justify-content: center !important;
  }

  .demo-tabs {
    background-color: white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    margin: 10px 12px !important;
    height: auto;
  }

  // .first-tab{
  //     margin-left: 20px;
  // }
  :deep(#tab-first) {
    margin-left: 20px !important;
  }

  :deep(.el-tabs__active-bar is-top) {
    margin-left: 20px !important;
  }
</style>
