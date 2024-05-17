<template>
  <div class="app-container demo-tabs">
    <div class="my-header">应用资产特征管理表格</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>厂商名称：</span>
            <el-input v-model="ma_name" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">产品名称：</span>
            <el-input v-model="product_name" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">产品版本：</span>
            <el-input v-model="product_version" style="width: 220px" placeholder="请输入" />
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
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
            <span style="margin-left: 10px">日期选择：</span>
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
            <!-- <el-table-column prop="chara_id" label="特征编号" min-width="120" align="center" show-overflow-tooltip /> -->
            <el-table-column prop="ma_name" label="厂商名称" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="product_name" label="产品名称" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="product_version" label="产品版本" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="chara_name" label="特征名称" sortable min-width="150" align="center" show-overflow-tooltip />
            <el-table-column prop="chara_type" label="特征类型" min-width="100" align="center" show-overflow-tooltip />
            <el-table-column prop="create_time" label="创建时间" sortable min-width="170" align="center" show-overflow-tooltip />
            <el-table-column prop="star" label="特征等级评价" sortable min-width="180" align="center">
              <template #default="{ row }">
                <el-rate v-model="row.star" show-score text-color="#ff9900" score-template="{value}星" @change="starChange(row)" />
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
        <el-form-item label="特征类型" prop="chara_type">
          <el-select v-model="curXjData.chara_type" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="特征评价等级" prop="star">
          <el-select v-model="curXjData.star" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关资产重要等级" prop="chara_level">
          <el-select v-model="curXjData.chara_level" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
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
        <el-form-item label="特征类型" prop="chara_type">
          <el-select v-model="curBjData.chara_type" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="特征评价等级" prop="star">
          <el-select v-model="curBjData.star" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关资产重要等级" prop="chara_level">
          <el-select v-model="curBjData.chara_level" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
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
  import dayjs from 'dayjs'
  const rules = ref({
    chara_id: [{ required: true, message: '请输入特征id', trigger: 'change' }],
    chara_name: [{ required: true, message: '请输入特征名称', trigger: 'blur' }],
    chara_type: [{ required: true, message: '请选择特征类型', trigger: 'change' }],
    star: [{ required: true, message: '请选择特征评价等级', trigger: 'change' }],
    chara_level: [{ required: true, message: '请选择相关资产重要等级', trigger: 'change' }],
    query_info: [{ required: true, message: '请输入查询语法', trigger: 'change' }],
  })
  let ma_name = ref('')
  let product_name = ref('')
  let product_version = ref('')
  let dateValue = ref('')
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
  let tableData = reactive([])
  let curXqData: any = ref({})
  const xqClick = (row) => {
    console.log(row)

    curXqData.value = row
    xqDialogVisible.value = true
  }
  const charaTypeOptions = ref([
    { label: 'URL特征', value: 'URL特征' },
    { label: 'IP特征', value: 'IP特征' },
  ])
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
    service.post('/api/v1/upload_chara', formData).then(({ data: res }) => {
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
    // console.log(dayjs(dateValue.value[0]).format('YYYY-MM-DD HH:mm:ss'));

    loading.value = true
    const reqData = {
      ma_name: ma_name.value,
      product_name: product_name.value,
      product_version: product_version.value,
      start_time: dateValue.value.length == 0 ? '' : dayjs(dateValue.value[0]).format('YYYY-MM-DD HH:mm:ss'),
      end_time: dateValue.value.length == 0 ? '' : dayjs(dateValue.value[1]).format('YYYY-MM-DD HH:mm:ss'),

      chara_name: tzmcInput.value,
      chara_type: tzlxValue.value,
      star: tzdjValue.value,
      chara_level: zycdValue.value,
    }
    const { data: res } = await service.get('/api/v1/search_chara', { params: reqData })
    // console.log(res)
    tableData = res.data
    loading.value = false
  }
  const resetClick = () => {
    ma_name.value = ''
    product_name.value = ''
    product_version.value = ''
    dateValue.value = ''

    tzbhInput.value = ''
    tzmcInput.value = ''
    zycdValue.value = ''
    tzlxValue.value = ''
    tzdjValue.value = ''
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
              ma_name: curXjData.ma_name,
              product_name: curXjData.product_name,
              product_version: curXjData.product_version,
            }
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
          ma_name: curBjData.ma_name,
          product_name: curBjData.product_name,
          product_version: curBjData.product_version,
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

  const starChange = async (row) => {
    curBjData = row
    const formData = {
      chara_id: curBjData.chara_id,
      chara_name: curBjData.chara_name,
      chara_type: curBjData.chara_type,
      star: curBjData.star,
      chara_level: curBjData.chara_level,

      query_info: curBjData.query_info,
      description: curBjData.description,
      ma_name: curBjData.ma_name,
      product_name: curBjData.product_name,
      product_version: curBjData.product_version,
    }
    const { data: res } = await service.post('/api/v1/update_chara', formData)
    searchClick()
    ElMessage.success(res.msg)
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
  const multDel = async (flag: string) => {
    let chara_id: Array<String>
    if (flag == 'mult') {
      chara_id = multipleSelection.value.map((item) => item.chara_id)
    } else {
      chara_id = tableData.map((item) => item.chara_id)
    }
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
      url: '/api/v1/export_asset_chara_template',
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
