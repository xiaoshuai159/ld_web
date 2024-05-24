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
              <el-option v-for="item in rwlxOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <!-- <el-button @click="multPut">批量导出</el-button> -->
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
            <el-table-column prop="operator" label="操作" min-width="290px" align="center" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" link @click="xqClick(scope.row)"> 详情 </el-button>
                <!-- :disabled="scope.row.state == 0 4 5 6" 未启动、已停止、任务成功、任务失败   0：启动、 456：重新启动 -->
                <el-button
                  type="success"
                  size="small"
                  link
                  :disabled="scope.row.state == 1 || scope.row.state == 2 || scope.row.state == 3"
                  @click="qdClick(scope.row)"
                >
                  {{ scope.row.state <= 3 ? '启动' : '重新启动' }}</el-button
                >
                <!-- :disabled="scope.row.state == 2" 扫描中 -->
                <el-button type="danger" size="small" link :disabled="scope.row.state != 2" @click="tzClick(scope.row)"> 停止 </el-button>
                <!-- 启动状态下编辑按钮不生效 -->
                <el-button
                  type="primary"
                  size="small"
                  link
                  :disabled="scope.row.state == 1 || scope.row.state == 2 || scope.row.state == 3"
                  @click="editHandler(scope.row)"
                >
                  编辑
                </el-button>
                <el-button type="danger" size="small" link @click="del(scope.row)"> 删除 </el-button>
                <el-button v-if="scope.row.state == 5" type="success" size="small" link @click="jgClick(scope.row)"> 结果查看 </el-button>
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
      <div v-if="curXqData.task_type === 'search'" class="xqDialog">
        <span>任务名称</span><span>{{ curXqData.name }}</span
        ><br />
        <span>任务类型</span><span>{{ curXqData.task_type }}</span
        ><br />
        <span>调用特征id</span><span>{{ curXqData.chara_id }}</span
        ><br />
        <span>厂商名称</span><span>{{ curXqData.ma_name }}</span
        ><br />
        <span>产品名称</span><span>{{ curXqData.product_name }}</span
        ><br />
        <span>产品版本</span><span>{{ curXqData.product_version }}</span
        ><br />
        <span>查询语法</span><span>{{ curXqData.query_syntax }}</span
        ><br />
        <span>特征等级</span>
        <span> <el-rate v-model="curXqData.chara_level" disabled show-score text-color="#ff9900" score-template="{value}星" /> </span><br />
        <span>特征创建/上传日期</span><span>{{ curXqData.create_time }}</span
        ><br />
        <span>更新时间</span><span>{{ curXqData.update_time }}</span
        ><br />
      </div>
      <div v-if="curXqData.task_type === 'detect'" class="xqDialog">
        <span>任务名称</span><span>{{ curXqData.name }}</span
        ><br />
        <span>任务类型</span><span>{{ curXqData.task_type }}</span
        ><br />
        <span>探测网络模式</span><span>{{ internetModeOptions.find((option) => option.value == curXqData.internetMode).label }}</span
        ><br />
        <span>任务优先级</span><span>{{ priorityOptions.find((option) => option.value == curXqData.priority).label }}</span
        ><br />
        <span>网络类型</span><span>{{ sourceOptions.find((option) => option.value == curXqData.source).label }}</span
        ><br />
        <span>失败调度后重新调度次数</span><span>{{ curXqData.dispatchTimes }}</span
        ><br />
        <span>任务标签</span><span>{{ curXqData.labelIds.length == 0 ? '无' : curXqData.labelIds }}</span
        ><br />
        <span>探测ip目标</span><span>{{ curXqData.taskContent.ipText }}</span
        ><br />
        <span>探测端口目标</span
        ><span style="display: inline-block; width: 220px; overflow: hidden; text-overflow: ellipsis">{{
          curXqData.taskContent.portText
        }}</span
        ><br />
        <span>poc</span><span>{{ curXqData.taskContent.pocs }}</span
        ><br />
        <span>漏扫白名单</span><span>{{ curXqData.taskContent.blacklist }}</span
        ><br />
        <span>探测节点</span><span>{{ curXqData.taskLabels.nodeType }}</span
        ><br />
        <span>使用节点数量</span><span>{{ curXqData.taskLabels.nodeCount }}</span
        ><br />
      </div>
    </el-dialog>
    <el-dialog v-model="xjDialogVisible" title="新建" width="30%">
      <el-form ref="xjForm" :model="curXjData" :rules="rules" label-width="140px">
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="curXjData.task_name" placeholder="请输入任务名称" style="width: 220px" @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item>
        <el-form-item label="任务类型" prop="task_type">
          <el-select v-model="curXjData.task_type" placeholder="请选择任务类型" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in rwlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- search -->
        <el-form-item v-if="curXjData.task_type === 'search'" label="资产特征" prop="chara_name">
          <el-select
            v-model="curXjData.chara_name"
            filterable
            remote
            reserve-keyword
            placeholder="请输入并选择资产特征"
            remote-show-suffix
            :remote-method="remoteMethod"
            :loading="selectLoading"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          >
            <el-option v-for="item in curXjData.zctzOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'search'" label="相关厂商" prop="ma_name">
          <el-input
            v-model="curXjData.ma_name"
            placeholder="请输入相关厂商名称"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'search'" label="相关产品名称" prop="product_name">
          <el-input
            v-model="curXjData.product_name"
            placeholder="请输入相关产品名称"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'search'" label="相关产品版本" prop="product_version">
          <el-input
            v-model="curXjData.product_version"
            placeholder="请输入相关产品版本"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'search'" label="资产特征编号" prop="chara_id">
          <el-input
            v-model="curXjData.chara_id"
            placeholder="请输入资产特征编号"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'search'" label="特征对应语法" prop="query_syntax">
          <el-input
            v-model="curXjData.query_syntax"
            placeholder="请输入特征对应语法"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'search'" label="资产特征等级" prop="chara_level">
          <el-input
            v-model="curXjData.chara_level"
            placeholder="请输入资产特征等级"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <!-- detect -->
        <el-form-item v-if="curXjData.task_type === 'detect'" label="探测网络模式" prop="internetMode">
          <el-select
            v-model="curXjData.internetMode"
            placeholder="请选择探测网络模式"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          >
            <el-option v-for="item in internetModeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'detect'" label="任务优先级" prop="priority">
          <el-select v-model="curXjData.priority" placeholder="请选择任务优先级" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'detect'" label="网络类型" prop="source">
          <el-select v-model="curXjData.source" placeholder="请选择网络类型" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'detect'" label="失败后是否重新调度" prop="reissue">
          <el-select v-model="curXjData.reissue" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in reissueOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'detect' && curXjData.reissue == 9" label="重新调度次数" prop="dispatchTimes">
          <el-input
            v-model="curXjData.dispatchTimes"
            placeholder="请输入重新调度次数"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'detect'" label="任务标签" prop="labelIds">
          <el-input
            v-model="curXjData.labelIds"
            placeholder="多个任务标签，以英文逗号分割"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <!-- <el-form-item label="探测目标类型" prop="ipSourceType" v-if="curXjData.task_type === 'detect'">
          <el-select v-model="curXjData.ipSourceType" placeholder="请选择" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in ipSourceTypeOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item v-if="curXjData.task_type === 'detect' && curXjData.ipSourceType == 1" label="探测ip目标" prop="ip_targets">
          <el-input
            v-model="curXjData.ip_targets"
            placeholder="多个ip，以英文逗号分割"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'detect' && curXjData.ipSourceType == 1" label="探测端口目标" prop="port_targets">
          <el-input
            v-model="curXjData.port_targets"
            placeholder="多个port，以英文逗号分割"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
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
        <el-form-item v-if="curXjData.task_type === 'detect' && curXjData.pocType == 1" label="选择poc" prop="pocs">
          <el-select
            v-model="curXjData.pocs"
            filterable
            remote
            reserve-keyword
            placeholder="请输入并选择poc"
            remote-show-suffix
            :remote-method="remoteMethod3"
            :loading="selectLoading"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          >
            <el-option v-for="item in curXjData.zctzOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="poc分组" prop="pocGroups" v-if="curXjData.task_type === 'detect' && curXjData.pocType == 2">
          <el-input v-model="curXjData.pocGroups" placeholder="多个poc，以英文逗号分割" style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)" />
        </el-form-item> -->
        <el-form-item v-if="curXjData.task_type === 'detect'" label="漏扫白名单" prop="blacklist">
          <el-input
            v-model="curXjData.blacklist"
            placeholder="多个ip，以英文逗号分割"
            style="width: 220px"
            @keyup.enter="handleSubmit(xjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'detect'" label="探测节点" prop="nodeType">
          <el-select v-model="curXjData.nodeType" placeholder="请选择探测节点" style="width: 220px" @keyup.enter="handleSubmit(xjForm)">
            <el-option v-for="item in nodeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="curXjData.task_type === 'detect'" label="使用节点数量" prop="nodeCount">
          <el-input
            v-model="curXjData.nodeCount"
            placeholder="请输入使用节点数量"
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
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="curBjData.task_name" placeholder="请输入任务名称" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)" />
        </el-form-item>
        <el-form-item label="任务类型" prop="task_type">
          <el-select
            v-model="curBjData.task_type"
            placeholder="请选择任务类型"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit2(bjForm)"
          >
            <el-option v-for="item in rwlxOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="curBjData.task_type === 'search'" label="资产特征" prop="chara_name">
          <el-select
            v-model="curBjData.chara_name"
            filterable
            remote
            reserve-keyword
            placeholder="请输入并选择资产特征"
            remote-show-suffix
            :remote-method="remoteMethod2"
            :loading="selectLoading"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          >
            <el-option v-for="item in curBjData.zctzOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'search'" label="相关厂商" prop="ma_name">
          <el-input
            v-model="curBjData.ma_name"
            placeholder="请输入相关厂商名称"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'search'" label="相关产品名称" prop="product_name">
          <el-input
            v-model="curBjData.product_name"
            placeholder="请输入相关产品名称"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'search'" label="相关产品版本" prop="product_version">
          <el-input
            v-model="curBjData.product_version"
            placeholder="请输入相关产品版本"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'search'" label="资产特征编号" prop="chara_id">
          <el-input
            v-model="curBjData.chara_id"
            placeholder="请输入资产特征编号"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'search'" label="特征对应语法" prop="query_syntax">
          <el-input
            v-model="curBjData.query_syntax"
            placeholder="请输入特征对应语法"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'search'" label="资产特征等级" prop="chara_level">
          <el-input
            v-model="curBjData.chara_level"
            placeholder="请输入资产特征等级"
            style="width: 220px"
            disabled
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>

        <!-- detect -->
        <el-form-item v-if="curBjData.task_type === 'detect'" label="探测网络模式" prop="internetMode">
          <el-select
            v-model="curBjData.internetMode"
            placeholder="请选择探测网络模式"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          >
            <el-option v-for="item in internetModeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect'" label="任务优先级" prop="priority">
          <el-select v-model="curBjData.priority" placeholder="请选择任务优先级" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect'" label="网络类型" prop="source">
          <el-select v-model="curBjData.source" placeholder="请选择网络类型" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect'" label="失败后是否重新调度" prop="reissue">
          <el-select v-model="curBjData.reissue" placeholder="请选择" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in reissueOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect' && curBjData.reissue == 9" label="重新调度次数" prop="dispatchTimes">
          <el-input
            v-model="curBjData.dispatchTimes"
            placeholder="请输入重新调度次数"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect'" label="任务标签" prop="labelIds">
          <el-input
            v-model="curBjData.labelIds"
            placeholder="多个任务标签，以英文逗号分割"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect' && curBjData.ipSourceType == 1" label="探测ip目标" prop="ip_targets">
          <el-input
            v-model="curBjData.ip_targets"
            placeholder="多个ip，以英文逗号分割"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect' && curBjData.ipSourceType == 1" label="探测端口目标" prop="port_targets">
          <el-input
            v-model="curBjData.port_targets"
            placeholder="多个port，以英文逗号分割"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect'" label="选择poc" prop="pocs">
          <el-select
            v-model="curBjData.pocs"
            filterable
            remote
            reserve-keyword
            placeholder="请输入并选择poc"
            remote-show-suffix
            :remote-method="remoteMethod3"
            :loading="selectLoading"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          >
            <el-option v-for="item in curXjData.zctzOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect'" label="漏扫白名单" prop="blacklist">
          <el-input
            v-model="curBjData.blacklist"
            placeholder="多个ip，以英文逗号分割"
            style="width: 220px"
            @keyup.enter="handleSubmit2(bjForm)"
          />
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect'" label="探测节点" prop="nodeType">
          <el-select v-model="curBjData.nodeType" placeholder="请选择探测节点" style="width: 220px" @keyup.enter="handleSubmit2(bjForm)">
            <el-option v-for="item in nodeTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="curBjData.task_type === 'detect'" label="使用节点数量" prop="nodeCount">
          <el-input
            v-model="curBjData.nodeCount"
            placeholder="请输入使用节点数量"
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
    <el-dialog v-model="cxjgDialogVisible" title="结果">
      <div>
        <el-table
          :data="cxjgTableData.slice((pagination2.currentPage - 1) * pagination2.pageSize, pagination2.currentPage * pagination2.pageSize)"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
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
        <div style="display: inline-block; color: rgba(0, 0, 0, 0.427450980392157)"
          >共 {{ cxjgTableData.length }} 条记录，第 {{ pagination2.currentPage }} /
          {{ Math.ceil(cxjgTableData.length / pagination2.pageSize) }} 页</div
        >
        <div style="display: flex; justify-content: right; margin-top: -24px">
          <el-pagination
            background
            :current-page="pagination2.currentPage"
            :page-size="pagination2.pageSize"
            :page-sizes="[10, 20, 50, 100, 300]"
            layout="sizes, prev, pager, next, jumper"
            :total="cxjgTableData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="tcjgDialogVisible" title="结果">
      <div>
        <el-table
          :data="tcjgTableData.slice((pagination3.currentPage - 1) * pagination3.pageSize, pagination3.currentPage * pagination3.pageSize)"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
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
        <div style="display: inline-block; color: rgba(0, 0, 0, 0.427450980392157)"
          >共 {{ tcjgTableData.length }} 条记录，第 {{ pagination3.currentPage }} /
          {{ Math.ceil(tcjgTableData.length / pagination3.pageSize) }} 页</div
        >
        <div style="display: flex; justify-content: right; margin-top: -24px">
          <el-pagination
            background
            :current-page="pagination3.currentPage"
            :page-size="pagination3.pageSize"
            :page-sizes="[10, 20, 50, 100, 300]"
            layout="sizes, prev, pager, next, jumper"
            :total="tcjgTableData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
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
  let curXjData: any = reactive({
    ipSourceType: 1,
    pocType: 1,
  })
  let curBjData: any = reactive({})
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
  const xqClick = async (row) => {
    const { task_type, task_id } = row
    const { data: res } = await service.get('/api/v1/search_task_detail', { params: { task_id } })
    curXqData.value = res.data
    xqDialogVisible.value = true
  }
  const remoteMethod = (query: string) => {
    if (query) {
      selectLoading.value = true
      setTimeout(async () => {
        selectLoading.value = false
        // curXjData.zctzOption.value = list.value.filter((item) => {
        //   return item.label.toLowerCase().includes(query.toLowerCase())
        // })
        const { data: res } = await service.get('/api/v1/search_chara_fuzzy', { params: { chara_name: query } })
        console.log(res)
        curAllChara = res.data
        curXjData.zctzOption = res.data.map((item) => ({
          label: item.chara_name,
          value: item.chara_name,
        }))
      }, 200)
    } else {
      curXjData.zctzOption = []
    }
  }
  const remoteMethod2 = (query: string) => {
    if (query) {
      selectLoading.value = true
      setTimeout(async () => {
        selectLoading.value = false
        // curXjData.zctzOption.value = list.value.filter((item) => {
        //   return item.label.toLowerCase().includes(query.toLowerCase())
        // })
        const { data: res } = await service.get('/api/v1/search_chara_fuzzy', { params: { chara_name: query } })
        curAllChara = res.data
        curBjData.zctzOption = res.data.map((item) => ({
          label: item.chara_name,
          value: item.chara_name,
        }))
      }, 200)
    } else {
      curBjData.zctzOption = []
    }
  }
  const remoteMethod3 = (query: string) => {
    if (query) {
      selectLoading.value = true
      setTimeout(async () => {
        selectLoading.value = false
        // curXjData.zctzOption.value = list.value.filter((item) => {
        //   return item.label.toLowerCase().includes(query.toLowerCase())
        // })
        const { data: res } = await service.get('/api/v1/search_poc', { params: { poc_name: query } })
        console.log(res.data)
        curAllChara = res.data
        // 用curXjData.zctzOption替用一下
        curXjData.zctzOption = res.data.map((item) => ({
          label: item.poc_name,
          value: item.poc_id,
        }))
      }, 200)
    } else {
      curXjData.zctzOption = []
    }
  }
  const taskTypeOptions = ref([
    { label: 'URL特征', value: 'URL特征' },
    { label: 'IP特征', value: 'IP特征' },
  ])

  watch(
    () => curXjData.chara_name,
    (newValue, oldValue) => {
      if (oldValue) {
        // 处理curXjData.chara_name的变化
        console.log('curXjData.chara_name改变了，新值为:', newValue, '旧值为:', oldValue)
        // 进行其他处理
        const temp = curAllChara.find((item) => item.chara_name === newValue)
        console.log(temp)

        curXjData.chara_id = temp.chara_id
        curXjData.chara_level = temp.chara_level
        curXjData.query_syntax = temp.query_syntax
        curXjData.ma_name = temp.ma_name
        curXjData.product_name = temp.product_name
        curXjData.product_version = temp.product_version
      }
    },
  )
  watch(
    () => curBjData.chara_name,
    (newValue, oldValue) => {
      if (oldValue) {
        // 处理curXjData.chara_name的变化
        console.log('curBjData.chara_name改变了，新值为:', newValue, '旧值为:', oldValue)
        console.log(curAllChara)
        // 进行其他处理
        const temp = curAllChara.find((item) => item.chara_name === newValue)
        console.log(temp)
        if (temp) {
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
  // 新建
  const handleSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        let formData = null
        if (curXjData.task_type == 'search') {
          formData = {
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
        } else if (curXjData.task_type == 'detect') {
          formData = {
            name: curXjData.task_name,
            task_type: curXjData.task_type,
            internetMode: curXjData.internetMode,
            priority: curXjData.priority,
            source: curXjData.source,
            reissue: curXjData.reissue,
            dispatchTimes: curXjData.dispatchTimes,
            labelIds: curXjData.labelIds ? curXjData.labelIds.split(',') : [],
            taskContent: {
              ipSourceType: 1,
              ip_targets: curXjData.ip_targets.split(','),
              port_targets: curXjData.port_targets.split(','),
              targetGroups: [],
              pocType: 1,
              pocs: [curXjData.pocs],
              pocGroups: [],
              blacklist: curXjData.blacklist ? curXjData.blacklist.split(',') : [],
            },
            taskLabel: {
              nodeType: curXjData.nodeType,
              nodeCount: curXjData.nodeCount,
            },
          }
        }

        const { data: res2 } = await service.post('/api/v1/create_task', formData)
        console.log(res2)
        xjDialogVisible.value = false
        searchClick()
        ElMessage.success(res2.msg)
        loading.value = true
        setTimeout(() => {
          searchClick()
          loading.value = false
        }, 1000)
        curXjData.task_name = ''
        curXjData.task_type = ''
        curXjData.chara_name = ''
        curXjData.chara_level = ''
        curXjData.chara_id = ''
        curXjData.query_syntax = ''
        curXjData.ma_name = ''
        curXjData.product_name = ''
        curXjData.product_version = ''
        formEl.resetFields()
      } else {
        // 代表特征名称重复
        ElMessage.error('该特征名称已存在，请重新输入！')
      }
    })
  }
  // 编辑
  const handleSubmit2 = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        let formData = null
        if (curBjData.task_type == 'search') {
          formData = {
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
        } else if (curBjData.task_type == 'detect') {
          console.log(curBjData)
          formData = {
            task_id: curXjData.task_id,
            name: curBjData.task_name,
            task_type: curBjData.task_type,
            internetMode: curBjData.internetMode,
            priority: curBjData.priority,
            source: curBjData.source,
            reissue: curBjData.reissue,
            dispatchTimes: curBjData.dispatchTimes,
            labelIds: curBjData.labelIds.length ? curBjData.labelIds.split(',') : [],
            taskContent: {
              ipSourceType: 1,
              // ip_targets: curBjData.ip_targets.split(','),
              // port_targets: curBjData.port_targets.split(','),
              targetGroups: [],
              pocType: 1,
              pocs: [curBjData.pocs],
              pocGroups: [],
              blacklist: curBjData.blacklist ? curBjData.blacklist.split(',') : [],
            },
            taskLabel: {
              nodeType: curBjData.nodeType,
              nodeCount: curBjData.nodeCount,
            },
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
  const editHandler = async (row) => {
    const { task_id } = row
    const { data: res } = await service.get('api/v1/search_task_detail', { params: { task_id } })
    console.log(res.data)

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
      curBjData.internetMode = res.data.internetMode
      curBjData.priority = res.data.priority
      curBjData.source = res.data.source
      curBjData.reissue = res.data.reissue
      curBjData.dispatchTimes = res.data.dispatchTimes
      curBjData.labelIds = res.data.labelIds
      curBjData.blacklist = res.data.blacklist
      curBjData.nodeType = res.data.taskLabels.nodeType
      curBjData.nodeCount = res.data.taskLabels.nodeCount
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
  const pagination2 = reactive({
    currentPage: 1,
    pageSize: 10,
  })
  const pagination3 = reactive({
    currentPage: 1,
    pageSize: 10,
  })
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
    pagination.pageSize = val // 更新每页显示的数据数量
    pagination2.pageSize = val
    pagination3.pageSize = val
  }
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
    pagination.currentPage = val
    pagination2.currentPage = val
    pagination3.currentPage = val
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
    console.log(res)
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
      task_type: task_type.value,
      task_name: task_name.value,
      status: status.value,
      start_time: dateValue.value.length == 0 ? '' : dayjs(dateValue.value[0]).format('YYYY-MM-DD HH:mm:ss'),
      end_time: dateValue.value.length == 0 ? '' : dayjs(dateValue.value[1]).format('YYYY-MM-DD HH:mm:ss'),
    }
    const { data: res } = await service.get('/api/v1/search_task', { params: reqData })
    // console.log(res)
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
    const { data: res } = await service.get('/api/v1/get_task_result', { params: { task_id, task_type } })
    if (res.code == 200) {
      if (task_type == 'search') {
        cxjgTableData.value = res.data
        cxjgDialogVisible.value = true
      } else {
        tcjgTableData.value = res.data
        tcjgDialogVisible.value = true
      }
    }
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
