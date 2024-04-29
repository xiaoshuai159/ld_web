<template>
  <div class="app-container demo-tabs">
    <div class="my-header">漏洞攻击特征管理表格</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>漏洞编号：</span>
            <el-input v-model="tzbhInput" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">漏洞名称：</span>
            <el-input v-model="tzmcInput" style="width: 220px" placeholder="请输入" />

            <span style="margin-left: 10px">危害等级：</span>
            <el-select v-model="zycdValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in zycdOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-col :span="2"></el-col>
        <el-col :span="18">
          <div>
            <span>漏洞类型：</span>
            <el-select v-model="tzlxValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span style="margin-left: 10px">评价等级：</span>
            <el-select v-model="tzdjValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <!-- <span style="margin-left: 10px">日期选择：</span>
            <el-date-picker v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" style="transform: translateY(2px);"/> -->
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row style="margin-top: 16px">
      <el-col :span="1"></el-col>
      <el-col :span="9">
        <el-button type="primary" :icon="Plus">新建</el-button>
        <el-button>批量删除</el-button>
        <el-button>批量导出</el-button>
      </el-col>
      <el-col :span="10">
        <el-input v-model="searchInput" style="width: 18vw" placeholder="请输入关键字" :suffix-icon="Search"></el-input>
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
            <el-table-column prop="poc_id" label="漏洞编号" min-width="80" align="center" />
            <el-table-column prop="vul_name" label="漏洞名称" min-width="100" align="center" />
            <el-table-column prop="create_time" label="发现时间" min-width="180" align="center" />
            <el-table-column prop="create_time" label="提取时间" min-width="180" align="center" />
            <el-table-column prop="vul_type" label="特征等级评价" min-width="180" align="center" />
            <el-table-column prop="poc_hash" label="危害等级" min-width="180" align="center" />

            <el-table-column prop="operator" label="操作" min-width="200" align="center" fixed="right">
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
  import { Search } from '@element-plus/icons-vue'
  import service from '@/api/request'
  const searchInput = ref('')
  const dateValue = ref('')
  const tzbhInput = ref('')
  const ldslInput = ref('')
  const tzmcInput = ref('')
  const tzlxValue = ref('')
  const tzdjValue = ref('')
  const sxztValue = ref('')
  const yysValue = ref('')
  let yysOptions = ref([])
  const zycdValue = ref('')
  let zycdOptions = ref([
    { label: '低', value: 0 },
    { label: '中', value: 1 },
    { label: '高', value: 2 },
    { label: '严', value: 3 },
  ])
  let tzlxOptions = ref([
    { label: '事件型漏洞', value: '事件型漏洞' },
    { label: '通用型漏洞', value: '通用型漏洞' },
  ])
  let tzdjOptions = ref([
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
  ])
  let sxztOptions = ref([
    { label: '生效', value: 1 },
    { label: '失效', value: 0 },
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
    //   exchange: zycdValue.value,
    //   nickname: ldslInput.value,
    //   name: tzbhInput.value,
    //   area: tzmcInput.value,
    //   operator: yysValue.value,
    // }
    // const { data: res } = await service.get('/api/v1/query_address', { params: queryData })
    // if (res.code == 200) {
    //   tableData.value = res.data
    //   yysOptions.value = Array.from(new Set(res.data.map((item) => item.operator))).map((operator) => ({
    //     label: operator,
    //     value: operator,
    //   }))
    //   zycdOptions.value = Array.from(new Set(res.data.map((item) => item.exchange))).map((exchange) => ({ label: exchange, value: exchange }))
    // }
  }
  const resetClick = () => {
    tzbhInput.value = ''
    tzmcInput.value = ''
    zycdValue.value = ''
    tzlxValue.value = ''
    tzdjValue.value = ''
    sxztValue.value = ''
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
