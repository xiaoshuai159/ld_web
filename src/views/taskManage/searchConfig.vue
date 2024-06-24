<template>
    <div class="app-container demo-tabs">
      <div class="my-header">关联入库</div>
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
  
              <!-- <span style="margin-left: 10px">任务状态：</span>
              <el-select v-model="status" placeholder="请选择" style="width: 220px">
                <el-option v-for="item in rwztOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select> -->
              <span style="margin-left: 10px">日期选择：</span>
              <el-date-picker v-model="dateValue" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" style="transform: translateY(2px)" />
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin-top: 16px">
        <el-col :span="1"></el-col>
        <el-col :span="19">
          <!-- <el-button type="primary" :icon="Plus" @click="xjClick">新建</el-button>
          <el-button @click="multDel('mult')">批量删除</el-button>
          <el-button @click="multDel('all')">全部删除</el-button> -->
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
              <!-- <el-table-column prop="task_id" label="任务编号" min-width="130" align="center" show-overflow-tooltip /> -->
              <el-table-column prop="name" label="任务名称" min-width="140" align="center" show-overflow-tooltip />
              <el-table-column prop="task_type" label="任务类型" min-width="120" align="center" show-overflow-tooltip>
                <template #default="scope">
                  <span v-if="scope.row.task_type == 'search'" type="info">资产查询</span>
                  <span v-else-if="scope.row.task_type == 'detect'" type="success">漏洞探测</span>
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
              <el-table-column prop="result_count" label="结果条数" min-width="180" align="center" show-overflow-tooltip >
                <!-- <template #default="scope">
                  {{  cachedResultNum(scope.row) }}
                </template> -->
              </el-table-column>
              <el-table-column prop="operator" label="操作" min-width="320px" align="center" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" link @click="xqClick(scope.row)"> 详情 </el-button>
                  <!-- :disabled="scope.row.state == 0 4 5 6" 未启动、已停止、任务成功、任务失败   0：启动、 456：重新启动  :entry_status 0:未入库 1：已入库-->
                  <el-button type="success" size="small" link @click="inClick(scope.row)" :disabled="scope.row.entry_status == 1"> 结果入库 </el-button>
                  <el-button type="danger" size="small" link @click="outClick(scope.row)" :disabled="scope.row.entry_status == 0"> 撤销入库 </el-button>
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
        <div v-if="curXqData.task_type === 'search'" class="xqDialog">
          <span>任务名称</span><span>{{ curXqData.name }}</span><br />
          <span>任务类型</span><span>{{ curXqData.task_type }}</span><br />
          <span>调用特征id</span><span>{{ curXqData.chara_id }}</span><br />
          <span>调用特征名称</span><span>{{ curXqData.chara_name }}</span><br />
          <span>厂商名称</span><span>{{ curXqData.ma_name }}</span><br />
          <span>产品名称</span><span>{{ curXqData.product_name }}</span><br />
          <span>产品版本</span><span>{{ curXqData.product_version }}</span><br />
          <span>查询语法</span><span>{{ curXqData.query_syntax }}</span><br />
          <span>特征等级</span>
          <span> <el-rate v-model="curXqData.chara_level" disabled show-score text-color="#ff9900"
              score-template="{value}星" /> </span><br />
          <span>特征创建/上传日期</span><span>{{ curXqData.create_time }}</span><br />
          <span>更新时间</span><span>{{ curXqData.update_time }}</span><br />
        </div>
        <div v-if="curXqData.task_type === 'detect'" class="xqDialog">
          <span>任务名称</span><span>{{ curXqData.name }}</span><br />
          <span>任务类型</span><span>{{ curXqData.task_type }}</span><br />
          <span>探测网络模式</span><span>{{ internetModeOptions.find((option) => option.value == curXqData.internetMode).label
            }}</span><br />
          <span>任务优先级</span><span>{{ priorityOptions.find((option) => option.value == curXqData.priority).label
            }}</span><br />
          <span>网络类型</span><span>{{ sourceOptions.find((option) => option.value == curXqData.source).label }}</span><br />
          <span>失败调度后重新调度次数</span><span>{{ curXqData.dispatchTimes }}</span><br />
          <span>任务标签</span><span>{{ curXqData.labelIds.length == 0 ? '无' : curXqData.labelIds }}</span><br />
          <span>探测ip目标</span><span>{{ curXqData.taskContent.ip_targets.length>0? curXqData.taskContent.ip_targets.join(", "):"无"}}</span><br />
          <span>探测端口目标</span><span
            style="display: inline-block; width: 220px; overflow: hidden; text-overflow: ellipsis">{{
              curXqData.taskContent.port_targets.length>0? curXqData.taskContent.port_targets.join(", "):"无"
            }}</span><br />
          <span>poc</span><span>{{ curXqData.taskContent.pocs.length>0? curXqData.taskContent.pocs.join(", "):"无" }}</span><br />
          <span>漏扫白名单</span><span>{{ curXqData.taskContent.blacklist.length>0? curXqData.taskContent.blacklist.join(", "):"无" }}</span><br />
          <span>探测节点</span><span>{{ curXqData.taskLabels.nodeType }}</span><br />
          <span>使用节点数量</span><span>{{ curXqData.taskContent.taskLabel.nodeCount }}</span><br />
        </div>
      </el-dialog>
      <el-dialog v-model="xjDialogVisible" title="新建" width="30%">
        <el-form ref="xjForm" :model="curXjData" :rules="rules" label-width="140px">
          <el-form-item label="任务名称" prop="task_name">
            <el-input v-model="curXjData.task_name" placeholder="请输入任务名称" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
  
          <!-- search -->
          <el-form-item v-if="curXjData.task_type === 'search'" label="资产特征" prop="chara_name">
            <el-select v-model="curXjData.chara_name" filterable remote reserve-keyword placeholder="请输入并选择资产特征"
              remote-show-suffix :remote-method="remoteMethod" :loading="selectLoading" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)">
              <el-option v-for="item in curXjData.zctzOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'search'" label="相关厂商" prop="ma_name">
            <el-input v-model="curXjData.ma_name" placeholder="请输入相关厂商名称" style="width: 220px" disabled
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'search'" label="相关产品名称" prop="product_name">
            <el-input v-model="curXjData.product_name" placeholder="请输入相关产品名称" style="width: 220px" disabled
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'search'" label="相关产品版本" prop="product_version">
            <el-input v-model="curXjData.product_version" placeholder="请输入相关产品版本" style="width: 220px" disabled
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'search'" label="资产特征编号" prop="chara_id">
            <el-input v-model="curXjData.chara_id" placeholder="请输入资产特征编号" style="width: 220px" disabled
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'search'" label="特征对应语法" prop="query_syntax">
            <el-input v-model="curXjData.query_syntax" placeholder="请输入特征对应语法" style="width: 220px" disabled
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'search'" label="资产特征等级" prop="chara_level">
            <el-input v-model="curXjData.chara_level" placeholder="请输入资产特征等级" style="width: 220px" disabled
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <!-- detect -->
          <el-form-item v-if="curXjData.task_type === 'detect'" label="探测网络模式" prop="internetMode">
            <el-select v-model="curXjData.internetMode" placeholder="请选择探测网络模式" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)">
              <el-option v-for="item in internetModeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'detect'" label="任务优先级" prop="priority">
            <el-select v-model="curXjData.priority" placeholder="请选择任务优先级" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)">
              <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'detect'" label="网络类型" prop="source">
            <el-select v-model="curXjData.source" placeholder="请选择网络类型" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)">
              <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'detect'" label="失败后是否重新调度" prop="reissue">
            <el-select v-model="curXjData.reissue" placeholder="请选择" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)">
              <el-option v-for="item in reissueOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'detect' && curXjData.reissue == 9" label="重新调度次数"
            prop="dispatchTimes">
            <el-input v-model="curXjData.dispatchTimes" placeholder="请输入重新调度次数" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'detect'" label="任务标签" prop="labelIds">
            <el-input v-model="curXjData.labelIds" placeholder="多个任务标签，以英文逗号分割" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <!-- <el-form-item label="探测目标类型" prop="ipSourceType" v-if="curXjData.task_type === 'detect'">
            <el-select v-model="curXjData.ipSourceType" placeholder="请选择" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)">
              <el-option v-for="item in ipSourceTypeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item v-if="curXjData.task_type === 'detect' && curXjData.ipSourceType == 1" label="探测ip目标"
            prop="ip_targets">
            <el-input v-model="curXjData.ip_targets" placeholder="多个ip，以英文逗号分割" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'detect' && curXjData.ipSourceType == 1" label="探测端口目标"
            prop="port_targets">
            <el-input v-model="curXjData.port_targets" placeholder="多个port，以英文逗号分割" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <!-- <el-form-item label="ip分组" prop="targetGroups"
            v-if="curXjData.task_type === 'detect' && curXjData.ipSourceType == 2">
            <el-input v-model="curXjData.targetGroups" placeholder="多个ip，以英文逗号分割" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item> -->
          <!-- <el-form-item label="端口目标类型" prop="pocType" v-if="curXjData.task_type === 'detect'">
            <el-select v-model="curXjData.pocType" placeholder="请选择" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)">
              <el-option v-for="item in ipSourceTypeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item v-if="curXjData.task_type === 'detect'" label="探测脚本" prop="pocs">
            <el-select v-model="curXjData.pocs" filterable remote reserve-keyword placeholder="请输入并探测脚本"
              remote-show-suffix :remote-method="remoteMethod3" :loading="selectLoading" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)">
              <el-option v-for="item in curXjData.pocOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="poc分组" prop="pocGroups" v-if="curXjData.task_type === 'detect' && curXjData.pocType == 2">
            <el-input v-model="curXjData.pocGroups" placeholder="多个poc，以英文逗号分割" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item> -->
          <el-form-item v-if="curXjData.task_type === 'detect'" label="漏扫白名单" prop="blacklist">
            <el-input v-model="curXjData.blacklist" placeholder="多个ip，以英文逗号分割" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)" />
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'detect'" label="探测节点" prop="nodeType">
            <el-select v-model="curXjData.nodeType" placeholder="请选择探测节点" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)">
              <el-option v-for="item in nodeTypeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="curXjData.task_type === 'detect'" label="使用节点数量" prop="nodeCount">
            <el-input v-model="curXjData.nodeCount" placeholder="请输入使用节点数量" style="width: 220px"
              @keyup.enter="handleSubmit(xjForm)" />
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
          <el-form-item label="任务名称" prop="task_name">
            <el-input v-model="curBjData.task_name" placeholder="请输入任务名称" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
  
          <el-form-item v-if="curBjData.task_type === 'search'" label="资产特征" prop="chara_name">
            <el-select v-model="curBjData.chara_name" filterable remote reserve-keyword placeholder="请输入并选择资产特征"
              remote-show-suffix :remote-method="remoteMethod2" :loading="selectLoading" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)">
              <el-option v-for="item in curXjData.zctzOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'search'" label="相关厂商" prop="ma_name">
            <el-input v-model="curBjData.ma_name" placeholder="请输入相关厂商名称" style="width: 220px" disabled
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'search'" label="相关产品名称" prop="product_name">
            <el-input v-model="curBjData.product_name" placeholder="请输入相关产品名称" style="width: 220px" disabled
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'search'" label="相关产品版本" prop="product_version">
            <el-input v-model="curBjData.product_version" placeholder="请输入相关产品版本" style="width: 220px" disabled
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'search'" label="资产特征编号" prop="chara_id">
            <el-input v-model="curBjData.chara_id" placeholder="请输入资产特征编号" style="width: 220px" disabled
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'search'" label="特征对应语法" prop="query_syntax">
            <el-input v-model="curBjData.query_syntax" placeholder="请输入特征对应语法" style="width: 220px" disabled
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'search'" label="资产特征等级" prop="chara_level">
            <el-input v-model="curBjData.chara_level" placeholder="请输入资产特征等级" style="width: 220px" disabled
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
  
          <!-- detect -->
          <el-form-item v-if="curBjData.task_type === 'detect'" label="探测网络模式" prop="internetMode">
            <el-select v-model="curBjData.internetMode" placeholder="请选择探测网络模式" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)">
              <el-option v-for="item in internetModeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect'" label="任务优先级" prop="priority">
            <el-select v-model="curBjData.priority" placeholder="请选择任务优先级" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)">
              <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect'" label="网络类型" prop="source">
            <el-select v-model="curBjData.source" placeholder="请选择网络类型" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)">
              <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect'" label="失败后是否重新调度" prop="reissue">
            <el-select v-model="curBjData.reissue" placeholder="请选择" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)">
              <el-option v-for="item in reissueOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect' && curBjData.reissue == 9" label="重新调度次数"
            prop="dispatchTimes">
            <el-input v-model="curBjData.dispatchTimes" placeholder="请输入重新调度次数" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect'" label="任务标签" prop="labelIds">
            <el-input v-model="curBjData.labelIds" placeholder="多个任务标签，以英文逗号分割" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect' && curBjData.ipSourceType == 1" label="探测ip目标"
            prop="ip_targets">
            <el-input v-model="curBjData.ip_targets" placeholder="多个ip，以英文逗号分割" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect' && curBjData.ipSourceType == 1" label="探测端口目标"
            prop="port_targets">
            <el-input v-model="curBjData.port_targets" placeholder="多个port，以英文逗号分割" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect'" label="探测脚本" prop="pocs">
            <el-select v-model="curBjData.pocs" filterable remote reserve-keyword placeholder="请输入并探测脚本"
              remote-show-suffix :remote-method="remoteMethod3" :loading="selectLoading" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)">
              <el-option v-for="item in curBjData.pocOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect'" label="漏扫白名单" prop="blacklist">
            <el-input v-model="curBjData.blacklist" placeholder="多个ip，以英文逗号分割" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect'" label="探测节点" prop="nodeType">
            <el-select v-model="curBjData.nodeType" placeholder="请选择探测节点" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)">
              <el-option v-for="item in nodeTypeOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="curBjData.task_type === 'detect'" label="使用节点数量" prop="nodeCount">
            <el-input v-model="curBjData.nodeCount" placeholder="请输入使用节点数量" style="width: 220px"
              @keyup.enter="handleSubmit2(bjForm)" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer" style="display: flex; justify-content: flex-end">
            <el-button type="primary" @click="handleSubmit2(bjForm)">确定</el-button>
            <el-button @click="bjDialogVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- search结果 -->
      <el-dialog v-model="cxjgDialogVisible" title="结果" width="70%">
        <div>
          <el-table
            :data="cxjgTableData.slice((pagination2.currentPage - 1) * pagination2.pageSize, pagination2.currentPage * pagination2.pageSize)"
            style="width: 100%" @selection-change="handleSelectionChange" v-loading="cxjgLoading">
            <el-table-column type="index" width="55" />
            <el-table-column prop="ma_name" label="厂商名称" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="product_name" label="产品名称" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="chara_id" label="相关资产特征id" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="asset_name" label="资产名称" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="area" label="资产归属地区" min-width="140" align="center" show-overflow-tooltip />
  
            <el-table-column prop="asset_level" label="资产重要程度" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="star" label="资产评价等级" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="asset_li" label="资产数据" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="chara_name" label="相关资产特征名称" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="create_time" label="创建时间" min-width="130" align="center" show-overflow-tooltip />
  
            <el-table-column prop="icp" label="icp备案信息" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="query_syntax" label="查询语法" min-width="140" align="center" show-overflow-tooltip />
          </el-table>
        </div>
        <div style="padding: 30px 0">
          <div style="display: inline-block; color: rgba(0, 0, 0, 0.427450980392157)">共 {{ cxjgTableData.length }} 条记录，第
            {{ pagination2.currentPage }} /
            {{ Math.ceil(cxjgTableData.length / pagination2.pageSize) }} 页</div>
          <div style="display: flex; justify-content: right; margin-top: -24px">
            <el-pagination background :current-page="pagination2.currentPage" :page-size="pagination2.pageSize"
              :page-sizes="[10, 20, 50, 100, 300]" layout="sizes, prev, pager, next, jumper" :total="cxjgTableData.length"
              @size-change="handleSizeChange2" @current-change="handleCurrentChange2">
            </el-pagination>
          </div>
        </div>
      </el-dialog>
      <!-- detect结果 -->
      <el-dialog v-model="tcjgDialogVisible" title="结果" width="70%">
        <div>
          <el-table
            :data="tcjgTableData.slice((pagination3.currentPage - 1) * pagination3.pageSize, pagination3.currentPage * pagination3.pageSize)"
            style="width: 100%" @selection-change="handleSelectionChange" v-loading="tcjgLoading">
            <el-table-column type="index" width="55" />
  
            <el-table-column prop="target" label="探测目标" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="poc_id" label="探测脚本id" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="poc_name" label="探测脚本名称" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="poc_hash" label="探测脚本hash" min-width="130" align="center" show-overflow-tooltip />
  
            <el-table-column prop="hostInfo" label="漏洞地址" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="name" label="漏洞名称" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="cveId" label="漏洞CVE编号" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="description" label="漏洞描述" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="level" label="漏洞等级" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="vulType" label="漏洞类型" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="vulURL" label="漏洞URL" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="vulnerable" label="漏洞是否可用" min-width="140" align="center" show-overflow-tooltip />
  
            <el-table-column prop="beginAt" label="开始时间" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="scanAt" label="发现时间" min-width="130" align="center" show-overflow-tooltip />
            <el-table-column prop="endAt" label="结束时间" min-width="140" align="center" show-overflow-tooltip />
            <el-table-column prop="storageAt" label="录入时间" min-width="130" align="center" show-overflow-tooltip />
          </el-table>
        </div>
        <div style="padding: 30px 0">
          <div style="display: inline-block; color: rgba(0, 0, 0, 0.427450980392157)">共 {{ tcjgTableData.length }} 条记录，第
            {{ pagination3.currentPage }} /
            {{ Math.ceil(tcjgTableData.length / pagination3.pageSize) }} 页</div>
          <div style="display: flex; justify-content: right; margin-top: -24px">
            <el-pagination background :current-page="pagination3.currentPage" :page-size="pagination3.pageSize"
              :page-sizes="[10, 20, 50, 100, 300]" layout="sizes, prev, pager, next, jumper" :total="tcjgTableData.length"
              @size-change="handleSizeChange3" @current-change="handleCurrentChange3">
            </el-pagination>
          </div>
        </div>
      </el-dialog>
    </div>
  </template>
  <script lang="ts" setup>
  import { Plus, Upload } from '@element-plus/icons-vue'
  import { ref, reactive, onMounted, Ref, watch } from 'vue'
  import service from '@/api/request'
  import { ElMessage, type FormInstance, ElMessageBox } from 'element-plus'
  import dayjs from 'dayjs'
  let cxjgDialogVisible = ref(false)
  let tcjgDialogVisible = ref(false)
  let cxjgTableData = ref([])
  let tcjgTableData = ref([])
  let cxjgLoading = ref(false)
  let tcjgLoading = ref(false)
  const internetModeOptions = [
    { value: 1, label: '动态拨号' },
    { value: 2, label: '固定专线' },
    { value: 3, label: '第三方系统' },
  ]
  const priorityOptions = [
    { value: 1, label: '紧急' },
    { value: 2, label: '高' },
    { value: 3, label: '中' },
    { value: 4, label: '低' },
  ]
  const sourceOptions = [
    { value: 'v', label: 'v网任务' },
    { value: 'z', label: '专网任务' },
    { value: 'api-v', label: 'v网api' },
    { value: 'api-z', label: '专网api' },
  ]
  const reissueOptions = [
    { value: 9, label: '是' },
    { value: 10, label: '否' },
  ]
  const ipSourceTypeOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
  ]
  const nodeTypeOptions = [
    { value: 5, label: '境内' },
    { value: 6, label: '境外' },
  ]
  let selectLoading = ref(false)
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
  let rwlxOptions = ref([
    { label: '资产查询', value: 'search' },
    // { label: '漏洞探测', value: 'detect' },
  ])
  let curChain = ref('')
  
  const resetClick = () => {
    task_name.value = ''
    task_type.value = ''
    // status.value = ''
    dateValue.value = ''
    searchClick()
  }
  let curXjData: any = reactive({
    ipSourceType: 1,
    pocType: 1,
    task_type:'search'
  })
  let curBjData: any = reactive({
    ipSourceType: 1,
    pocType: 1,
    task_type:'search'
  })
  const rules = ref({
    // search
    task_type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
    task_name: [{ required: true, message: '请选择任务名称', trigger: 'change' }],
    chara_name: [{ required: true, message: '请输入并选择资产特征', trigger: 'change' }],
    chara_id: [{ required: true, message: '请输入资产特征编号', trigger: 'change' }],
    query_syntax: [{ required: true, message: '请输入特征对应语法', trigger: 'blur' }],
    chara_level: [{ required: true, message: '请输入资产特征等级', trigger: 'change' }],
    ma_name: [{ required: true, message: '请输入相关厂商', trigger: 'change' }],
    product_name: [{ required: true, message: '请选择相关产品名称', trigger: 'change' }],
    product_version: [{ required: true, message: '请输入相关产品版本', trigger: 'change' }],
  
    // detect
    internetMode: [{ required: true, message: '请选择探测网络模式', trigger: 'change' }],
    priority: [{ required: true, message: '请选择任务优先级', trigger: 'change' }],
    source: [{ required: true, message: '请选择网络类型', trigger: 'change' }],
    ipSourceType: [{ required: true, message: '请输入', trigger: 'change' }],
    ip_targets: [{ required: true, message: '请输入', trigger: 'change' }],
    port_targets: [{ required: true, message: '请输入', trigger: 'change' }],
    targetGroups: [{ required: true, message: '请输入', trigger: 'change' }],
    pocType: [{ required: true, message: '请输入', trigger: 'change' }],
    pocs: [{ required: true, message: '请输入', trigger: 'change' }],
    pocGroups: [{ required: true, message: '请输入', trigger: 'change' }],
    nodeType: [{ required: true, message: '请选择探测节点', trigger: 'change' }],
    nodeCount: [{ required: true, message: '请输入节点数量', trigger: 'change' }],
  })
  let dateValue = ref('')
  let loading = ref(false)
  let xqDialogVisible = ref(false)
  let xjDialogVisible = ref(false)
  let bjDialogVisible = ref(false)
  
  let tableData = ref([])
  let curXqData: any = ref({})
  let curAllChara = reactive([])
  let curAllpoc = ref([])
  const taskTypeOptions = ref([
    { label: 'URL特征', value: 'URL特征' },
    { label: 'IP特征', value: 'IP特征' },
  ])
  const cachedResults = ref({});

    // 获取结果条数的函数
    const fetchResultNum = async (task_id) => {
      try {
        const { data: res } = await service.get('/api/v1/search_task_status', { params: { task_id } });
        if (res.code === 200) {
          cachedResults.value[task_id] = res.data.result_count;
        }
      } catch (error) {
        console.error('Error fetching result count:', error);
      }
    };

    // 计算属性：根据 task_id 返回结果条数
    const cachedResultNum = (row) => {
      const { task_id } = row;
      if (cachedResults.value[task_id] !== undefined) {
        return cachedResults.value[task_id];
      } else {
        fetchResultNum(task_id);
        return 'Loading...';
      }
    };
  const getResultNum = async (row) =>{
    const {task_id} = row
    const {data:res} = await service.get('/api/v1/search_task_status',{params:{task_id}})
    console.log(res);
    if(res.code == 200){
      return res.data.result_count
    }
    
  }
  const xqClick = async (row) => {
    const { task_type, task_id } = row
    const { data: res } = await service.get('/api/v1/search_task_detail', { params: { task_id } })
    curXqData.value = res.data
    xqDialogVisible.value = true
  }
  // search任务的“资产特征”输入框“新建” 模糊查询
  const remoteMethod = (query: string) => {
    if (query) {
      selectLoading.value = true
      setTimeout(async () => {
        selectLoading.value = false
        const { data: res } = await service.get('/api/v1/search_chara_fuzzy', { params: { chara_name: query } })
        curAllChara = res.data
        curXjData.zctzOption = res.data.map((item) => ({
          label: item.chara_name,
          value: item.chara_name,
        }))
      }, 200)
    } else {
      // curXjData.zctzOption = []
    }
  }
  // search任务的“资产特征”输入框“编辑” 模糊查询
  const remoteMethod2 = (query: string) => {
    if (query) {
      selectLoading.value = true
      setTimeout(async () => {
        selectLoading.value = false
        const { data: res } = await service.get('/api/v1/search_chara_fuzzy', { params: { chara_name: query } })
        curAllChara = res.data
        curXjData.zctzOption = res.data.map((item) => ({
          label: item.chara_name,
          value: item.chara_name,
        }))
      }, 200)
    } else {
      // curXjData.zctzOption = []
    }
  }
  // detect任务的“探测脚本”输入框“新建” 模糊查询
  const remoteMethod3 = (query: string) => {
    if (query) {
      selectLoading.value = true
      setTimeout(async () => {
        selectLoading.value = false
        const { data: res } = await service.get('/api/v1/search_poc', { params: { poc_name: query } })
        curAllpoc.value = res.data
        // 用curXjData.pocOption替用一下
        curXjData.pocOption = res.data.map((item) => ({
          label: item.poc_name,
          value: item.poc_id,
        }))
      }, 200)
    } else {
    }
  }
  // detect任务的“探测脚本”输入框“编辑” 模糊查询
  const remoteMethod4 = (query: string) => {
    if (query) {
      selectLoading.value = true
      setTimeout(async () => {
        selectLoading.value = false
        const { data: res } = await service.get('/api/v1/search_poc', { params: { poc_name: query } })
        curAllpoc.value = res.data
        // 用curXjData.pocOption替用一下
        curBjData.pocOption = res.data.map((item) => ({
          label: item.poc_name,
          value: item.poc_id,
        }))
      }, 200)
    } else {
    }
  }
  // 监测“新建”的资产特征值变化
  watch(
    () => curXjData.chara_name,
    (newValue, oldValue) => {
      console.log('curXjData.chara_name改变了，新值为:', newValue, '旧值为:', oldValue)
      if (newValue && !oldValue) {
        // 1.新值存在，旧值不存在
        console.log('新值存在，旧值不存在。存在第一次选值不更新问题');
        console.log(curAllChara);
  
        const temp = curAllChara.find((item) => item.chara_name === newValue)
        curXjData.poc_name = temp.poc_name
        curXjData.chara_id = temp.chara_id
        curXjData.chara_level = temp.chara_level
        curXjData.query_syntax = temp.query_syntax
        curXjData.ma_name = temp.ma_name
        curXjData.product_name = temp.product_name
        curXjData.product_version = temp.product_version
  
      } else if (oldValue && !newValue) {
        // 2.旧值存在，新值不存在
        console.log('旧值存在，新值不存在');
      } else if (!oldValue && !newValue) {
        console.log('都不存在');
      } else {
        // 3.都存在
        console.log('都存在')
        console.log('curXjData.chara_name改变了，新值为:', newValue, '旧值为:', oldValue)
        const temp = curAllChara.find((item) => item.chara_name === newValue)
        curXjData.poc_name = temp.poc_name
        curXjData.chara_id = temp.chara_id
        curXjData.chara_level = temp.chara_level
        curXjData.query_syntax = temp.query_syntax
        curXjData.ma_name = temp.ma_name
        curXjData.product_name = temp.product_name
        curXjData.product_version = temp.product_version
      }
    }
  )
  // 监测“编辑”的资产特征值变化
  watch(
    () => curBjData.chara_name,
    (newValue, oldValue) => {
      if (newValue && oldValue) {
        console.log('curBjData.chara_name改变了，新值为:', newValue, '旧值为:', oldValue)
        if (newValue && !oldValue) {
          // 1.新值存在，旧值不存在
          console.log('新值存在，旧值不存在。存在第一次选值不更新问题');
          const temp = curAllChara.find((item) => item.chara_name === newValue)
          curBjData.poc_name = temp.poc_name
          curBjData.chara_id = temp.chara_id
          curBjData.chara_level = temp.chara_level
          curBjData.query_syntax = temp.query_syntax
          curBjData.ma_name = temp.ma_name
          curBjData.product_name = temp.product_name
          curBjData.product_version = temp.product_version
  
        } else if (oldValue && !newValue) {
          // 2.旧值存在，新值不存在
          console.log('旧值存在，新值不存在');
        } else {
          // 3.都存在
          console.log('都存在')
          const temp = curAllChara.find((item) => item.chara_name === newValue)
          curBjData.poc_name = temp.poc_name
          curBjData.chara_id = temp.chara_id
          curBjData.chara_level = temp.chara_level
          curBjData.query_syntax = temp.query_syntax
          curBjData.ma_name = temp.ma_name
          curBjData.product_name = temp.product_name
          curBjData.product_version = temp.product_version
        }
      }
    },
  )
  // 监测“新建”的poc值变化
  watch(
    () => curXjData.pocs,
    (newValue, oldValue) => {
      console.log('curXjData.pocs改变了，新值为:', newValue, '旧值为:', oldValue)
      if (newValue && !oldValue) {
        // 1.新值存在，旧值不存在
        console.log('新值存在，旧值不存在。存在第一次选值不更新问题');
  
        const temp = curAllpoc.value.find((item) => item.poc_id === newValue)
        curXjData.poc_name = temp.poc_name
        curXjData.chara_id = temp.chara_id
        curXjData.chara_level = temp.chara_level
        curXjData.query_syntax = temp.query_syntax
        curXjData.ma_name = temp.ma_name
        curXjData.product_name = temp.product_name
        curXjData.product_version = temp.product_version
  
      } else if (oldValue && !newValue) {
        // 2.旧值存在，新值不存在
        console.log('旧值存在，新值不存在');
      } else if (!oldValue && !newValue) {
        console.log('都不存在');
      } else {
        // 3.都存在
        console.log('都存在')
        console.log('curXjData.pocs改变了，新值为:', newValue, '旧值为:', oldValue)
        console.log(curAllpoc.value);
        const temp = curAllpoc.value.find((item) => item.poc_id === newValue)
        curXjData.poc_name = temp.poc_name
        curXjData.chara_id = temp.chara_id
        curXjData.chara_level = temp.chara_level
        curXjData.query_syntax = temp.query_syntax
        curXjData.ma_name = temp.ma_name
        curXjData.product_name = temp.product_name
        curXjData.product_version = temp.product_version
      }
    }
  )
  // 监测“编辑”的poc值变化
  watch(
    () => curBjData.pocs,
    (newValue, oldValue) => {
      console.log('curBjData.pocs改变了，新值为:', newValue, '旧值为:', oldValue)
      if (newValue && !oldValue) {
        // 1.新值存在，旧值不存在
        console.log('新值存在，旧值不存在。存在第一次选值不更新问题');
        console.log(curAllpoc.value);
        
        const temp = curAllpoc.value.find((item) => item.poc_id === newValue)
        console.log(temp);
        
        curBjData.poc_name = temp.poc_name
        curBjData.chara_id = temp.chara_id
        curBjData.chara_level = temp.chara_level
        curBjData.query_syntax = temp.query_syntax
        curBjData.ma_name = temp.ma_name
        curBjData.product_name = temp.product_name
        curBjData.product_version = temp.product_version
  
      } else if (oldValue && !newValue) {
        // 2.旧值存在，新值不存在
        console.log('旧值存在，新值不存在');
      } else if (!oldValue && !newValue) {
        console.log('都不存在');
      } else {
        // 3.都存在
        console.log('都存在')
        console.log('curXjData.pocs改变了，新值为:', newValue, '旧值为:', oldValue)
        console.log(curAllpoc.value);
        const temp = curAllpoc.value.find((item) => item.poc_id === newValue)
        curBjData.poc_name = temp.poc_name
        curBjData.chara_id = temp.chara_id
        curBjData.chara_level = temp.chara_level
        curBjData.query_syntax = temp.query_syntax
        curBjData.ma_name = temp.ma_name
        curBjData.product_name = temp.product_name
        curBjData.product_version = temp.product_version
      }
    }
  )
  // 新建
  const handleSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        let formData = new FormData()
  
        if (curXjData.task_type == 'search') {
          const formData2 = {
            name: curXjData.task_name,
            task_type: curXjData.task_type,
            chara_name: curXjData.chara_name,
            chara_level: curXjData.chara_level,
            chara_id: curXjData.chara_id,
            query_syntax: curXjData.query_syntax,
            ma_name: curXjData.ma_name,
            product_name: curXjData.product_name,
            product_version: curXjData.product_version,
          }
          formData.append('json_data',JSON.stringify(formData2))
        }
        
        const { data: res2 } = await service.post('/api/v1/create_task', formData)
        xjDialogVisible.value = false
        searchClick()
        ElMessage.success(res2.msg)
        loading.value = true
        setTimeout(() => {
          searchClick()
          loading.value = false
        }, 1000)
        curXjData = reactive([])
        // curXjData.task_name = ''
        // curXjData.task_type = ''
        // curXjData.chara_name = ''
        // curXjData.chara_level = ''
        // curXjData.chara_id = ''
        // curXjData.query_syntax = ''
        // curXjData.ma_name = ''
        // curXjData.product_name = ''
        // curXjData.product_version = ''
        formEl.resetFields()
      } else {
        // 代表特征名称重复
        ElMessage.error('该特征名称已存在，请重新输入！')
      }
    })
  }
  
  // 编辑，点击确认按钮
  const handleSubmit2 = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        let formData = null
        if (curBjData.task_type == 'search') {
          formData = {
            task_id: curBjData.task_id,
            name: curBjData.task_name,
            task_type: curBjData.task_type,
            chara_name: curBjData.chara_name,
            chara_level: curBjData.chara_level,
            chara_id: curBjData.chara_id,
            query_syntax: curBjData.query_syntax,
            ma_name: curBjData.ma_name,
            product_name: curBjData.product_name,
            product_version: curBjData.product_version,
          }
        }
        const { data: res } = await service.post('/api/v1/update_task', formData)
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
  }
  // 编辑，弹出框前的赋值
  const editHandler = async (row) => {
    const { task_id } = row
    const { data: res } = await service.get('api/v1/search_task_detail', { params: { task_id } })
  
    curBjData.task_id = task_id
    curBjData.task_type = res.data.task_type
    curBjData.task_name = res.data.name
    curBjData.query_syntax = res.data.query_syntax
    curBjData.ma_name = res.data.ma_name
    curBjData.product_name = res.data.product_name
    curBjData.product_version = res.data.product_version
    curBjData.chara_id = res.data.chara_id
    curBjData.chara_level = res.data.chara_level
    curBjData.chara_name = res.data.chara_name
    if (curBjData.task_type == 'detect') {
      const { data: res2 } = await service.get('/api/v1/search_poc', { params: { poc_name: res.data.taskContent.poc_name } })
      curAllpoc.value = res2.data
      // 用curXjData.pocOption替用一下
      curBjData.pocOption = res2.data.map((item) => ({
        label: item.poc_name,
        value: item.poc_id,
      }))
      curBjData.pocs = res.data.taskContent.pocs[0]
      curBjData.internetMode = res.data.internetMode
      curBjData.priority = res.data.priority
      curBjData.source = res.data.source
      curBjData.reissue = res.data.reissue
      curBjData.dispatchTimes = res.data.dispatchTimes
      curBjData.labelIds = res.data.labelIds
      curBjData.blacklist = res.data.blacklist
      curBjData.nodeType = res.data.taskContent.taskLabel.nodeType
      curBjData.nodeCount = res.data.taskContent.taskLabel.nodeCount
      curBjData.ip_targets = res.data.taskContent.ip_targets
      curBjData.port_targets = res.data.taskContent.port_targets
      curBjData.blacklist = res.data.taskContent.blacklist
    }
  
    // curBjData.taskContent.ipText = res.data.taskContent.ipText
    // curBjData.taskContent.port_targets = res.data.taskContent.portText
    // curBjData.taskContent.pocs = res.data.taskContent.pocs
    // curBjData.taskContent.blacklist = res.data.taskContent.blacklist
    bjDialogVisible.value = true
  }
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
  const pagination2 = reactive({
    currentPage: 1,
    pageSize: 10,
  })
  const pagination3 = reactive({
    currentPage: 1,
    pageSize: 10,
  })
  
  const multipleSelection = ref([])
  const handleSelectionChange = (val: any) => {
    multipleSelection.value = val
  }
  let isCollapse: Ref<boolean> = ref(true)
  const toggleAdvanced = () => {
    isCollapse.value = !isCollapse.value
  }
  const qdClick = async (row) => {
    const { task_id, task_type } = row
    const { data: res } = await service.post('/api/v1/start_task', {
      task_id,
      task_type,
    })
    if (res.code == 200) {
      ElMessage.success('启动成功')
      searchClick()
      loading.value = true
      setTimeout(() => {
        searchClick()
        loading.value = false
      }, 1000)
    }
  }
  const tzClick = async (row) => {
    const { task_id, task_type } = row
    const { data: res } = await service.post('/api/v1/stop_task', {
      task_id,
      task_type,
    })
    if (res.code == 200) {
      ElMessage.success('停止成功')
      searchClick()
      loading.value = true
      setTimeout(() => {
        searchClick()
        loading.value = false
      }, 1000)
    }
  }
  const searchClick = async () => {
    // console.log(dayjs(dateValue.value[0]).format('YYYY-MM-DD HH:mm:ss'));
  
    loading.value = true
    const reqData = {
      task_type: 'search',
      task_name: task_name.value,
      status: '5',
      start_time: dateValue.value.length == 0 ? '' : dayjs(dateValue.value[0]).format('YYYY-MM-DD HH:mm:ss'),
      end_time: dateValue.value.length == 0 ? '' : dayjs(dateValue.value[1]).format('YYYY-MM-DD HH:mm:ss'),
    }
    const { data: res } = await service.get('/api/v1/search_task', { params: reqData })
    console.log(res.data)
    tableData.value = res.data
    loading.value = false
  }
  
  const xjForm = ref<FormInstance>()
  const bjForm = ref<FormInstance>()
  
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
    let task_id: Array<String>
    if (flag == 'mult') {
      task_id = multipleSelection.value.map((item) => item.task_id)
    } else {
      task_id = tableData.value.map((item) => item.task_id)
    }
    if(task_id.length == 0){
        ElMessage.error("请选择需要删除的数据！")
        return false
      }
    ElMessageBox.confirm('是否确定删除数据?', 'Warning', {
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
    const task_id = multipleSelection.value.map((item) => item.task_id)
    console.log(task_id)
    if(task_id.length == 0){
        ElMessage.error("请选择需要导出的数据！")
        return false
      }
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
  
  const jgClick = async (row) => {
    
    const { task_id, task_type } = row
    if (task_type == 'search') {
      cxjgDialogVisible.value = true
      cxjgLoading.value = true
    }else {
      tcjgDialogVisible.value = true
      tcjgLoading.value = true
    }
    const { data: res } = await service.get('/api/v1/get_task_result', { params: { task_id, task_type } })
    if (res.code == 200) {
      if (task_type == 'search') {
        cxjgTableData.value = res.data
        cxjgLoading.value = false
      } else {
        tcjgTableData.value = res.data
        tcjgLoading.value = false
      }
    }
  }
  const jgxzClick = async (row) =>{
    const { task_id, task_type } = row
    // const { data: res } = await service.get('/api/v1/download_result', { params: { task_id, task_type } })
    row.downloadButtonText = '下载中...';
    service({
      method: 'get',
      url: '/api/v1/download_result',
      params: { task_id, task_type },
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
        row.downloadButtonText = '结果下载';
      })
      .catch(function (res) {
        console.log('error', res)
        row.downloadButtonText = '结果下载';
      })
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
  const inClick = async (row) =>{
    const {task_id} = row
    const {data:res} = await service.post('/api/v1/form_entry',{task_id,task_type:'search'})
    if (res.code == 200) {
      ElMessage.success(res.msg)
      loading.value = true
          setTimeout(() => {
            searchClick()
            loading.value = false
          }, 1000)
    }
  }
  
  const outClick = async (row) =>{
    const {task_id} = row
    const {data:res} = await service.post('/api/v1/revoke_entry',{task_id,task_type:'search'})
    if (res.code == 200) {
      ElMessage.success(res.msg)
      loading.value = true
          setTimeout(() => {
            searchClick()
            loading.value = false
          }, 1000)
    }
  }
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val
  }
  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
  }
  const handleSizeChange2 = (val: number) => {
    pagination2.pageSize = val
  }
  const handleCurrentChange2 = (val: number) => {
    pagination2.currentPage = val
  }
  const handleSizeChange3 = (val: number) => {
    pagination3.pageSize = val
  }
  const handleCurrentChange3 = (val: number) => {
    pagination3.currentPage = val
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
  