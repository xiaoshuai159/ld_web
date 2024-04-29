<template>
  <div class="app-container demo-tabs">
    <div class="my-header">应用资产特征管理表格</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>特征等级：</span>
            <el-select v-model="tzdjValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <!-- <span>特征编号：</span>
            <el-input v-model="tzbhInput" style="width: 220px" placeholder="请输入" /> -->
            <span style="margin-left: 10px">特征名称：</span>
            <el-input v-model="tzmcInput" style="width: 220px" placeholder="请输入" />

            <span style="margin-left: 10px">重要程度：</span>
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
            <span>特征类型：</span>
            <el-select v-model="tzlxValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <!-- <span style="margin-left: 10px">特征等级：</span>
            <el-select v-model="tzdjValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <!-- <span style="margin-left: 10px">日期选择：</span>
            <el-date-picker v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" style="transform: translateY(2px);"/> -->
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
            <el-table-column prop="chara_id" label="特征编号" min-width="120" align="center" show-overflow-tooltip />
            <el-table-column prop="chara_name" label="特征名称" sortable min-width="150" align="center" show-overflow-tooltip />
            <el-table-column prop="chara_type" label="特征类型" min-width="100" align="center" show-overflow-tooltip />
            <el-table-column prop="create_time" label="创建时间" sortable min-width="170" align="center" show-overflow-tooltip />
            <el-table-column prop="star" label="特征等级评价" sortable min-width="180" align="center">
              <template #default="{ row }">
                <el-rate v-model="row.star" disabled show-score text-color="#ff9900" score-template="{value}星" />
              </template>
            </el-table-column>
            <el-table-column prop="chara_level" label="相关资产重要等级" sortable min-width="180" align="center" show-overflow-tooltip />

            <el-table-column prop="operator" label="操作" min-width="140" align="center" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" link @click="xqClick(scope.row)"> 详情 </el-button>
                <el-button type="primary" size="small" link @click="editHandler(scope.row)"> 编辑 </el-button>
                <el-button type="danger" size="small" link @click="del(scope.row)"> 删除 </el-button>
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
    <el-dialog v-model="ckDialogVisible" title="详情信息" width="30%">
      <div class="ckDialog">
        <span>特征编号</span><span>{{ curXqData.tzbh }}</span
        ><br />
        <span>特征名称</span><span>{{ curXqData.tzmc }}</span
        ><br />
        <span>特征类型</span><span>{{ curXqData.tzlx }}</span
        ><br />
        <span>特征评价等级</span
        ><span> <el-rate v-model="curXqData.tzdjpj" disabled show-score text-color="#ff9900" score-template="{value}星" /> </span><br />
        <span>特征资产重要等级</span><span>{{ curXqData.xgzczydj }}</span
        ><br />
        <span>特征来源</span><span>{{ curXqData.tzly }}</span
        ><br />
        <span>特征版本</span><span>{{ curXqData.tzbb }}</span
        ><br />
        <span>特征创建/上传日期</span><span>{{ curXqData.cjsj }}</span
        ><br />
        <span>特征最新修改日期</span><span>{{ curXqData.xgrq }}</span
        ><br />
        <span>特征描述</span><span>{{ curXqData.tzms }}</span>
      </div>
    </el-dialog>
    <!-- <el-dialog v-model="bjDialogVisible" title="编辑信息" width="30%">
      <div class="bjDialog">
        <span>特征编号</span><span>{{ curXqData.tzbh }}</span><br>
        <span>特征名称</span><span>{{ curXqData.tzmc }}</span><br>
        <span>特征类型</span><span>{{ curXqData.tzlx }}</span><br>
        <span>特征评价等级</span><span>
          <el-rate v-model="curXqData.tzdjpj" disabled show-score text-color="#ff9900" score-template="{value}星" />
        </span><br>
        <span>特征资产重要等级</span><span>{{ curXqData.xgzczydj }}</span><br>
        <span>特征来源</span><span>{{ curXqData.tzly }}</span><br>
        <span>特征版本</span><span>{{ curXqData.tzbb }}</span><br>
        <span>特征创建/上传日期</span><span>{{ curXqData.cjsj }}</span><br>
        <span>特征最新修改日期</span><span>{{ curXqData.xgrq }}</span><br>
        <span>特征描述</span><span>{{ curXqData.tzms }}</span>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="bjDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </span>
    </template>
    </el-dialog> -->
  </div>
</template>
<script lang="ts" setup>
  import { Plus } from '@element-plus/icons-vue'
  import { ref, reactive, onMounted, Ref } from 'vue'
  import service from '@/api/request'
  let ckDialogVisible = ref(false)
  let bjDialogVisible = ref(false)
  const tzbhInput = ref('')
  const tzmcInput = ref('')
  const tzlxValue = ref('')
  const tzdjValue = ref('')
  const zycdValue = ref('')
  let zycdOptions = ref([
    { label: '低', value: 0 },
    { label: '中', value: 1 },
    { label: '高', value: 2 },
  ])
  let tzlxOptions = ref([
    { label: '文件特征', value: '文件特征' },
    { label: '网路特征', value: '网路特征' },
    { label: '进程特征', value: '进程特征' },
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
  let tableData = ref([
    {
      tzbh: '202112-00084',
      tzmc: 'wordpress系统特征',
      tzlx: 'URL特征',
      cjsj: '2024-01-11 10:56:01',
      tzdjpj: '4',
      xgzczydj: '高',
      xgrq: '2024-01-12 14:56:01',
      tzly: '资产系统自动导入',
      tzbb: '1.1.1',
      tzms: '查询语法：url:example',
    },
    {
      tzbh: '202112-00085',
      tzmc: 'Excel文件特征',
      tzlx: 'IP特征',
      cjsj: '2024-01-01 11:50:01',
      tzdjpj: '3',
      xgzczydj: '中',
      xgrq: '2024-01-02 14:56:01',
      tzly: '资产系统自动导入',
      tzbb: '1.1.3',
      tzms: '无',
    },
  ])
  let curXqData: any = ref({})
  const xqClick = (row) => {
    curXqData.value = row
    ckDialogVisible.value = true
  }

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
  onMounted(() => {
    searchClick()
  })
  const searchClick = async () => {
    const reqData = {
      chara_name: tzmcInput.value,
      chara_type: tzlxValue.value,
      star: tzdjValue.value,
      chara_level: zycdValue.value,
    }
    const { data: res } = await service.get('/api/v1/search_chara', { params: reqData })
    console.log(res)
    tableData.value = res.data
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
    searchClick()
  }

  const del = (row) => {
    console.log(row)
  }
  const editHandler = (row) => {
    console.log(row)
  }
</script>
<style lang="scss" scoped>
  .ckDialog > span:nth-of-type(odd) {
    display: inline-block;
    color: #999999;
    width: 160px;
    margin: 12px 0;
  }

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
