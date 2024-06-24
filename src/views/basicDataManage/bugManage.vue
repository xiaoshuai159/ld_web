<template>
  <div class="app-container demo-tabs">
    <div class="my-header">漏洞信息管理表格</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>漏洞名称：</span>
            <el-input v-model="vul_name" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">危害级别：</span>
            <el-select v-model="vul_level" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in whjbOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span style="margin-left: 10px">漏洞类型：</span>
            <el-select v-model="vul_type" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in ldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px">
        <el-col :span="2"></el-col>
        <el-col :span="18">
          <div>
            <span>影响产品：</span>
            <el-input v-model="production" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">验证信息：</span>
            <el-select v-model="verified" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in yzxxOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-button type="primary" @click="dtClick">单条创建</el-button>
        <el-button type="primary" @click="xjClick">批量导入</el-button>
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
          <el-table v-loading="loading"
            :data="tableData.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)"
            style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <!-- <el-table-column prop="vul_id" label="特征编号" min-width="120" align="center" show-overflow-tooltip /> -->
            <el-table-column prop="public_date" label="公开日期" sortable min-width="170" align="center"
              show-overflow-tooltip />
            <el-table-column prop="vul_name" label="漏洞名称" sortable min-width="150" align="center"
              show-overflow-tooltip />
            <el-table-column prop="cnvd_id" label="CNVD编号" min-width="150" align="center" show-overflow-tooltip />
            <el-table-column prop="cve_id" label="CVE编号" min-width="150" align="center" show-overflow-tooltip />
            <el-table-column prop="vul_type" label="漏洞类型" min-width="100" align="center" show-overflow-tooltip />
            <el-table-column prop="vul_level" label="危害级别" sortable min-width="180" align="center"
              show-overflow-tooltip />

            <el-table-column prop="vul_from" label="漏洞来源" min-width="180" align="center" show-overflow-tooltip />
            <el-table-column prop="verified" label="验证信息" min-width="180" align="center" show-overflow-tooltip />

            <el-table-column prop="production" label="影响产品" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="description" label="漏洞描述" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="solution" label="解决方案" min-width="130" align="center" show-overflow-tooltip />
            <!-- <el-table-column prop="file_url" label="附件下载链接" min-width="130" align="center" show-overflow-tooltip /> -->
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
          <div style="display: inline-block; color: rgba(0, 0, 0, 0.427450980392157)">共 {{ tableData.length }} 条记录，第 {{
            pagination.currentPage }} /
            {{ Math.ceil(tableData.length / pagination.pageSize) }} 页</div>
          <div style="display: flex; justify-content: right; margin-top: -24px">
            <el-pagination background :current-page="pagination.currentPage" :page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100, 300]" layout="sizes, prev, pager, next, jumper" :total="tableData.length"
              @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="1"></el-col>
    </el-row>
    <el-dialog v-model="xqDialogVisible" title="详情信息" width="35%">
      <div class="xqDialog">
        <span>漏洞名称</span><span>{{ curXqData.vul_name }}</span><br />
        <span>CNVD编号</span><span>{{ curXqData.cnvd_id }}</span><br />
        <span>CVE编号</span><span>{{ curXqData.cve_id }}</span><br />
        <span>危害级别</span><span>{{ curXqData.vul_level }}</span><br />
        <span>公开日期</span><span>{{ curXqData.public_date }}</span><br />
        <span>影响产品</span><span>{{ curXqData.production }}</span><br />
        <span>漏洞描述</span><span>{{ curXqData.description }}</span><br />
        <span>解决方案</span><span>{{ curXqData.solution }}</span><br />
        <span>漏洞类型</span><span>{{ curXqData.vul_type }}</span><br />
        <span>漏洞来源</span><span>{{ curXqData.vul_from }}</span><br />
        <span>报送时间</span><span>{{ curXqData.get_date }}</span><br />
        <span>收录时间</span><span>{{ curXqData.first_date }}</span><br />
        <span>更新时间</span><span>{{ curXqData.update_date }}</span><br />
        <span>附件</span><span style="color: blue; cursor: pointer" @click="downloadFile">下载</span>
      </div>
    </el-dialog>
    <el-dialog v-model="xjDialogVisible" title="新建" width="30%">
      <el-form ref="xjForm" :model="curXjData" :rules="rules" label-width="140px">
        <el-form-item label="漏洞名称" prop="vul_name">
          <el-input v-model="curXjData.vul_name" placeholder="请输入漏洞名称" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="CNVD编号" prop="cnvd_id">
          <el-input v-model="curXjData.cnvd_id" placeholder="请输入CNVD编号" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="CVE编号" prop="cve_id">
          <el-input v-model="curXjData.cve_id" placeholder="请输入CVE编号" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="危害级别" prop="vul_level">
          <el-select v-model="curXjData.vul_level" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in whjbOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="公开日期" prop="public_date">
          <el-date-picker v-model="curXjData.public_date" type="datetime" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="验证信息" prop="verified">
          <el-select v-model="curXjData.verified" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit2(xjForm)">
            <el-option v-for="item in yzxxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="影响产品" prop="production">
          <el-input v-model="curXjData.production" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="漏洞描述" prop="description">
          <el-input v-model="curXjData.description" placeholder="请输入描述信息" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="解决方案" prop="solution">
          <el-input v-model="curXjData.solution" placeholder="请输入解决方案" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="漏洞类型" prop="vul_type">
          <el-select v-model="curXjData.vul_type" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in ldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞来源" prop="vul_from">
          <el-input v-model="curXjData.vul_from" placeholder="请输入漏洞来源" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="报送时间" prop="get_date">
          <el-date-picker v-model="curXjData.get_date" type="datetime" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="收录时间" prop="first_date">
          <el-date-picker v-model="curXjData.first_date" type="datetime" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="更新时间" prop="update_date">
          <el-date-picker v-model="curXjData.update_date" type="datetime" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="附件" prop="file">
          <el-upload v-model:file-list="curXjData.file" style="width: 220px" class="upload-demo" drag action="#"
            :auto-upload="false" :limit="1">
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
        <el-form-item label="漏洞id" prop="vul_id">
          <el-input v-model="curBjData.vul_id" disabled placeholder="请输入漏洞id" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="漏洞名称" prop="vul_name">
          <el-input v-model="curBjData.vul_name" placeholder="请输入漏洞名称" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="CNVD编号" prop="cnvd_id">
          <el-input v-model="curBjData.cnvd_id" placeholder="请输入CNVD编号" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="CVE编号" prop="cve_id">
          <el-input v-model="curBjData.cve_id" placeholder="请输入CVE编号" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="危害级别" prop="vul_level">
          <el-select v-model="curBjData.vul_level" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in whjbOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="公开日期" prop="public_date">
          <el-date-picker v-model="curBjData.public_date" type="datetime" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="验证信息" prop="verified">
          <el-select v-model="curBjData.verified" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in yzxxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="影响产品" prop="production">
          <el-input v-model="curBjData.production" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="漏洞描述" prop="description">
          <el-input v-model="curBjData.description" placeholder="请输入描述信息" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="解决方案" prop="solution">
          <el-input v-model="curBjData.solution" placeholder="请输入解决方案" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="漏洞类型" prop="vul_type">
          <el-select v-model="curBjData.vul_type" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in ldlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞来源" prop="vul_from">
          <el-input v-model="curBjData.vul_from" placeholder="请输入漏洞来源" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="报送时间" prop="get_date">
          <el-date-picker v-model="curBjData.get_date" type="datetime" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="收录时间" prop="first_date">
          <el-date-picker v-model="curBjData.first_date" type="datetime" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="更新时间" prop="update_date">
          <el-date-picker v-model="curBjData.update_date" type="datetime" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="附件" prop="file">
          <el-upload v-model:file-list="curBjData.file" style="width: 220px" class="upload-demo" drag action="#"
            :auto-upload="false" :limit="1">
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
      <div
        style="text-align: center; height: 140px; line-height: 140px; border: 1px #dddddd Dashed; border-radius: 5px">
        <el-button :icon="Upload" @click="wjClick" :disabled="showProgress">上传文件</el-button>
        <div><el-progress style="transform: translate(20px,2px)" :percentage="100" status="warning"
            :indeterminate="true" :duration="1" v-if="showProgress" /><br /></div>
        <!-- <span style="margin: 0 10px 0 16px; color: #b3b3b3">/</span>
        <el-button link type="info" @click="dtClick">手动输入（单条创建）</el-button> -->
      </div>
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <el-icon color="#1890ff" size="20">
          <InfoFilled />
        </el-icon>
        <span style="color: #b3b3b3">请上传csv文件，点击<span style="color: blue; cursor: pointer"
            @click="downloadTemplate">下载模板</span></span>
      </div>
    </el-dialog>
    <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
  </div>
