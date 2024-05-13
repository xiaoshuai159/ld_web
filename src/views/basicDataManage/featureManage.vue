<template>
  <div class="app-container demo-tabs">
    <div class="my-header">资产归属管理表格</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>资产名称：</span>
            <el-input v-model="asset_name" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">资产类型：</span>
            <el-select v-model="asset_type" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in zclxOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span style="margin-left: 10px">资产星级：</span>
            <el-select v-model="asset_star" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in zcxjOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>相关资产重要程度：</span>
            <el-select v-model="asset_level" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in xgzczycdOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <!-- <span>特征编号：</span>
              <el-input v-model="tzbhInput" style="width: 220px" placeholder="请输入" /> -->
            <span style="margin-left: 10px">资产归属地区：</span>
            <el-input v-model="asset_area" style="width: 220px" placeholder="请输入" />

            <span style="margin-left: 10px">资产备案信息：</span>
            <el-input v-model="asset_icp" style="width: 220px" placeholder="请输入" />
          </div>
        </el-col>
      </el-row>

      <!-- <el-row style="margin-top: 10px">
          <el-col :span="2"></el-col>
          <el-col :span="18">
            <div>
              <span>特征类型：</span>
              <el-select v-model="tzlxValue" placeholder="请选择" style="width: 220px">
                <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              
            </div>
          </el-col>
        </el-row> -->
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
            <!-- <el-table-column prop="asset_id" label="特征编号" min-width="120" align="center" show-overflow-tooltip /> -->
            <el-table-column prop="asset_name" label="资产名称" sortable min-width="150" align="center" show-overflow-tooltip />
            <el-table-column prop="asset_type" label="资产类型" min-width="100" align="center" show-overflow-tooltip />
            <el-table-column prop="star" label="评价星级" sortable min-width="180" align="center">
              <template #default="{ row }">
                <el-rate v-model="row.star" disabled show-score text-color="#ff9900" score-template="{value}星" />
              </template>
            </el-table-column>
            <el-table-column prop="asset_level" label="相关资产重要程度" sortable min-width="180" align="center" show-overflow-tooltip />
            <el-table-column prop="ma_name" label="厂商名称" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="product_name" label="产品名称" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="product_version" label="产品版本" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="asset_unit" label="资产归属单位" min-width="180" align="center" show-overflow-tooltip />
            <el-table-column prop="asset_icp" label="资产备案信息" min-width="180" align="center" show-overflow-tooltip />
            <el-table-column prop="labels" label="资产标签" min-width="180" align="center" show-overflow-tooltip />
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
        <span>资产特征id</span><span>{{ curXqData.asset_id }}</span
        ><br />
        <span>资产名称</span><span>{{ curXqData.asset_name }}</span
        ><br />
        <span>资产类型</span><span>{{ curXqData.asset_type }}</span
        ><br />
        <span>评价星级</span
        ><span> <el-rate v-model="curXqData.star" disabled show-score text-color="#ff9900" score-template="{value}星" /> </span><br />
        <span>相关资产重要程度</span><span>{{ curXqData.asset_level }}</span
        ><br />
        <span>厂商名称</span><span>{{ curXqData.ma_name }}</span
        ><br />
        <span>产品名称</span><span>{{ curXqData.product_name }}</span
        ><br />
        <span>产品版本</span><span>{{ curXqData.product_version }}</span
        ><br />
        <span>资产归属单位</span><span>{{ curXqData.asset_unit }}</span
        ><br />
        <span>资产备案信息</span><span>{{ curXqData.asset_icp }}</span
        ><br />
        <span>资产标签</span><span>{{ curXqData.labels }}</span>
      </div>
    </el-dialog>
    <el-dialog v-model="xjDialogVisible" title="新建" width="30%">
      <el-form ref="xjForm" :model="curXjData" :rules="rules" label-width="140px">
        <el-form-item label="资产名称" prop="asset_name">
          <el-input v-model="curXjData.asset_name" placeholder="请输入资产名称" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="资产类型" prop="asset_type">
          <el-select v-model="curXjData.asset_type" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="评价星级" prop="star">
          <el-select v-model="curXjData.star" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关资产重要程度" prop="asset_level">
          <el-select v-model="curXjData.asset_level" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in zycdOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
        <el-form-item label="资产归属单位" prop="asset_unit">
          <el-input
            v-model="curXjData.asset_unit"
            placeholder="请输入资产归属单位"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item label="资产备案信息" prop="asset_icp">
          <el-input
            v-model="curXjData.asset_icp"
            placeholder="请输入资产备案信息"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item label="资产标签" prop="labels">
          <el-input v-model="curXjData.labels" placeholder="请输入资产标签" style="width: 220px" type="textarea" :rows="3" />
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
        <el-form-item label="资产名称" prop="asset_name">
          <el-input v-model="curBjData.asset_name" placeholder="请输入资产名称" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="资产类型" prop="asset_type">
          <el-select v-model="curBjData.asset_type" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="评价星级" prop="star">
          <el-select v-model="curBjData.star" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关资产重要程度" prop="asset_level">
          <el-select v-model="curBjData.asset_level" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in zycdOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
        <el-form-item label="资产归属单位" prop="asset_unit">
          <el-input
            v-model="curBjData.asset_unit"
            placeholder="请输入资产归属单位"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item label="资产备案信息" prop="asset_icp">
          <el-input
            v-model="curBjData.asset_icp"
            placeholder="请输入资产备案信息"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item label="资产标签" prop="labels">
          <el-input v-model="curBjData.labels" placeholder="请输入资产标签" style="width: 220px" type="textarea" :rows="3" />
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
        <span style="color: #b3b3b3"
          >请上传csv文件，大小在60M以内，点击<span style="color: blue; cursor: pointer" @click="downloadTemplate">下载模板</span></span
        >
      </div>
    </el-dialog>
    <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
  </div>
