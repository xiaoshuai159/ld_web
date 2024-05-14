<template>
  <div class="app-container demo-tabs">
    <div class="my-header">漏洞探测脚本管理表格</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>脚本名称：</span>
            <el-input v-model="jbmcInput" style="width: 220px" placeholder="请输入" />
            <!-- <span style="margin-left: 10px">脚本哈希：</span>
            <el-input v-model="jbhxInput" style="width: 220px" placeholder="请输入" /> -->
            <span style="margin-left: 10px">脚本类型：</span>
            <el-select v-model="jblxValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in jblxOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span style="margin-left: 10px">漏洞名称：</span>
            <el-input v-model="ldmcInput" style="width: 220px" placeholder="请输入" />
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-col :span="2"></el-col>
        <el-col :span="18">
          <div>
            <span>漏洞等级：</span>
            <el-select v-model="lddjValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in lddjOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span style="margin-left: 10px">漏洞类型：</span>
            <el-select v-model="vul_type" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in ldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
            v-loading="loading"
            :data="tableData.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <!-- <el-table-column prop="poc_id" label="poc编号" min-width="80" align="center" /> -->
            <el-table-column prop="vul_name" label="脚本名称" min-width="100" align="center" />
            <el-table-column prop="vul_type" label="脚本类型" min-width="180" align="center" />
            <el-table-column prop="create_time" label="创建时间" min-width="180" align="center" />
            <el-table-column prop="level" label="漏洞等级" min-width="120" align="center" />
            <el-table-column prop="vul_type" label="漏洞类型" min-width="120" align="center" />
            <el-table-column prop="count" label="漏洞数量" min-width="100" align="center" />
            <el-table-column prop="operator" label="操作" min-width="200px" align="center" fixed="right">
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
        <!-- <span>特征编号</span><span>{{ curXqData.poc_id }}</span
        ><br /> -->
        <span>脚本名称</span><span>{{ curXqData.poc_name }}</span
        ><br />
        <span>脚本类型</span><span>{{ curXqData.poc_type }}</span
        ><br />
        <!-- <span>漏洞等级</span><span> <el-rate v-model="curXqData.star" disabled show-score text-color="#ff9900"
            score-template="{value}星" /> </span><br /> -->
        <span>创建时间</span><span>{{ curXqData.create_time }}</span
        ><br />
        <span>更新时间</span><span>{{ curXqData.update_time }}</span
        ><br />
        <span>相关漏洞数量</span><span>{{ curXqData.count }}</span
        ><br />
        <span>漏洞等级</span><span>{{ curXqData.level }}</span
        ><br />
        <span>漏洞名称</span><span>{{ curXqData.vul_name }}</span
        ><br />
        <span>漏洞类型</span><span>{{ curXqData.vul_type }}</span
        ><br />
        <span>相关漏洞数量</span><span>{{ curXqData.count }}</span
        ><br />
        <span>脚本</span><span style="color: blue; cursor: pointer" @click="downloadFile">下载</span>
        <!-- <span>脚本类型</span><span>{{ curXqData.poc_type }}</span
        ><br /> -->
      </div>
    </el-dialog>
    <el-dialog v-model="xjDialogVisible" title="新建" width="30%">
      <el-form ref="xjForm" :model="curXjData" :rules="rules" label-width="140px">
        <el-form-item label="脚本名称" prop="poc_name">
          <el-input
            v-model="curXjData.poc_name"
            placeholder="请输入漏洞名称"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          ></el-input>
        </el-form-item>
        <el-form-item label="脚本类型" prop="poc_type">
          <el-select v-model="curXjData.poc_type" placeholder="请选择脚本类型" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in ldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞等级" prop="level">
          <el-select v-model="curXjData.level" placeholder="请选择等级" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in lddjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞名称" prop="vul_name">
          <el-input
            v-model="curXjData.vul_name"
            placeholder="请输入漏洞名称"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          ></el-input>
        </el-form-item>
        <el-form-item label="漏洞类型" prop="vul_type">
          <el-select v-model="curXjData.vul_type" placeholder="请选择漏洞类型" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in ldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关漏洞数量" prop="count">
          <el-input
            v-model="curXjData.count"
            placeholder="请输入相关漏洞数量"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload v-model:file-list="fileList" style="width: 220px" class="upload-demo" drag action="#" :auto-upload="false" :limit="1">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text"> 点击或将文件拖拽到这里<em>上传</em> </div>
            <template #tip>
              <div class="el-upload__tip"> 支持扩展名：.py .java .go </div>
            </template>
          </el-upload>
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
        <el-form-item label="脚本名称" prop="poc_name">
          <el-input
            v-model="curBjData.poc_name"
            placeholder="请输入漏洞名称"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          ></el-input>
        </el-form-item>
        <el-form-item label="脚本类型" prop="poc_type">
          <el-select v-model="curBjData.poc_type" placeholder="请选择脚本类型" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in ldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞等级" prop="level">
          <el-select v-model="curBjData.level" placeholder="请选择等级" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in lddjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞名称" prop="vul_name">
          <el-input
            v-model="curBjData.vul_name"
            placeholder="请输入漏洞名称"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          ></el-input>
        </el-form-item>
        <el-form-item label="漏洞类型" prop="vul_type">
          <el-select v-model="curBjData.vul_type" placeholder="请选择漏洞类型" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in ldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关漏洞数量" prop="count">
          <el-input
            v-model="curBjData.count"
            placeholder="请输入相关漏洞数量"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload v-model:file-list="fileList" style="width: 220px" class="upload-demo" drag action="#" :auto-upload="false" :limit="1">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text"> 点击或将文件拖拽到这里<em>上传</em> </div>
            <template #tip>
              <div class="el-upload__tip"> 支持扩展名：.py .java .go </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer" style="display: flex; justify-content: flex-end">
          <el-button type="primary" @click="handleSubmit2(bjForm)">确定</el-button>
          <el-button @click="bjDialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="wjDialogVisible" width="30%">
      <div style="text-align: center; height: 140px; line-height: 140px; border: 1px #dddddd Dashed; border-radius: 5px">
        <el-button :icon="Upload" @click="wjClick">上传文件</el-button>
        <span style="margin: 0 10px 0 16px; color: #b3b3b3">/</span>
        <el-button link type="info" @click="dtClick">手动输入（单条创建）</el-button>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 10px">
        <el-icon color="#1890ff" size="20">
          <InfoFilled />
        </el-icon>
        <span style="color: #b3b3b3">请上传csv文件，大小在60M以内</span>
      </div>
    </el-dialog>
    <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
  </div>
