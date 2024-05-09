<template>
  <div class="app-container demo-tabs">
    <div class="my-header">漏洞攻击特征管理表格</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>攻击特征编码：</span>
            <el-input v-model="gjtzbmInput" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">特征名称：</span>
            <el-input v-model="tzmcInput" style="width: 220px" placeholder="请输入" />

            <span style="margin-left: 10px">星级：</span>
            <el-select v-model="xjValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in xjOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-col :span="2"></el-col>
        <el-col :span="18">
          <div>
            <span>相关漏洞类型：</span>
            <el-select v-model="xgldlxValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in xgldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span style="margin-left: 10px">相关漏洞等级：</span>
            <el-select v-model="xglddjValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in xglddjOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-button type="primary" :icon="Plus" @click="xjClick">新建</el-button>
        <el-button @click="multDel">批量删除</el-button>
        <el-button @click="multPut">批量导出</el-button>
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
            <el-table-column prop="c_id" label="攻击特征编码" min-width="150" align="center" show-overflow-tooltip />
            <el-table-column prop="chara_name" label="特征名称" min-width="100" align="center" show-overflow-tooltip />
            <!-- <el-table-column prop="create_time" label="提取时间" min-width="180" align="center" /> -->
            <el-table-column prop="star" label="评价星级" min-width="80" align="center" show-overflow-tooltip />
            <el-table-column prop="vul_level" label="相关漏洞等级" min-width="110" align="center" show-overflow-tooltip />
            <el-table-column prop="vul_type" label="相关漏洞类型" min-width="110" align="center" show-overflow-tooltip />
            <el-table-column prop="vul_rule" label="漏洞规则定义" min-width="150" align="center" show-overflow-tooltip />
            <el-table-column prop="vul_payload" label="返回值" min-width="100" align="center" show-overflow-tooltip />
            <el-table-column prop="operator" label="操作" min-width="200" align="center" fixed="right">
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
        <span>漏洞编号</span><span>{{ curXqData.c_id }}</span
        ><br />
        <span>特征编号</span><span>{{ curXqData.vul_id }}</span
        ><br />
        <span>漏洞名称</span><span>{{ curXqData.chara_name }}</span
        ><br />
        <span>漏洞类型</span><span>{{ curXqData.vul_type }}</span
        ><br />
        <span>漏洞评价等级</span
        ><span> <el-rate v-model="curXqData.star" disabled show-score text-color="#ff9900" score-template="{value}星" /> </span><br />
        <span>危害程度</span><span>{{ curXqData.vul_level }}</span
        ><br />
        <span>漏洞规则定义</span><span>{{ curXqData.vul_rule }}</span
        ><br />
        <span>特征创建/上传日期</span><span>{{ curXqData.create_time }}</span
        ><br />
        <span>返回值</span><span>{{ curXqData.vul_payload }}</span>
      </div>
    </el-dialog>
    <el-dialog v-model="xjDialogVisible" title="新建" width="30%">
      <el-form ref="xjForm" :model="curXjData" :rules="rules" label-width="140px">
        <el-form-item label="CNVD/CVE编号" prop="c_id">
          <el-input v-model="curXjData.c_id" placeholder="请输入CNVD/CVE编号" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="特征名称" prop="vul_name">
          <el-input v-model="curXjData.vul_name" placeholder="请输入特征名称" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="评价星级" prop="star">
          <el-select v-model="curXjData.star" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in xjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关漏洞重要等级" prop="vul_level">
          <el-select v-model="curXjData.vul_level" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in xglddjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关漏洞类型" prop="vul_type">
          <el-select v-model="curXjData.vul_type" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in xgldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞规则定义" prop="vul_rule">
          <el-input
            v-model="curXjData.vul_rule"
            placeholder="请输入漏洞规则定义"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item label="返回值" prop="vul_payload">
          <el-input v-model="curXjData.vul_payload" placeholder="请输入描述信息" style="width: 220px" type="textarea" :rows="3" />
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
        <!-- <el-form-item label="特征id" prop="vul_name">
          <el-input v-model="curBjData.vul_id" placeholder="请输入特征id" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item> -->
        <el-form-item label="CNVD/CVE编号" prop="c_id">
          <el-input v-model="curBjData.c_id" placeholder="请输入CNVD/CVE编号" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="特征名称" prop="chara_name">
          <el-input v-model="curBjData.chara_name" placeholder="请输入特征名称" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="评价星级" prop="star">
          <el-select v-model="curBjData.star" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in xglddjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关漏洞重要等级" prop="vul_level">
          <el-select v-model="curBjData.vul_level" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in xjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关漏洞类型" prop="vul_type">
          <el-select v-model="curBjData.vul_type" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in xgldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞规则定义" prop="vul_rule">
          <el-input
            v-model="curBjData.vul_rule"
            placeholder="请输入漏洞规则定义"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item label="返回值" prop="vul_payload">
          <el-input v-model="curBjData.vul_payload" placeholder="请输入描述信息" style="width: 220px" type="textarea" :rows="3" />
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
        <span style="color: #b3b3b3">请上传json文件，大小在60M以内，内容格式为</span>
      </div>
    </el-dialog>
    <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
  </div>