</template>
<script lang="ts" setup>
  import { Plus, Upload } from '@element-plus/icons-vue'
  import { ref, reactive, onMounted, Ref } from 'vue'
  import service from '@/api/request'
  import { ElMessage, type FormInstance, ElMessageBox } from 'element-plus'
  const rules = ref({
    asset_id: [{ required: true, message: '请输入特征id', trigger: 'change' }],
    asset_name: [{ required: true, message: '请输入特征名称', trigger: 'blur' }],
    asset_type: [{ required: true, message: '请选择特征类型', trigger: 'change' }],
    star: [{ required: true, message: '请选择特征评价等级', trigger: 'change' }],
    asset_level: [{ required: true, message: '请选择相关资产重要等级', trigger: 'change' }],
    query_info: [{ required: true, message: '请输入查询语法', trigger: 'change' }],
  })
  let asset_name = ref('')
  let asset_type = ref('')
  let asset_star = ref('')
  let asset_level = ref('')
  let asset_area = ref('')
  let asset_icp = ref('')
  let zclxOptions = ref([
    { label: '文件特征', value: '文件特征' },
    { label: '网路特征', value: '网路特征' },
    { label: '进程特征', value: '进程特征' },
  ])
  let zcxjOptions = ref([
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
  ])
  let xgzczycdOptions = ref([
    { label: '低', value: '低' },
    { label: '中', value: '中' },
    { label: '高', value: '高' },
    { label: '严', value: '严' },
  ])
  let loading = ref(false)
  let xqDialogVisible = ref(false)
  let xjDialogVisible = ref(false)
  let bjDialogVisible = ref(false)

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
  const assetTypeOptions = ref([
    { label: 'URL特征', value: 'URL特征' },
    { label: 'IP特征', value: 'IP特征' },
  ])
  let curXjData: any = reactive({
    asset_name: '',
    asset_type: '',
    star: '',
    asset_level: '',
    query_info: '',
    description: '',
  })
  let curBjData: any = reactive({
    asset_name: '',
    asset_type: '',
    star: '',
    asset_level: '',
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
    service.post('/api/v1/upload_asset', formData).then(({ data: res }) => {
      console.log(res)
      if (res.code == 200) {
        ElMessage.success('上传成功')
        wjDialogVisible.value = false
        file = null
        event.target.value = ''
      } else {
        ElMessage.error(res.msg)
        file = null
        event.target.value = ''
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

  const searchClick = async () => {
    loading.value = true
    const reqData = {
      asset_name: asset_name.value,
      asset_type: asset_type.value,
      asset_star: asset_star.value,
      asset_level: asset_level.value,
      asset_area: asset_area.value,
      asset_icp: asset_icp.value,
    }
    const { data: res } = await service.get('/api/v1/search_asset', { params: reqData })
    // console.log(res)
    tableData.value = res.data
    loading.value = false
  }
  const resetClick = () => {
    asset_name.value = ''
    asset_type.value = ''
    asset_star.value = ''
    asset_level.value = ''
    asset_area.value = ''
    asset_icp.value = ''
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
        const { data: res } = await service.get('/api/v1/search_asset_by_name', { params: { asset_name: curXjData.asset_name } })
        // console.log(res);
        if (res.code == 200) {
          if (res.data.exists == 0) {
            // 代表特征不重复，可以正常创建 ，走创建接口
            const formData = {
              asset_name: curXjData.asset_name,
              asset_type: curXjData.asset_type,
              star: curXjData.star,
              asset_level: curXjData.asset_level,
              query_info: curXjData.query_info,
              description: curXjData.description,
              ma_name: curXjData.ma_name,
              product_name: curXjData.product_name,
              product_version: curXjData.product_version,
            }
            const { data: res2 } = await service.post('/api/v1/create_asset', formData)
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
          asset_id: curBjData.asset_id,
          asset_name: curBjData.asset_name,
          asset_type: curBjData.asset_type,
          star: curBjData.star,
          asset_level: curBjData.asset_level,
          query_info: curBjData.query_info,
          description: curBjData.description,
          ma_name: curBjData.ma_name,
          product_name: curBjData.product_name,
          product_version: curBjData.product_version,
        }
        const { data: res } = await service.post('/api/v1/update_asset', formData)
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
    const { asset_id } = row
    const assetIds = [asset_id]

    ElMessageBox.confirm('是否确定删除此条数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_asset', { asset_id: assetIds })
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
    const asset_id = multipleSelection.value.map((item) => item.asset_id)
    ElMessageBox.confirm('是否确定删除选中数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_asset', { asset_id })
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
    const asset_id = multipleSelection.value.map((item) => item.asset_id)
    console.log(asset_id)

    service({
      method: 'post',
      url: '/api/v1/export_asset',
      data: { asset_id },
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
      url: '/api/v1/export_asset_template',
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