</template>
<script lang="ts" setup>
  import { Plus, Upload } from '@element-plus/icons-vue'
  import { ref, reactive, onBeforeMount, Ref, onMounted } from 'vue'
  import { ElMessage, type FormInstance, ElMessageBox, type UploadProps, type UploadUserFile } from 'element-plus'
  import service from '@/api/request'
  const fileList = ref<UploadUserFile[]>([])
  const fileList2 = ref<UploadUserFile[]>([])
  let loading = ref(false)
  let curXjData: any = reactive({})
  let curBjData: any = reactive({})
  let curXqData: any = ref({})
  let xqDialogVisible = ref(false)
  let bjDialogVisible = ref(false)
  const rules = ref({
    poc_name: [{ required: true, message: '请输入脚本名称', trigger: 'blur' }],
    poc_type: [{ required: true, message: '请选择脚本类型', trigger: 'change' }],
    level: [{ required: true, message: '请选择等级', trigger: 'change' }],
    vul_name: [{ required: true, message: '请选择漏洞名称', trigger: 'change' }],
    vul_type: [{ required: true, message: '请选择漏洞类型', trigger: 'change' }],
    count: [{ required: true, message: '请输入相关漏洞数量', trigger: 'change' }],
    file: [{ required: true, message: '请选择文件', trigger: 'change' }],
  })
  const jbmcInput = ref('')
  const ldmcInput = ref('')
  const jbhxInput = ref('')
  const jblxValue = ref('')
  const jblxOptions = ref([
    { label: 'Shell', value: 'Shell' },
    { label: 'Lua', value: 'Lua' },
    { label: 'Python', value: 'Python' },
    { label: 'Java', value: 'Java' },
    { label: 'Golang', value: 'Golang' },
  ])
  let yysOptions = ref([])
  const lddjValue = ref('')
  let lddjOptions = ref([
    { label: '低', value: 0 },
    { label: '中', value: 1 },
    { label: '高', value: 2 },
    { label: '严', value: 3 },
  ])
  const vul_type = ref('')
  const ldlxOptions = ref([
    { label: '通用型漏洞', value: '通用型漏洞' },
    { label: '事件型漏洞', value: '事件型漏洞' },
  ])
  let tableData = ref([{}, {}])
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
    const queryData = {
      poc_name: jbmcInput.value,
      poc_hash: jbhxInput.value,
      poc_type: jblxValue.value,
      level: lddjValue.value,
      vul_type: vul_type.value,
      vul_name: ldmcInput.value,
    }
    const { data: res } = await service.get('/api/v1/search_poc', { params: queryData })
    if (res.code == 200) {
      tableData.value = res.data
    }
  }
  const resetClick = () => {
    jbmcInput.value = ''
    jbhxInput.value = ''
    jblxValue.value = ''
    lddjValue.value = ''
    vul_type.value = ''
    ldmcInput.value = ''
    searchClick()
  }
  onMounted(() => {
    searchClick()
    fileInputRef.value = document.querySelector('input[type=file]')
  })
  const xqClick = (row) => {
    console.log(row)
    curXqData = row
    xqDialogVisible.value = true
  }
  // 删除 start ----------------------
  const del = async (row) => {
    const { poc_id } = row
    const pocIds = [poc_id]

    ElMessageBox.confirm('是否确定删除此条数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_poc', { poc_id: pocIds })
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          searchClick()
          loading.value = true
          setTimeout(() => {
            searchClick()
            loading.value = false
          }, 1000)
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
    const poc_id = multipleSelection.value.map((item) => item.poc_id)
    ElMessageBox.confirm('是否确定删除选中数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_poc', { poc_id })
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          searchClick()
          loading.value = true
          setTimeout(() => {
            searchClick()
            loading.value = false
          }, 1000)
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
    const poc_id = multipleSelection.value.map((item) => item.poc_id)
    console.log(poc_id)

    service({
      method: 'post',
      url: '/api/v1/export_poc',
      data: { poc_id },
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
      })
      .catch(function (res) {
        console.log('error', res)
      })
  }
  // 删除 end ----------------------
  const editHandler = (row) => {
    curBjData = row
    bjDialogVisible.value = true
  }
  // 新建 start -------------------
  let xjDialogVisible = ref(false)
  let wjDialogVisible = ref(false)
  const fileInputRef = ref(null)
  let file = null
  const wjClick = () => {
    fileInputRef.value.click()
  }
  const handleFileChange = (event) => {
    file = event.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    service.post('/api/v1/upload_poc', formData).then(({ data: res }) => {
      console.log(res)
      if (res.code == 200) {
        ElMessage.success('上传成功')
        wjDialogVisible.value = false
        file = null
        event.target.value = ''
        searchClick()
      } else {
        ElMessage.error(res.msg)
        file = null
        event.target.value = ''
        searchClick()
      }
    })
  }
  const xjClick = () => {
    wjDialogVisible.value = true
  }
  const dtClick = () => {
    wjDialogVisible.value = false
    xjDialogVisible.value = true
  }
  const xjForm = ref<FormInstance>()

  // 新建
  const handleSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    // 处理表单提交逻辑，例如提交数据到后端等
    // 在这里你可以调用 el-form 的 validate() 方法来校验表单
    // 如果校验通过，再执行后续的逻辑
    formEl.validate(async (valid) => {
      if (valid) {
        // const { data: res } = await service.get('/api/v1/select_poc_by_name', { params: { poc_name: curXjData.poc_name } })
        // // console.log(res);
        // if (res.code == 200) {
        //   if (res.data.exists == 0) {
        // 代表特征不重复，可以正常创建 ，走创建接口
        console.log(curXjData)

        const formData = new FormData()
        formData.append('file', fileList.value[0].raw)
        formData.append('vul_name', curXjData.vul_name)
        formData.append('vul_type', curXjData.vul_type)
        formData.append('level', curXjData.level)
        formData.append('poc_name', curXjData.poc_name)
        formData.append('poc_type', curXjData.poc_type)
        formData.append('count', curXjData.count)
        const { data: res2 } = await service.post('/api/v1/create_poc', formData)
        console.log(res2)
        xjDialogVisible.value = false
        ElMessage.success(res2.msg)
        searchClick()
        loading.value = true
        setTimeout(() => {
          searchClick()
          loading.value = false
        }, 1000)
      }
      //   } else {
      //     ElMessage.error(res.msg)
      //   }
      // } else {
      //   console.log('error submit!')
      //   return false
      // }
    })
  }

  // 新建 end -------------------
  // 编辑
  const bjForm = ref<FormInstance>()
  const handleSubmit2 = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    // 处理表单提交逻辑，例如提交数据到后端等
    // 在这里你可以调用 el-form 的 validate() 方法来校验表单
    // 如果校验通过，再执行后续的逻辑
    formEl.validate(async (valid) => {
      console.log(valid)

      if (valid) {
        const formData = new FormData()
        formData.append('poc_id', curBjData.poc_name)
        // formData.append('file', )
        formData.append('vul_name', curBjData.vul_name)
        formData.append('vul_type', curBjData.vul_type)
        formData.append('level', curBjData.level)
        formData.append('poc_name', curBjData.poc_name)
        formData.append('poc_type', curBjData.poc_type)
        formData.append('count', curBjData.count)
        formData.append('poc_file', fileList.value[0].raw)
        formData.append('create_time', curBjData.create_time)
        const { data: res } = await service.post('/api/v1/update_poc', formData)
        console.log(res)
        bjDialogVisible.value = false

        ElMessage.success(res.msg)
        searchClick()
        loading.value = true
        setTimeout(() => {
          searchClick()
          loading.value = false
        }, 1000)
      } else {
        console.log('error submit!')
        return false
      }
    })
    // bjDialogVisible.value = false // 关闭对话框
  }
  const downloadFile = () => {
    // window.location.href = curXqData.file_url
    const startIndex = curXqData.value.file_url.indexOf('/api/v1/download_poc')
    const substring = curXqData.value.file_url.substring(startIndex)
    service({
      method: 'get',
      url: substring,
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
      })
      .catch(function (res) {
        console.log('error', res)
      })
  }
</script>
<style lang="scss" scoped>
  .xjDialog > span {
    display: inline-block;
    color: #999999;
    width: 220px;
    // margin: 12px 0;
  }

  .xqDialog > span:nth-of-type(odd) {
    display: inline-block;
    color: #999999;
    width: 220px;
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