</template>
<script lang="ts" setup>
  import { Plus, Upload } from '@element-plus/icons-vue'
  import { ref, reactive, onMounted, Ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage, type FormInstance, ElMessageBox } from 'element-plus'
  import service from '@/api/request'
  const searchInput = ref('')
  const gjtzbmInput = ref('')
  const tzbhInput = ref('')
  const tzmcInput = ref('')
  const xgldlxValue = ref('')
  const xglddjValue = ref('')
  const sxztValue = ref('')
  const xjValue = ref('')
  let xqDialogVisible = ref(false)
  let xjDialogVisible = ref(false)
  let bjDialogVisible = ref(false)
  let wjDialogVisible = ref(false)
  let xjOptions = ref([
    { label: '低', value: 0 },
    { label: '中', value: 1 },
    { label: '高', value: 2 },
    { label: '严', value: 3 },
  ])
  let xgldlxOptions = ref([
    { label: '事件型漏洞', value: '事件型漏洞' },
    { label: '通用型漏洞', value: '通用型漏洞' },
  ])
  let xglddjOptions = ref([
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
  ])
  const rules = ref({
    c_id: [{ required: true, message: '请输入cnvd/cve编号', trigger: 'change' }],
    // vul_id: [{ required: true, message: '请输入特征id', trigger: 'change' }],
    // vul_name: [{ required: true, message: '请输入特征名称', trigger: 'blur' }],
    vul_type: [{ required: true, message: '请选择特征类型', trigger: 'change' }],
    // star: [{ required: true, message: '请选择特征评价等级', trigger: 'change' }],
    // vul_level: [{ required: true, message: '请选择相关资产重要等级', trigger: 'change' }],
    // vul_rule: [{ required: true, message: '请输入漏洞规则定义', trigger: 'change' }],
  })
  let sxztOptions = ref([
    { label: '生效', value: 1 },
    { label: '失效', value: 0 },
  ])
  let tableData = ref([])
  let curChain = ref('')
  let curXqData: any = ref({})
  const xqClick = (row) => {
    console.log(row)

    curXqData.value = row
    xqDialogVisible.value = true
  }
  const vulTypeOptions = ref([
    { label: 'URL特征', value: 'URL特征' },
    { label: 'IP特征', value: 'IP特征' },
  ])
  let curXjData: any = reactive({
    vul_name: '',
    vul_type: '',
    star: '',
    vul_level: '',
    vul_rule: '',
    vul_payload: '',
  })
  let curBjData: any = reactive({
    vul_name: '',
    vul_type: '',
    star: '',
    vul_level: '',
    vul_rule: '',
    vul_payload: '',
  })
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
    service
      .post('/api/v1/upload_asset', {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data: res }) => {
        console.log(res)
        if (res.code == 200) {
          ElMessage.success('上传成功')
          wjDialogVisible.value = false
        } else {
          ElMessage.error(res.msg)
        }
      })
  }
  const xjClick = () => {
    wjDialogVisible.value = true
    // xjDialogVisible.value = true
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
  onMounted(() => {
    searchClick()
    fileInputRef.value = document.querySelector('input[type=file]')
  })
  const searchClick = async () => {
    const reqData = {
      c_id: gjtzbmInput.value,
      vul_name: tzmcInput.value,
      vul_type: xgldlxValue.value,
      star: xglddjValue.value,
      vul_level: xjValue.value,
    }
    const { data: res } = await service.get('/api/v1/search_vul_chara', { params: reqData })
    // console.log(res)
    tableData.value = res.data
  }
  const resetClick = () => {
    gjtzbmInput.value = ''
    tzbhInput.value = ''
    tzmcInput.value = ''
    xjValue.value = ''
    xgldlxValue.value = ''
    xglddjValue.value = ''
    searchClick()
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
        // const { data: res } = await service.get('/api/v1/search_vul_by_name', { params: { vul_name: curXjData.vul_name } })
        // // console.log(res);
        // if (res.code == 200) {
        //   if (res.data.exists == 0) {
        //     // 代表特征不重复，可以正常创建 ，走创建接口
        const formData = {
          vul_name: curXjData.vul_name,
          vul_type: curXjData.vul_type,
          star: curXjData.star,
          vul_level: curXjData.vul_level,
          vul_rule: curXjData.vul_rule,
          vul_payload: curXjData.vul_payload,
        }
        const { data: res2 } = await service.post('/api/v1/create_vul_chara', formData)
        console.log(res2)
        xjDialogVisible.value = false
        searchClick()
        ElMessage.success(res2.msg)
        //   } else {
        //     // 代表特征名称重复
        //     ElMessage.error('该特征名称已存在，请重新输入！')
        //   }
        // } else {
        //   ElMessage.error(res.msg)
        // }
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
          c_id: curBjData.c_id,
          chara_id: curBjData.chara_id,
          // vul_id: curBjData.vul_id,
          chara_name: curBjData.chara_name,
          vul_type: curBjData.vul_type,
          star: curBjData.star,
          vul_level: curBjData.vul_level,

          vul_rule: curBjData.vul_rule,
          vul_payload: curBjData.vul_payload,
        }
        const { data: res } = await service.post('/api/v1/update_vul_chara', formData)
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
    const vulIds = [chara_id]

    ElMessageBox.confirm('是否确定删除此条数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_vul_chara', { chara_id: vulIds })
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
    const chara_id = multipleSelection.value.map((item) => item.chara_id)
    ElMessageBox.confirm('是否确定删除选中数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_vul_chara', { chara_id })
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
    const vul_id = multipleSelection.value.map((item) => item.vul_id)
    console.log(vul_id)

    service({
      method: 'post',
      url: '/api/v1/export_vul_chara',
      data: { vul_id },
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

  const editHandler = (row) => {
    curBjData = row
    bjDialogVisible.value = true
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
