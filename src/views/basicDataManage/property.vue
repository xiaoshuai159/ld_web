<template>
  <div class="app-container demo-tabs">
    <div class="my-header">应用资产管理表格</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>资产编号：</span>
            <el-input v-model="zcbhInput" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">资产名称：</span>
            <el-input v-model="zcmcInput" style="width: 220px" placeholder="请输入" />

            <span style="margin-left: 10px">资产归属：</span>
            <!-- <el-select v-model="zycdValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in zycdOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-input v-model="zcgsInput" style="width: 220px" placeholder="请输入" />
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-col :span="2"></el-col>
        <el-col :span="18">
          <div>
            <span>资产类型：</span>
            <el-select v-model="zclxValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in zclxOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span style="margin-left: 10px">资产等级：</span>
            <el-select v-model="zcdjValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in zcdjOptions" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-col :span="19">
        <el-button type="primary" :icon="Plus" @click="xjClick">新建</el-button>
        <el-button @click="multDel">批量删除</el-button>
        <el-button @click="multPut">批量导出</el-button>
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
            <el-table-column prop="zcbh" label="资产编号" min-width="120" align="center" show-overflow-tooltip />
            <el-table-column prop="zcmc" label="资产名称" min-width="150" align="center" show-overflow-tooltip sortable />
            <el-table-column prop="zclx" label="资产类型" min-width="100" align="center" show-overflow-tooltip />
            <el-table-column prop="zclrsj" label="资产录入时间" min-width="180" align="center" show-overflow-tooltip sortable />
            <el-table-column prop="zcgsdw" label="资产归属单位" min-width="180" align="center" show-overflow-tooltip sortable />
            <el-table-column prop="zcdj" label="资产等级" min-width="130" align="center" show-overflow-tooltip sortable />
            <el-table-column prop="baxx" label="备案信息" min-width="180" align="center" show-overflow-tooltip />
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
    <el-dialog v-model="xqDialogVisible" title="详情信息" width="35%">
      <div class="xqDialog">
        <span>资产编号</span><span>{{ curXqData.chara_id }}</span
        ><br />
        <span>资产名称</span><span>{{ curXqData.chara_name }}</span
        ><br />
        <span>资产类型</span><span>{{ curXqData.chara_type }}</span
        ><br />
        <span>资产归属单位</span><span>{{ curXqData.zcgsdw }}</span
        ><br />
        <span>资产等级</span><span>{{ curXqData.star }}</span
        ><br />
        <span>资产来源</span><span>{{ curXqData.zcly }}</span
        ><br />
        <span>备案信息</span><span>{{ curXqData.baxx }}</span
        ><br />
        <span>资产归属地区</span><span>{{ curXqData.zcgsdq }}</span
        ><br />
        <span>资产录入时间</span><span>{{ curXqData.create_time }}</span
        ><br />
        <span>相关资产特征</span><span>{{ curXqData.description }}</span>
      </div>
    </el-dialog>
    <el-dialog v-model="xjDialogVisible" title="新建" width="30%">
      <el-form ref="xjForm" :model="curXjData" :rules="rules" label-width="140px">
        <el-form-item label="资产名称" prop="chara_name">
          <el-input v-model="curXjData.chara_name" placeholder="请输入特征名称" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="资产类型" prop="chara_type">
          <el-select v-model="curXjData.chara_type" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="资产归属单位" prop="zcgsdw">
          <el-input v-model="curXjData.zcgsdw" placeholder="请输入资产归属单位" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="资产等级" prop="star">
          <el-select v-model="curXjData.star" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备案信息" prop="baxx">
          <el-input v-model="curXjData.baxx" placeholder="请输入备案信息" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="资产归属地区" prop="zcgsdq">
          <el-input v-model="curXjData.zcgsdq" placeholder="请输入描述信息" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="相关资产特征" prop="xgzctz">
          <el-input v-model="curXjData.xgzctz" placeholder="请输入描述信息" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="handleSubmit(xjForm)">确定</el-button>
          <el-button @click="xjDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="bjDialogVisible" title="编辑" width="30%">
      <el-form ref="bjForm" :model="curBjData" :rules="rules" label-width="140px">
        <el-form-item label="资产编号" prop="chara_name">
          <el-input v-model="curBjData.chara_id" placeholder="请输入特征id" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="资产名称" prop="chara_name">
          <el-input v-model="curBjData.chara_name" placeholder="请输入特征名称" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="资产类型" prop="chara_type">
          <el-select v-model="curBjData.chara_type" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="资产归属单位" prop="zcgsdw">
          <el-input v-model="curBjData.zcgsdw" placeholder="请输入资产归属单位" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="资产等级" prop="star">
          <el-select v-model="curBjData.star" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="资产来源" prop="zcly">
          <el-input v-model="curBjData.zcly" placeholder="请输入资产来源" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="所属行业" prop="sshy">
          <el-select v-model="curBjData.sshy" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备案信息" prop="baxx">
          <el-input v-model="curBjData.baxx" placeholder="请输入备案信息" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="资产归属地区" prop="zcgsdq">
          <el-input v-model="curBjData.zcgsdq" placeholder="请输入描述信息" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="相关资产特征" prop="xgzctz">
          <el-input v-model="curBjData.xgzctz" placeholder="请输入描述信息" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="handleSubmit2(bjForm)">确定</el-button>
          <el-button @click="bjDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
  import { Plus } from '@element-plus/icons-vue'
  import { ref, reactive, onBeforeMount, Ref, onMounted } from 'vue'
  import service from '@/api/request'
  import { ElMessage, type FormInstance, ElMessageBox } from 'element-plus'
  const rules = ref({
    chara_id: [{ required: true, message: '请输入特征id', trigger: 'change' }],
    chara_name: [{ required: true, message: '请输入特征名称', trigger: 'blur' }],
    chara_type: [{ required: true, message: '请选择特征类型', trigger: 'change' }],
    star: [{ required: true, message: '请选择特征评价等级', trigger: 'change' }],
    chara_level: [{ required: true, message: '请选择相关资产重要等级', trigger: 'change' }],
    query_info: [{ required: true, message: '请输入查询语法', trigger: 'change' }],
  })
  let xqDialogVisible = ref(false)
  let xjDialogVisible = ref(false)
  let bjDialogVisible = ref(false)
  const dateValue = ref('')
  const zcbhInput = ref('')
  const ldslInput = ref('')
  const zcmcInput = ref('')
  const zclxValue = ref('')
  const zcdjValue = ref('')
  const sxztValue = ref('')
  const zcgsInput = ref('')
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
  let zclxOptions = ref([
    { label: '文件特征', value: '文件特征' },
    { label: '网路特征', value: '网路特征' },
    { label: '进程特征', value: '进程特征' },
  ])
  let zcdjOptions = ref([
    { label: '重要', value: '重要' },
    { label: '一般', value: '一般' },
    { label: '不确定', value: '不确定' },
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
  const xjClick = () => {
    xjDialogVisible.value = true
  }
  const searchClick = async () => {
    // const queryData = {
    //   value: curChain.value,
    //   exchange: zycdValue.value,
    //   nickname: ldslInput.value,
    //   name: zcbhInput.value,
    //   area: zcmcInput.value,
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
    zcbhInput.value = ''
    zcmcInput.value = ''
    zycdValue.value = ''
    zclxValue.value = ''
    zcdjValue.value = ''
    sxztValue.value = ''
    searchClick()
  }

  onMounted(() => {
    searchClick()
  })
  const xqClick = (row) => {
    console.log(row)
  }
  const editHandler = (row) => {
    console.log(row)
  }
  let curXqData: any = ref({})
  let curXjData: any = reactive({
    chara_name: '',
    chara_type: '',
    star: '',
    chara_level: '',
    query_info: '',
    description: '',
  })
  let curBjData: any = reactive({
    chara_name: '',
    chara_type: '',
    star: '',
    chara_level: '',
    query_info: '',
    description: '',
  })
  const xjForm = ref<FormInstance>()
  const bjForm = ref<FormInstance>()
  // 新建
  const handleSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    // 处理表单提交逻辑，例如提交数据到后端等
    // 在这里你可以调用 el-form 的 validate() 方法来校验表单
    // 如果校验通过，再执行后续的逻辑
    formEl.validate(async (valid) => {
      if (valid) {
        const { data: res } = await service.get('/api/v1/search_chara_by_name', { params: { chara_name: curXjData.chara_name } })
        // console.log(res);
        if (res.code == 200) {
          if (res.data.exists == 0) {
            // 代表特征不重复，可以正常创建 ，走创建接口
            const formData = {
              chara_name: curXjData.chara_name,
              chara_type: curXjData.chara_type,
              star: curXjData.star,
              chara_level: curXjData.chara_level,
              query_info: curXjData.query_info,
              description: curXjData.description,
            }
            // const formData = new FormData()
            // formData.append('chara_name', curXjData.chara_name)
            // formData.append('chara_type', curXjData.chara_type)
            // formData.append('star', curXjData.star)
            // formData.append('chara_level', curXjData.chara_level)
            // formData.append('query_info', curXjData.query_info)
            // formData.append('description', curXjData.description)
            const { data: res2 } = await service.post('/api/v1/create_chara', formData)
            console.log(res2)
            xjDialogVisible.value = false
            searchClick()
            ElMessage.success(res2.msg)
          } else {
            // 代表特征名称重复
            ElMessage.error('该特征名称已存在，请重新输入！')
          }
        } else {
          ElMessage.error(res.msg)
        }
      } else {
        console.log('error submit!')
        return false
      }
    })
    // xjDialogVisible.value = false // 关闭对话框
  }
  // 编辑
  const handleSubmit2 = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    // 处理表单提交逻辑，例如提交数据到后端等
    // 在这里你可以调用 el-form 的 validate() 方法来校验表单
    // 如果校验通过，再执行后续的逻辑
    formEl.validate(async (valid) => {
      console.log(valid)

      if (valid) {
        const formData = {
          chara_id: curBjData.chara_id,
          chara_name: curBjData.chara_name,
          chara_type: curBjData.chara_type,
          star: curBjData.star,
          chara_level: curBjData.chara_level,
          query_info: curBjData.query_info,
          description: curBjData.description,
        }
        const { data: res } = await service.post('/api/v1/update_chara', formData)
        console.log(res)
        bjDialogVisible.value = false

        searchClick()
        ElMessage.success(res.msg)
      } else {
        console.log('error submit!')
        return false
      }
    })
    // bjDialogVisible.value = false // 关闭对话框
  }
  const del = async (row) => {
    const { chara_id } = row
    const charaIds = [chara_id]

    ElMessageBox.confirm('是否确定删除此条数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_chara', { chara_id: charaIds })
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          searchClick()
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消',
        })
      })
  }
  const multDel = async () => {
    // const charaIds = multipleSelection
    // console.log(multipleSelection.value);
    const chara_id = multipleSelection.value.map((item) => item.chara_id)
    ElMessageBox.confirm('是否确定删除选中数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_chara', { chara_id })
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          searchClick()
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消',
        })
      })
  }
  const multPut = () => {
    const chara_id = multipleSelection.value.map((item) => item.chara_id)
    console.log(chara_id)

    service({
      method: 'post',
      url: '/api/v1/export_chara',
      data: { chara_id },
      responseType: 'blob',
    })
      .then(function (res) {
        let blob = new Blob([res.data]) // { type: "application/vnd.ms-excel" }
        let url = window.URL.createObjectURL(blob) // 创建一个临时的url指向blob对象
        // 创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
        let a = document.createElement('a')
        a.href = url
        a.download = '表格.csv'
        a.click()
        // 释放这个临时的对象url
        window.URL.revokeObjectURL(url)
      })
      .catch(function (res) {
        console.log('error', res)
      })
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
