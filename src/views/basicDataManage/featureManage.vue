<template>
  <div class="app-container demo-tabs">
    <div class="my-header">资产归属管理表格</div>
    <el-divider></el-divider>
    <div class="selectClass" style="margin-top: 15px">
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>IP地址：</span>
            <el-input v-model="ip" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">国家：</span>
            <el-input v-model="country" style="width: 220px" placeholder="请输入" />
            <span style="margin-left: 10px">省份：</span>
            <el-input v-model="province" style="width: 220px" placeholder="请输入" />
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <div style="display: inline-block">
            <span>城市：</span>
            <el-input v-model="city" style="width: 220px" placeholder="请输入" />
            <!-- <span>特征编号：</span>
              <el-input v-model="tzbhInput" style="width: 220px" placeholder="请输入" /> -->
            <span style="margin-left: 10px">运营商：</span>
            <el-input v-model="ips" style="width: 220px" placeholder="请输入" />

            <span style="margin-left: 10px">归属单位：</span>
            <el-input v-model="unit" style="width: 220px" placeholder="请输入" />
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
            <!-- <el-table-column prop="asset_id" label="特征编号" min-width="120" align="center" show-overflow-tooltip /> -->
            <!-- <el-table-column prop="asset_unit_id" label="资产归属id" sortable min-width="150" align="center"
              show-overflow-tooltip /> -->
            <el-table-column prop="unit" label="归属单位" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="ip" label="IP地址" min-width="150" align="center" show-overflow-tooltip />
            <el-table-column prop="country" label="国家" min-width="100" align="center" show-overflow-tooltip />
            <el-table-column prop="province" label="省份" min-width="180" align="center" show-overflow-tooltip />
            <el-table-column prop="city" label="城市" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="ips" label="运营商" min-width="130" align="center" show-overflow-tooltip />
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
        <span>资产归属id</span><span>{{ curXqData.asset_unit_id }}</span
        ><br />
        <span>IP地址</span><span>{{ curXqData.ip }}</span
        ><br />
        <span>国家</span><span>{{ curXqData.country }}</span
        ><br />
        <span>省份</span><span>{{ curXqData.province }}</span
        ><br />
        <span>城市</span><span>{{ curXqData.city }}</span
        ><br />
        <span>运营商</span><span>{{ curXqData.ips }}</span
        ><br />
        <span>归属单位</span><span>{{ curXqData.unit }}</span
        ><br />
      </div>
    </el-dialog>
    <el-dialog v-model="xjDialogVisible" title="新建" width="30%">
      <el-form ref="xjForm" :model="curXjData" :rules="rules" label-width="140px">
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="curXjData.ip" placeholder="请输入ip" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="curXjData.country" placeholder="请输入国家" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="curXjData.province" placeholder="请输入省份" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="curXjData.city" placeholder="请输入城市" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="运营商" prop="ips">
          <el-input v-model="curXjData.ips" placeholder="请输入运营商" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="归属单位" prop="unit">
          <el-input v-model="curXjData.unit" placeholder="请输入归属单位" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
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
        <el-form-item label="资产归属id" prop="asset_unit_id">
          <el-input
            v-model="curBjData.asset_unit_id"
            disabled
            placeholder="请输入资产归属id"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="curBjData.ip" placeholder="请输入ip" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="curBjData.country" placeholder="请输入国家" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="curBjData.province" placeholder="请输入省份" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="curBjData.city" placeholder="请输入城市" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="运营商" prop="ips">
          <el-input v-model="curBjData.ips" placeholder="请输入运营商" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="归属单位" prop="unit">
          <el-input v-model="curBjData.unit" placeholder="请输入归属单位" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
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
    ip: [{ required: true, message: '请输入ip', trigger: 'change' }],
    country: [{ required: true, message: '请输入国家', trigger: 'blur' }],
    unit: [{ required: true, message: '请输入归属单位', trigger: 'change' }],
  })
  let ip = ref('')
  let country = ref('')
  let province = ref('')
  let city = ref('')
  let ips = ref('')
  let unit = ref('')
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
  let curXjData: any = reactive({})
  let curBjData: any = reactive({})
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
    service.post('/api/v1/upload_asset_unit', formData).then(({ data: res }) => {
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
    loading.value = true
    const reqData = {
      ip: ip.value,
      country: country.value,
      province: province.value,
      city: city.value,
      ips: ips.value,
      unit: unit.value,
    }
    const { data: res } = await service.get('/api/v1/search_asset_unit', { params: reqData })
    // console.log(res)
    tableData.value = res.data
    loading.value = false
  }
  const resetClick = () => {
    ip.value = ''
    country.value = ''
    province.value = ''
    city.value = ''
    ips.value = ''
    unit.value = ''
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
        // const { data: res } = await service.get('/api/v1/search_asset_unit_by_name', { params: { asset_name: curXjData.asset_name } })
        // // console.log(res);
        // if (res.code == 200) {
        //   if (res.data.exists == 0) {
        //     // 代表特征不重复，可以正常创建 ，走创建接口
        const formData = {
          ip: curXjData.ip,
          country: curXjData.country,
          province: curXjData.province,
          city: curXjData.city,
          ips: curXjData.ips,
          unit: curXjData.unit,
        }
        const { data: res2 } = await service.post('/api/v1/create_asset_unit', formData)
        console.log(res2)
        xjDialogVisible.value = false

        ElMessage.success(res2.msg)
        searchClick()
        loading.value = true
        setTimeout(() => {
          searchClick()
          loading.value = false
        }, 1000)
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
          asset_unit_id: curBjData.asset_unit_id,
          ip: curBjData.ip,
          country: curBjData.country,
          province: curBjData.province,
          city: curBjData.city,
          ips: curBjData.ips,
          unit: curBjData.unit,
        }
        const { data: res } = await service.post('/api/v1/update_asset_unit', formData)
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
  const del = async (row) => {
    const { asset_unit_id } = row
    const assetIds = [asset_unit_id]

    ElMessageBox.confirm('是否确定删除此条数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_asset_unit', { asset_unit_id: assetIds })
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
    let asset_unit_id: Array<String>
    if (flag == 'mult') {
      asset_unit_id = multipleSelection.value.map((item) => item.asset_unit_id)
    } else {
      asset_unit_id = tableData.value.map((item) => item.asset_unit_id)
    }
    // const asset_unit_id = multipleSelection.value.map((item) => item.asset_unit_id)
    ElMessageBox.confirm('是否确定删除选中数据?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        const { data: res } = await service.post('/api/v1/delete_asset_unit', { asset_unit_id })
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
    const asset_unit_id = multipleSelection.value.map((item) => item.asset_unit_id)
    console.log(asset_unit_id)

    service({
      method: 'post',
      url: '/api/v1/export_asset_unit',
      data: { asset_unit_id },
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
      url: '/api/v1/export_asset_unit_template',
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
  .selectClass span {
    display: inline-block;
    text-align: right;
    width: 80px;
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