</template>
<script lang="ts" setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref, reactive, onMounted, Ref } from 'vue'
import service from '@/api/request'
import dayjs from 'dayjs'
import { ElMessage, type FormInstance, ElMessageBox } from 'element-plus'
const rules = ref({
  cnvd_id: [{ required: true, message: '请输入CNVD编号', trigger: 'change' }],
  vul_name: [{ required: true, message: '请输入漏洞名称', trigger: 'blur' }],
  vul_type: [{ required: true, message: '请选择漏洞类型', trigger: 'change' }],
  public_date: [{ required: true, message: '请选择公开日期', trigger: 'change' }],
  production: [{ required: true, message: '请输入影响产品', trigger: 'change' }],
  vul_from: [{ required: true, message: '请输入漏洞来源', trigger: 'change' }],
  vul_level: [{ required: true, message: '请输入危害等级', trigger: 'change' }],
  verified: [{ required: true, message: '请选择验证信息', trigger: 'change' }],
})
let loading = ref(false)
let xqDialogVisible = ref(false)
let xjDialogVisible = ref(false)
let bjDialogVisible = ref(false)
let showProgress = ref(false)
let vul_name = ref('')
let vul_level = ref('')
let vul_type = ref('')
let production = ref('')
let verified = ref('')
const yzxxOptions = ref([
  { value: '已验证', label: '已验证' },
  { value: '未验证', label: '未验证' },
])
const whjbOptions = ref([
  { label: '低', value: '低' },
  { label: '中', value: '中' },
  { label: '高', value: '高' },
  { label: '严', value: '严' },
])
const ldlxOptions = ref([
  { label: '通用型漏洞', value: '通用型漏洞' },
  { label: '事件型漏洞', value: '事件型漏洞' },
])

