<template>
  <div class="app-container demo-tabs">
    <div class="my-header">任务配置</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <!-- <span>任务编号：</span>
            <el-input v-model="ldmcInput" style="width: 220px" placeholder="请输入" /> -->
            <span>任务名称：</span>
            <el-input v-model="task_name" style="width: 220px" placeholder="请输入" />

            <span style="margin-left: 10px">任务类型：</span>
            <el-select v-model="task_type" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in lddjOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span style="margin-left: 10px">任务状态：</span>
            <el-select v-model="status" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in rwztOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-col :span="2"></el-col>
        <el-col :span="18">
          <div>
            <!-- <span style="margin-left: 10px">运营商：</span>
            <el-select v-model="yysValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in yysOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <span>日期选择：</span>
            <el-date-picker
              v-model="dateValue"
              type="datetimerange"
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
        <el-button type="primary" :icon="Plus" @click="xjClick">新建</el-button>
        <el-button @click="multDel('mult')">批量删除</el-button>
        <el-button @click="multPut">批量导出</el-button>
        <el-button @click="multDel('all')">全部删除</el-button>
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
            v-loading="loading"
            :data="tableData.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="task_id" label="任务编号" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="name" label="任务名称" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="task_type" label="任务类型" min-width="120" align="center" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="scope.row.task_type == 'search'" type="info">查询任务</span>
                <span v-else-if="scope.row.task_type == 'detect'" type="success">探测任务</span>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" show-overflow-tooltip />
            <el-table-column prop="state" label="任务状态" min-width="120" align="center" show-overflow-tooltip>
              <template #default="scope">
                <el-tag v-if="scope.row.state == 0" type="info">未启动</el-tag>
                <el-tag v-else-if="scope.row.state == 1" type="success">已提交</el-tag>
                <el-tag v-else-if="scope.row.state == 2" type="warning">扫描中</el-tag>
                <el-tag v-else-if="scope.row.state == 3" type="danger">停止中</el-tag>
                <el-tag v-else-if="scope.row.state == 4" type="info">已停止</el-tag>
                <el-tag v-else-if="scope.row.state == 5" type="success">任务成功</el-tag>
                <el-tag v-else-if="scope.row.state == 6" type="danger">任务失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="operator" label="操作" min-width="200px" align="center" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" link @click="xqClick(scope.row)"> 详情 </el-button>
                <el-button type="success" size="small" link @click="qdClick(scope.row)"> 启动 </el-button>
                <el-button type="danger" size="small" link @click="tzClick(scope.row)"> 停止 </el-button>
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
        <span>厂商名称</span><span>{{ curXqData.ma_name }}</span
        ><br />
        <span>产品名称</span><span>{{ curXqData.product_name }}</span
        ><br />
        <span>产品版本</span><span>{{ curXqData.product_version }}</span
        ><br />
        <span>特征编号</span><span>{{ curXqData.chara_id }}</span
        ><br />
        <span>特征名称</span><span>{{ curXqData.chara_name }}</span
        ><br />
        <span>特征类型</span><span>{{ curXqData.chara_type }}</span
        ><br />
        <span>特征评价等级</span
        ><span> <el-rate v-model="curXqData.star" disabled show-score text-color="#ff9900" score-template="{value}星" /> </span><br />
        <span>特征资产重要等级</span><span>{{ curXqData.chara_level }}</span
        ><br />

        <span>查询语法</span><span>{{ curXqData.query_info }}</span
        ><br />
        <span>特征创建/上传日期</span><span>{{ curXqData.create_time }}</span
        ><br />
        <span>特征描述</span><span>{{ curXqData.description }}</span>
      </div>
    </el-dialog>
    <el-dialog v-model="xjDialogVisible" title="新建" width="30%">
      <el-form ref="xjForm" :model="curXjData" :rules="rules" label-width="140px">
        <el-form-item label="特征名称" prop="chara_name">
          <el-input v-model="curXjData.chara_name" placeholder="请输入特征名称" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="厂商名称" prop="ma_name">
          <el-input v-model="curXjData.ma_name" placeholder="请输入厂商名称" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="产品名称" prop="product_name">
          <el-input
            v-model="curXjData.product_name"
            placeholder="请输入产品名称"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item label="产品版本" prop="product_version">
          <el-input
            v-model="curXjData.product_version"
            placeholder="请输入产品版本"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item label="查询语法" prop="query_info">
          <el-input v-model="curXjData.query_info" placeholder="请输入查询语法" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="特征描述" prop="description">
          <el-input v-model="curXjData.description" placeholder="请输入描述信息" style="width: 220px" type="textarea" :rows="3" />
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
        <el-form-item label="特征id" prop="chara_name">
          <el-input
            v-model="curBjData.chara_id"
            disabled
            placeholder="请输入特征id"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item label="特征名称" prop="chara_name">
          <el-input v-model="curBjData.chara_name" placeholder="请输入特征名称" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>

        <el-form-item label="厂商名称" prop="ma_name">
          <el-input v-model="curBjData.ma_name" placeholder="请输入厂商名称" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="产品名称" prop="product_name">
          <el-input
            v-model="curBjData.product_name"
            placeholder="请输入产品名称"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item label="产品版本" prop="product_version">
          <el-input
            v-model="curBjData.product_version"
            placeholder="请输入产品版本"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item label="查询语法" prop="query_info">
          <el-input v-model="curBjData.query_info" placeholder="请输入查询语法" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="特征描述" prop="description">
          <el-input v-model="curBjData.description" placeholder="请输入特征名称" style="width: 220px" type="textarea" :rows="3" />
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
  import { Plus, Upload } from '@element-plus/icons-vue'
  import { ref, reactive, onMounted, Ref } from 'vue'
  import service from '@/api/request'
  import { ElMessage, type FormInstance, ElMessageBox } from 'element-plus'
  import dayjs from 'dayjs'
  const ldmcInput = ref('')
  const ldslInput = ref('')
  const task_name = ref('')
  const yysValue = ref('')
  let yysOptions = ref([])
  const status = ref('')
  const rwztOptions = ref([
    { label: '未启动', value: '0' },
    { label: '已提交', value: '1' },
    { label: '扫描中', value: '2' },
    { label: '停止中', value: '3' },
    { label: '已停止', value: '4' },
    { label: '任务成功', value: '5' },
    { label: '任务失败', value: '6' },
  ])
  const task_type = ref('')
  let lddjOptions = ref([
    { label: '查询任务', value: 'search' },
    { label: '探测任务', value: 'detect' },
  ])
  let curChain = ref('')

  const resetClick = () => {
    task_name.value = ''
    task_type.value = ''
    status.value = ''
    dateValue.value = ''
    searchClick()
  }

  const rules = ref({
    chara_id: [{ required: true, message: '请输入资产特征编号', trigger: 'change' }],
    query_syntax: [{ required: true, message: '请输入特征对应语法', trigger: 'blur' }],
    chara_level: [{ required: true, message: '请输入资产特征等级', trigger: 'change' }],
    ma_name: [{ required: true, message: '请输入相关厂商', trigger: 'change' }],
    product_name: [{ required: true, message: '请选择相关产品名称', trigger: 'change' }],
    product_version: [{ required: true, message: '请输入相关产品版本', trigger: 'change' }],
  })
  let dateValue = ref('')
  let loading = ref(false)
  let xqDialogVisible = ref(false)
  let xjDialogVisible = ref(false)
  let bjDialogVisible = ref(false)

  let tableData = ref([])
  let curXqData: any = ref({})
  const xqClick = (row) => {
    console.log(row)

    curXqData.value = row
    xqDialogVisible.value = true
  }
  const taskTypeOptions = ref([
    { label: 'URL特征', value: 'URL特征' },
    { label: 'IP特征', value: 'IP特征' },
  ])
  let curXjData: any = reactive({
    task_name: '',
    task_type: '',
    star: '',
    task_level: '',
    query_info: '',
    description: '',
  })
  let curBjData: any = reactive({
    task_name: '',
    task_type: '',
    star: '',
    task_level: '',
    query_info: '',
    description: '',
  })
  onMounted(() => {
    searchClick()
    fileInputRef.value = document.querySelector('input[type=file]')
  })

  let wjDialogVisible = ref(false)
  // 创建 ref 引用
  const fileInputRef = ref(null)
  // 保存用户选择的文件
  let file = null
  const wjClick = () => {
    fileInputRef.value.click()
  }
  const handleFileChange = (event) => {
    file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    service.post('/api/v1/upload_task', formData).then(({ data: res }) => {
      console.log(res)
      if (res.code == 200) {
        ElMessage.success('上传成功')
        wjDialogVisible.value = false
        file = null
        event.target.value = ''
        searchClick()
        loading.value = true
        setTimeout(() => {
          searchClick()
          loading.value = false
        }, 1000)
      } else {
        ElMessage.error(res.msg)
        file = null
        event.target.value = ''
        searchClick()
        loading.value = true
        setTimeout(() => {
          searchClick()
          loading.value = false
        }, 1000)
      }
    })
  }
  const xjClick = () => {
    // wjDialogVisible.value = true
    xjDialogVisible.value = true
  }
  const dtClick = () => {
    wjDialogVisible.value = false
    xjDialogVisible.value = true
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
  const qdClick = async (row) => {
    console.log(row)
    const { task_id, task_type } = row
    const { data: res } = await service.post('/api/v1/start_task', {
      task_id,
      task_type,
    })
    console.log(res)
    if (res.code == 200) {
      ElMessage.success('启动成功')
      searchClick()
    }
  }
  const tzClick = async (row) => {
    const { task_id } = row
    const { data: res } = await service.post('/api/v1/stop_task', {
      task_id,
    })
    console.log(res)
    if (res.code == 200) {
      ElMessage.success('停止成功')
      searchClick()
    }
  }
  const searchClick = async () => {
    // console.log(dayjs(dateValue.value[0]).format('YYYY-MM-DD HH:mm:ss'));

    loading.value = true
    const reqData = {
      task_type: task_type.value,
      task_name: task_name.value,
      status: status.value,
      start_time: dateValue.value.length == 0 ? '' : dayjs(dateValue.value[0]).format('YYYY-MM-DD HH:mm:ss'),
      end_time: dateValue.value.length == 0 ? '' : dayjs(dateValue.value[1]).format('YYYY-MM-DD HH:mm:ss'),
    }
    const { data: res } = await service.get('/api/v1/search_task', { params: reqData })
    console.log(res)
    tableData.value = res.data
    loading.value = false
  }

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
        const { data: res } = await service.get('/api/v1/search_task_by_name', { params: { task_name: curXjData.task_name } })
        // console.log(res);
        if (res.code == 200) {
          if (res.data.exists == 0) {
            // 代表特征不重复，可以正常创建 ，走创建接口
            const formData = {
              task_name: curXjData.task_name,
              task_type: curXjData.task_type,
              star: curXjData.star,
              task_level: curXjData.task_level,
              query_info: curXjData.query_info,
              description: curXjData.description,
              ma_name: curXjData.ma_name,
              product_name: curXjData.product_name,
              product_version: curXjData.product_version,
            }
            const { data: res2 } = await service.post('/api/v1/create_task', formData)
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
          task_id: curBjData.task_id,
          task_name: curBjData.task_name,
          task_type: curBjData.task_type,
          star: curBjData.star,
          task_level: curBjData.task_level,
          query_info: curBjData.query_info,
          description: curBjData.description,
          ma_name: curBjData.ma_name,
          product_name: curBjData.product_name,
          product_version: curBjData.product_version,
        }
        const { data: res } = await service.post('/api/v1/update_task', formData)
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

  const starChange = async (row) => {
    curBjData = row
    const formData = {
      task_id: curBjData.task_id,
      task_name: curBjData.task_name,
      task_type: curBjData.task_type,
      star: curBjData.star,
      task_level: curBjData.task_level,

      query_info: curBjData.query_info,
      description: curBjData.description,
      ma_name: curBjData.ma_name,
      product_name: curBjData.product_name,
      product_version: curBjData.product_version,
    }
    const { data: res } = await service.post('/api/v1/update_task', formData)
    searchClick()
    ElMessage.success(res.msg)
  }
  const del = async (row) => {
    const { task_id } = row
    const taskIds = [task_id]

    ElMessageBox.confirm('是否确定删除此条数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_task', { task_id: taskIds })
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
  const multDel = async (flag: string) => {
    let task_id: Array<String>
    if (flag == 'mult') {
      task_id = multipleSelection.value.map((item) => item.task_id)
    } else {
      task_id = tableData.value.map((item) => item.task_id)
    }
    ElMessageBox.confirm('是否确定删除选中数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_task', { task_id })
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
    const task_id = multipleSelection.value.map((item) => item.task_id)
    console.log(task_id)

    service({
      method: 'post',
      url: '/api/v1/export_task',
      data: { task_id },
      responseType: 'blob',
    })
      .then(function (res) {
        const contentDisposition = res.headers['content-disposition']
        const fileName = contentDisposition.split('filename=')[1].trim()
        let blob = new Blob([res.data]) // { type: "application/vnd.ms-excel" }
        let url = window.URL.createObjectURL(blob) // 创建一个临时的url指向blob对象
        let a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        // 释放这个临时的对象url
        window.URL.revokeObjectURL(url)
        searchClick()
      })
      .catch(function (res) {
        console.log('error', res)
      })
  }

  const editHandler = (row) => {
    curBjData = row
    bjDialogVisible.value = true
  }
  const downloadTemplate = () => {
    // 发起请求下载模板文件
    // 例如：
    service({
      method: 'get',
      url: '/api/v1/export_asset_task_template',
      responseType: 'blob',
    })
      .then((res) => {
        const contentDisposition = res.headers['content-disposition']
        const fileName = contentDisposition.split('filename=')[1].trim()
        let blob = new Blob([res.data]) // { type: "application/vnd.ms-excel" }
        let url = window.URL.createObjectURL(blob) // 创建一个临时的url指向blob对象
        let a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        // 释放这个临时的对象url
        window.URL.revokeObjectURL(url)
      })
      .catch((error) => {
        console.error('下载模板失败：', error)
        // 处理下载失败的情况
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
