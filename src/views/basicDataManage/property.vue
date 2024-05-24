<template>
  <div class="app-container demo-tabs">
    <div class="my-header">应用资产管理表格</div>
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
            <span>资产名称：</span>
            <el-input v-model="zcmcInput" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">资产归属地区：</span>
            <el-input v-model="zcgsdqInput" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">资产等级：</span>
            <el-select v-model="zcdjValue" placeholder="请选择" style="width: 220px">
              <el-option v-for="item in zcdjOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
            <span style="margin-left: 10px">日期选择：</span>
            <el-date-picker
              v-model="dateValue"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="transform: translateY(2px)"
            />
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
            <el-table-column prop="ma_name" label="厂商名称" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="product_name" label="产品名称" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="product_version" label="产品版本" min-width="130" align="center" show-overflow-tooltip />
            <!-- <el-table-column prop="asset_id" label="资产编号" min-width="120" align="center" show-overflow-tooltip /> -->
            <el-table-column prop="asset_name" label="资产名称" min-width="150" align="center" show-overflow-tooltip sortable />
            <el-table-column prop="asset_type" label="资产类型" min-width="100" align="center" show-overflow-tooltip />
            <el-table-column prop="create_time" label="资产录入时间" min-width="180" align="center" show-overflow-tooltip sortable />
            <!-- <el-table-column prop="asset_unit" label="资产归属单位" min-width="180" align="center" show-overflow-tooltip
              sortable /> -->
            <el-table-column prop="star" label="资产等级" min-width="130" align="center" show-overflow-tooltip sortable>
              <template #default="{ row }">
                <el-rate v-model="row.star" show-score text-color="#ff9900" score-template="{value}星" @change="starChange(row)" />
              </template>
            </el-table-column>

            <el-table-column prop="icp" label="备案信息" min-width="180" align="center" show-overflow-tooltip />
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
              :page-sizes="[10, 20, 50, 100, 300]"
              layout="sizes, prev, pager, next, jumper"
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
        <span>资产编号</span><span>{{ curXqData.asset_id }}</span
        ><br />
        <span>资产名称</span><span>{{ curXqData.asset_name }}</span
        ><br />
        <span>资产类型</span><span>{{ curXqData.asset_type }}</span
        ><br />
        <!-- <span>资产归属单位</span><span>{{ curXqData.asset_unit }}</span><br /> -->
        <span>评价星级</span><span>{{ curXqData.star }}</span
        ><br />
        <span>资产来源</span><span>{{ curXqData.asset_from }}</span
        ><br />

        <span>备案信息</span><span>{{ curXqData.icp }}</span
        ><br />
        <span>资产归属地区</span><span>{{ curXqData.asset_area }}</span
        ><br />
        <span>资产内容</span><span>{{ curXqData.asset_li }}</span
        ><br />
        <span>资产录入时间</span><span>{{ curXqData.create_time }}</span
        ><br />
        <span>相关资产特征</span><span>{{ curXqData.description }}</span
        ><br />
        <span>标签</span><span>{{ curXqData.labels }}</span
        ><br />
      </div>
    </el-dialog>
    <el-dialog v-model="xjDialogVisible" title="新建" width="30%">
      <el-form ref="xjForm" :model="curXjData" :rules="rules" label-width="140px">
        <el-form-item label="资产名称" prop="asset_name">
          <el-input v-model="curXjData.asset_name" placeholder="请输入特征名称" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="资产类型" prop="asset_type">
          <el-select v-model="curXjData.asset_type" placeholder="请选择资产类型" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关资产特征名称" prop="chara_name">
          <el-input
            v-model="curXjData.chara_name"
            placeholder="请输入资产特征，以逗号分隔"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item label="评价星级" prop="star">
          <el-select v-model="curXjData.star" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="资产归属单位" prop="asset_unit">
          <el-input v-model="curXjData.asset_unit" placeholder="请输入资产归属单位" style="width: 220px" />
        </el-form-item> -->

        <el-form-item label="资产备案信息" prop="icp">
          <el-input v-model="curXjData.icp" placeholder="请输入备案信息" style="width: 220px" />
        </el-form-item>
        <el-form-item label="资产重要程度" prop="asset_level">
          <el-select v-model="curXjData.asset_level" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in zycdOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="资产归属地区" prop="asset_area">
          <el-input v-model="curXjData.asset_area" placeholder="请输入描述信息" style="width: 220px" />
        </el-form-item>
        <el-form-item label="资产信息" prop="asset_li">
          <el-input v-model="curXjData.asset_li" placeholder="请输入资产信息" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
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
        <el-form-item label="资产id" prop="asset_id">
          <el-input
            v-model="curBjData.asset_id"
            disabled
            placeholder="请输入资产id"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item label="资产名称" prop="asset_name">
          <el-input v-model="curBjData.asset_name" placeholder="请输入特征名称" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="资产类型" prop="asset_type">
          <el-select v-model="curBjData.asset_type" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in tzlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="特征id" prop="asset_id">
          <el-input v-model="curBjData.chara_id" placeholder="请输入特征id" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="资产星级" prop="asset_star">
          <el-select v-model="curBjData.asset_star" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in tzdjOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="相关资产重要程度" prop="asset_level">
          <el-select v-model="curBjData.asset_level" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in zycdOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="资产归属地区" prop="asset_area">
          <el-input
            v-model="curBjData.asset_area"
            placeholder="请输入资产归属地区"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <!-- <el-form-item label="资产归属单位" prop="asset_unit">
          <el-input v-model="curBjData.asset_unit" placeholder="请输入资产归属单位" style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item> -->
        <el-form-item label="资产备案信息" prop="icp">
          <el-input v-model="curBjData.icp" placeholder="请输入备案信息" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="资产详细信息" prop="asset_li">
          <el-input
            v-model="curBjData.asset_li"
            placeholder="请输入资产详细信息"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item label="标签" prop="labels">
          <el-input v-model="curBjData.labels" placeholder="请输入标签" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
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
  import { ref, reactive, onBeforeMount, Ref, onMounted, inject } from 'vue'
  import service from '@/api/request'
  import dayjs from 'dayjs'
  import { ElMessage, type FormInstance, ElMessageBox } from 'element-plus'
  let loading = ref(false)
  const rules = ref({
    asset_id: [{ required: true, message: '请输入资产id', trigger: 'change' }], // 编辑独有
    asset_name: [{ required: true, message: '请输入资产名称', trigger: 'blur' }],
    asset_type: [{ required: true, message: '请选择资产类型', trigger: 'change' }],
    chara_name: [{ required: true, message: '请输入相关资产特征', trigger: 'change' }],
    star: [{ required: true, message: '请选择评价星级', trigger: 'change' }],
    asset_level: [{ required: true, message: '请选择资产重要程度', trigger: 'change' }],
    // asset_area:[{ required: true, message: '请输入资产归属地区', trigger: 'change' }],
    asset_li: [{ required: true, message: '请输入资产数据', trigger: 'change' }],
    ma_name: [{ required: true, message: '请输入厂商名称', trigger: 'change' }],
    product_name: [{ required: true, message: '请输入产品名称', trigger: 'change' }],
    product_version: [{ required: true, message: '请输入产品版本', trigger: 'change' }],
  })
  let xqDialogVisible = ref(false)
  let xjDialogVisible = ref(false)
  let bjDialogVisible = ref(false)
  let ma_name = ref('')
  let product_name = ref('')
  let product_version = ref('')
  const dateValue = ref('')
  const zcbhInput = ref('')
  const ldslInput = ref('')
  const zcmcInput = ref('')
  const zclxValue = ref('')
  const zcdjValue = ref('')
  const sxztValue = ref('')
  const zcgsdqInput = ref('')
  const zcgsdwInput = ref('')
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
    // { label: '重要', value: '重要' },
    // { label: '一般', value: '一般' },
    // { label: '不确定', value: '不确定' },
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
  // const xjClick = () => {
  //   xjDialogVisible.value = true
  // }
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
  const searchClick = async () => {
    const reqData = {
      ma_name: ma_name.value,
      product_name: product_name.value,
      product_version: product_version.value,
      start_time: dateValue.value.length == 0 ? '' : dayjs(dateValue.value[0]).format('YYYY-MM-DD HH:mm:ss'),
      end_time: dateValue.value.length == 0 ? '' : dayjs(dateValue.value[1]).format('YYYY-MM-DD HH:mm:ss'),

      asset_name: zcmcInput.value,
      asset_type: zclxValue.value,
      asset_star: zcdjValue.value,
      asset_area: zcgsdqInput.value,
      // asset_unit: zcgsdwInput.value,
    }
    const { data: res } = await service.get('/api/v1/search_asset', { params: reqData })
    console.log(res.data)
    tableData.value = res.data
  }
  const resetClick = () => {
    ma_name.value = ''
    product_name.value = ''
    product_version.value = ''
    dateValue.value = ''
    zcbhInput.value = ''
    zcmcInput.value = ''
    zycdValue.value = ''
    zclxValue.value = ''
    zcdjValue.value = ''
    sxztValue.value = ''
    zcgsdqInput.value = ''
    zcgsdwInput.value = ''
    searchClick()
  }

  const xqClick = (row) => {
    console.log(row)
    curXqData.value = row
    xqDialogVisible.value = true
  }
  const editHandler = (row) => {
    console.log(row)
    curBjData = row
    bjDialogVisible.value = true
  }
  let curXqData: any = ref({})
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
              asset_level: curXjData.asset_level,
              asset_area: curXjData.asset_area,
              asset_from: curXjData.asset_from,

              asset_li: curXjData.asset_li,
              // chara_id: curXjData.chara_id,
              star: curXjData.star,
              asset_icp: curXjData.icp,
              ma_name: curXjData.ma_name,

              labels: curXjData.labels,
              area: curXjData.area,
              product_name: curXjData.product_name,
              product_version: curXjData.product_name,
            }
            const { data: res2 } = await service.post('/api/v1/create_asset', formData)
            console.log(res2)
            xjDialogVisible.value = false
            searchClick()
            ElMessage.success(res2.msg)
            loading.value = true
            setTimeout(() => {
              searchClick()
              loading.value = false
            }, 1000)
            curXjData.asset_name = ''
            curXjData.asset_type = ''
            curXjData.asset_level = ''
            curXjData.asset_area = ''
            curXjData.asset_from = ''
            curXjData.asset_li = ''
            curXjData.star = ''
            curXjData.icp = ''
            curXjData.ma_name = ''
            curXjData.labels = ''
            curXjData.area = ''
            curXjData.product_name = ''
            curXjData.product_name = ''
            formEl.resetFields()
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
          asset_id: curBjData.asset_id,
          asset_name: curBjData.asset_name,
          asset_type: curBjData.asset_type,
          chara_id: curBjData.chara_id,
          asset_star: curBjData.asset_star,

          asset_level: curBjData.asset_level,
          asset_area: curBjData.asset_area,
          asset_icp: curBjData.icp,
          asset_li: curBjData.asset_li,
          labels: curBjData.labels,

          ma_name: curBjData.ma_name,
          product_name: curBjData.product_name,
          product_version: curBjData.product_name,
        }
        const { data: res } = await service.post('/api/v1/update_asset', formData)
        console.log(res)
        bjDialogVisible.value = false
        searchClick()

        ElMessage.success(res.msg)
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
    let asset_id: Array<String>
    if (flag == 'mult') {
      asset_id = multipleSelection.value.map((item) => item.asset_id)
    } else {
      asset_id = tableData.value.map((item) => item.asset_id)
    }
    // const asset_id = multipleSelection.value.map((item) => item.asset_id)
    ElMessageBox.confirm('是否确定删除数据?', 'Warning', {
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
      })
      .catch(function (res) {
        console.log('error', res)
      })
  }
  const starChange = async (row) => {
    curBjData = row
    const formData = {
      asset_id: curBjData.asset_id,
      asset_name: curBjData.asset_name,
      asset_type: curBjData.asset_type,
      chara_id: curBjData.chara_id,
      asset_star: curBjData.star,

      asset_level: curBjData.asset_level,
      asset_area: curBjData.asset_area,
      asset_icp: curBjData.icp,
      asset_li: curBjData.asset_li,
      labels: curBjData.labels,

      ma_name: curBjData.ma_name,
      product_name: curBjData.product_name,
      product_version: curBjData.product_name,
    }
    console.log(formData)

    const { data: res } = await service.post('/api/v1/update_asset', formData)
    searchClick()
    ElMessage.success(res.msg)
    loading.value = true
    setTimeout(() => {
      searchClick()
      loading.value = false
    }, 1000)
  }
</script>
<style lang="scss" scoped>
  .selectClass span {
    display: inline-block;
    text-align: right;
    width: 110px;
  }
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