const tzbhInput = ref('')
const tzmcInput = ref('')
const tzlxValue = ref('')
const tzdjValue = ref('')
const zycdValue = ref('')
let zycdOptions = ref([
  { label: '低', value: '低' },
  { label: '中', value: '中' },
  { label: '高', value: '高' },
])
let tzlxOptions = ref([
  { label: 'URL特征', value: 'URL特征' },
  { label: 'IP特征', value: 'IP特征' },
  { label: '端口特征', value: '端口特征' },
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
let curXjData: any = reactive({})
let curBjData: any = reactive({
  vul_name: '',
  vul_type: '',
  star: '',
  vul_level: '',
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
  showProgress.value = true
  file = event.target.files[0]
  const formData = new FormData()
  formData.append('file', file)
  service.post('/api/v1/upload_vul', formData).then(({ data: res }) => {
    console.log(res)
    if (res.code == 200) {
      ElMessage.success('上传成功')
      wjDialogVisible.value = false
      showProgress.value = false
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
      showProgress.value = false
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
  pagination.pageSize = val // 更新每页显示的数据数量
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
  loading.value = true
  const reqData = {
    vul_name: vul_name.value,
    vul_type: vul_type.value,
    vul_level: vul_level.value,
    production: production.value,
    verified: verified.value,
  }
  const { data: res } = await service.get('/api/v1/search_vul', { params: reqData })
  // console.log(res)
  tableData.value = res.data
  loading.value = false
}
const resetClick = () => {
  vul_name.value = ''
  vul_level.value = ''
  vul_type.value = ''
  production.value = ''
  verified.value = ''
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
      console.log(curXjData.file)

      const formData = new FormData()
      formData.append('vul_name', curXjData.vul_name)
      formData.append('cnvd_id', curXjData.cnvd_id)
      formData.append('cve_id', curXjData.cve_id)
      formData.append('vul_level', curXjData.vul_level)
      formData.append('public_date', dayjs(curXjData.public_date).format('YYYY-MM-DD'))
      formData.append('production', curXjData.production)
      formData.append('description', curXjData.description)
      formData.append('solution', curXjData.solution)
      formData.append('vul_type', curXjData.vul_type)
      formData.append('vul_from', curXjData.vul_from)
      formData.append('verified', curXjData.verified)
      formData.append('get_date', dayjs(curXjData.get_date).format('YYYY-MM-DD'))
      formData.append('first_date', dayjs(curXjData.first_date).format('YYYY-MM-DD'))
      formData.append('update_date', dayjs(curXjData.update_date).format('YYYY-MM-DD'))
      if (curXjData.file && curXjData.file.length) {
        formData.append('file', curXjData.file[0].raw)
      }

      const { data: res2 } = await service.post('/api/v1/create_vul', formData)
      if (res2.code == 200) {
        console.log(res2)
        xjDialogVisible.value = false
        // searchClick()
        ElMessage.success(res2.msg)
        searchClick()
        loading.value = true
        setTimeout(() => {
          searchClick()
          loading.value = false
        }, 1000)
        curXjData.vul_name = ''
        curXjData.cnvd_id = ''
        curXjData.cve_id = ''
        curXjData.vul_level = ''
        curXjData.public_date = ''
        curXjData.production = ''
        curXjData.description = ''
        curXjData.solution = ''
        curXjData.vul_type = ''
        curXjData.vul_from = ''
        curXjData.verified = ''
        curXjData.get_date = ''
        curXjData.first_date = ''
        curXjData.update_date = ''
        curXjData.file = ''
      }

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
      const formData = new FormData()
      if (curBjData.file && curBjData.file.length) {
        formData.append('file', curBjData.file[0].raw)
      }else{
        formData.append('file', curBjData.file_url)
      }
      formData.append('vul_id', curBjData.vul_id)
      formData.append('vul_name', curBjData.vul_name)
      formData.append('cnvd_id', curBjData.cnvd_id)
      formData.append('cve_id', curBjData.cve_id)
      formData.append('vul_level', curBjData.vul_level)
      formData.append('public_date', dayjs(curBjData.public_date).format('YYYY-MM-DD'))
      formData.append('production', curBjData.production)
      formData.append('description', curBjData.description)
      formData.append('solution', curBjData.solution)
      formData.append('vul_type', curBjData.vul_type)
      formData.append('vul_from', curBjData.vul_from)
      formData.append('verified', curBjData.verified)
      formData.append('get_date', dayjs(curBjData.get_date).format('YYYY-MM-DD'))
      formData.append('first_date', dayjs(curBjData.first_date).format('YYYY-MM-DD'))
      formData.append('update_date', dayjs(curBjData.update_date).format('YYYY-MM-DD'))
      
      // const formData = {
      //   vul_id: curBjData.vul_id,
      //   vul_name: curBjData.vul_name,
      //   vul_type: curBjData.vul_type,
      //   star: curBjData.star,
      //   vul_level: curBjData.vul_level,
      //   query_info: curBjData.query_info,
      //   description: curBjData.description,
      //   ma_name: curBjData.ma_name,
      //   product_name: curBjData.product_name,
      //   product_version: curBjData.product_version,
      // }
      const { data: res } = await service.post('/api/v1/update_vul', formData)
      console.log(res)
      if (res.code == 200) {
        bjDialogVisible.value = false

        ElMessage.success(res.msg)
        searchClick()
        loading.value = true
        setTimeout(() => {
          searchClick()
          loading.value = false
        }, 1000)
      }

    } else {
      console.log('error submit!')
      return false
    }
  })
  // bjDialogVisible.value = false // 关闭对话框
}
const del = async (row) => {
  const { vul_id } = row
  const vulIds = [vul_id]

  ElMessageBox.confirm('是否确定删除此条数据?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { data: res } = await service.post('/api/v1/delete_vul', { vul_id: vulIds })
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
const multDel = async (flag: string) => {
  let vul_id: Array<String>
  if (flag == 'mult') {
    vul_id = multipleSelection.value.map((item) => item.vul_id)
  } else {
    vul_id = tableData.value.map((item) => item.vul_id)
  }
  if(vul_id.length == 0){
      ElMessage.error("请选择需要删除的数据！")
      return false
    }
  // const vul_id = multipleSelection.value.map((item) => item.vul_id)
  ElMessageBox.confirm('是否确定删除数据?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const { data: res } = await service.post('/api/v1/delete_vul', { vul_id })
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
  const vul_id = multipleSelection.value.map((item) => item.vul_id)
  console.log(vul_id)
  if(vul_id.length == 0){
      ElMessage.error("请选择需要导出的数据！")
      return false
    }
  service({
    method: 'post',
    url: '/api/v1/export_vul',
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
    url: '/api/v1/export_vul_template',
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
const downloadFile = () => {
  console.log(curXqData.value.file_url)

  // window.location.href = curXqData.file_url
  const startIndex = curXqData.value.file_url.indexOf('/api/v1/download_vul_file')
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
.xjDialog>span {
  display: inline-block;
  color: #999999;
  width: 220px;
  // margin: 12px 0;
}

.xqDialog>span:nth-of-type(odd) {
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
