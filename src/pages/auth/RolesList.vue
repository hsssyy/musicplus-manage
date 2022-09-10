<template>
    <div>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRole">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区 -->
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 type=expand-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 栅格系统来处理布局 5:19 v-for首参默认是元素，次参默认是索引-->
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                            v-for="(item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)"
                                    :disable-transitions="false">{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级、三级权限 -->
                            <el-col :span="19">
                                <!-- 栅格系统来处理布局 6:18 -->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                                    v-for="(item2, i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag closable @close="removeRightById(scope.row, item2.id)" type="success"
                                            :disable-transitions="false">{{ item2.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable
                                            @close="removeRightById(scope.row, item3.id)" :disable-transitions="false">
                                            {{ item3.authName }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 常规列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" min-width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editThisRole(scope.row)">编辑
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeThisRole(scope.row)">删除
                        </el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini"
                            @click="showRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色的对话框 -->
        <el-dialog :title="addORedit == 1 ? '新增角色' : '编辑角色信息'" :visible.sync="showAddRoleDialog" width="50%"
            @close="closeAddRoleDialog">
            <el-form :model="roleInfo" status-icon :rules="roleInfoRules" ref="addRoleForm" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input type="text" v-model.trim="roleInfo.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input type="text" v-model.trim="roleInfo.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetAddRoleForm">重 置</el-button>
                <el-button type="primary" @click="submitRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限的对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisble" width="50%" @close="setRightDialogClosed">
            <!-- 树形控件 node-key指定的id会根据绑定给tree的data数据源中的id值作为选中标识，default-checked-keys指定默认选中的节点数组，数组中的值应该是node-key指定的id值-->
            <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="id"
                :default-expand-all="true" :default-checked-keys="defKeys"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisble = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色列表的数据
            rolesList: [],
            // 控制分配角色权限对话框的显示与隐藏
            setRightDialogVisble: false,
            // 所有权限的数据（供给权限树弹窗使用）
            rightsList: [],
            // 树形控件的树形绑定对象
            treeProps: {
                label: 'authName',
                children: 'children',
            },
            // 默认选中的树形节点ID值数组，配合default-checked-keys的指定使用
            defKeys: [],
            // 角色ID（在）
            roleID: '',
            // 控制添加角色的对话框显示与否
            showAddRoleDialog: false,
            // 用于存储新增角色对话框中的数据
            roleInfo: {
                roleName: '',
                roleDesc: '',
                roleId: 0,
            },
            // 应用验证规则
            roleInfoRules: {
                roleName: [
                    { required: true, message: '请输入角色名称！', trigger: 'blur' },
                ],
                roleDesc: [
                    {
                        min: 0,
                        max: 30,
                        message: '角色描述应该在0~30之间',
                        trigger: 'blur',
                    },
                ],
            },
            // 使用了一个Dialog既做添加也做修改，通过判断addORedit来确定标题(0起始，1添加，2编辑)
            addORedit: 0,
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        // 获取所有角色数据
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200)
                return this.$message.error('获取角色列表数据失败！')
            this.rolesList = res.data
        },
        // 添加角色
        addRole() {
            this.addORedit = 1
            this.showAddRoleDialog = true
        },
        // 提交角色信息-先做预校验，然后再发送提交请求
        submitRoleInfo() {
            if (this.addORedit == 1) {
                this.$refs.addRoleForm.validate(async (valid) => {
                    if (!valid) return this.$message.info('请填写必要信息！')
                    const { data: res } = await this.$http.post('roles', this.roleInfo)
                    if (res.meta.status !== 201)
                        return this.$message.error('添加角色失败！')
                    this.$message.success('添加角色成功！')
                    this.getRolesList()
                })
            }
            if (this.addORedit == 2) {
                this.$refs.addRoleForm.validate(async (valid) => {
                    if (!valid) return this.$message.info('请填写必要信息！')
                    const { data: res } = await this.$http.put(
                        `roles/${this.roleInfo.roleId}`,
                        this.roleInfo
                    )
                    if (res.meta.status !== 200)
                        return this.$message.error('修改角色信息失败！')
                    this.$message.success('修改角色信息成功！')
                    this.getRolesList()
                })
            }
            // this.getRolesList()放这里更新信息时会有不及时的时候，不晓得为何
            this.showAddRoleDialog = false
            this.roleInfo = {
                roleName: '',
                roleDesc: '',
                roleId: 0,
            }
        },
        // 关闭添加角色的弹窗
        closeAddRoleDialog() {
            this.roleInfo.roleName = ''
            this.roleInfo.roleDesc = ''
            this.$refs.addRoleForm.resetFields()
        },
        // 重置添加角色的表单
        resetAddRoleForm() {
            this.$refs.addRoleForm.resetFields()
            this.roleInfo.roleName = ''
            this.roleInfo.roleDesc = ''
        },
        // 删除角色
        async removeThisRole(role) {
            const confirmRes = await this.$confirm(
                '此操作将会删除此角色，是否继续？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((err) => err)
            if (confirmRes !== 'confirm') {
                return this.$message.info('已取消删除操作！')
            }
            const { data: res } = await this.$http.delete(`roles/${role.id}`)
            if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
            this.getRolesList()
            this.$message.success('删除角色成功！')
        },
        // 编辑角色
        async editThisRole(role) {
            // 切换title为编辑
            this.addORedit = 2
            // 发起请求获取当前信息
            // const {data:res}=await this.$http.get(`roles/${role.id}`)
            // 在显示弹窗前更新弹窗绑定的数据源(这里做了连续解构)
            const {
                data: {
                    data: { roleName, roleDesc, roleId },
                },
            } = await this.$http.get(`roles/${role.id}`)
            this.roleInfo = { roleName, roleDesc, roleId }
            this.showAddRoleDialog = true
        },
        // 根据id删除权限标签
        async removeRightById(role, rightID) {
            // 弹窗提示用户是否要删除
            const confirmRes = await this.$confirm(
                '此操作将永久删除该文件，是否继续？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((err) => err)
            if (confirmRes !== 'confirm') {
                return this.$message.info('已取消删除操作！')
            }
            const { data: res } = await this.$http.delete(
                `/roles/${role.id}/rights/${rightID}`
            )
            if (res.meta.status !== 200) {
                return this.$message.error('删除权限失败')
            }
            // 这里不做角色权限列表的重新获取，不调用获取的方法，调用后会页面表格会被重新渲染，表格列也就被关闭
            // 服务器删除后返回的值就是最新的权限表，把作用域插槽的数据源重新赋值就可以避免外层表格的重构
            role.children = res.data
            return this.$message.success('已删除权限')
        },
        // 点击分配权限按钮
        async showRightDialog(roleNode) {
            // 将当前角色的ID保存起来供分配权限时携带指定角色的ID发起请求使用
            this.roleID = roleNode.id
            // 获取所有的权限数据
            const { data: res } = await this.$http.get('rights/tree')
            console.log(res)
            console.log(roleNode)
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限失败')
            }
            //  将获取到的数据保存到data的数组中，供响应式渲染
            this.rightsList = res.data
            //  调用getLeafKeys来获取最后一层节点的id数组供“默认选中”属性去使用
            this.getLeafKeys(roleNode, this.defKeys)
            this.setRightDialogVisble = true
        },
        // 通过递归的形式获取到三级节点的id并保存到数组中，供default-checked-keys做数据获取
        getLeafKeys(node, keyArr) {
            // node用于判断是否为三级节点（还有没有children）
            if (!node.children) {
                return keyArr.push(node.id)
            }
            // 下面的操作很绝！
            // 走到这儿说明还有children，还不是最后一层节点，对自己的每个children再做挖掘
            node.children.forEach((item) => {
                this.getLeafKeys(item, keyArr)
            })
        },
        // 监听分配权限对话框的关闭事件
        setRightDialogClosed() {
            // 因为getLeafKeys获取默认选中项时一直对数组进行push，但数组没有被清空过，所以每一次操作都是在上一次的基础上push的，会保留之前的数据。
            // 也就出现点击完A后再点B角色，对角色B分配权限时由于数组数据残留有A的，也就把A所拥有的权限也默认选上了
            this.defKeys = []
        },
        // 确定为角色分配权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ]
            const keysStr = keys.join(',')
            const { data: res } = await this.$http.post(
                `roles/${this.roleID}/rights`,
                { rids: keysStr }
            )
            if (res.meta.status !== 200) {
                return this.$message.error('分配权限失败！')
            }
            this.$message.success('分配权限成功！')
            this.getRolesList()
            this.setRightDialogVisble = false
            console.log(keys)
        },
    },
}
</script>

<style scoped>
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

/* 实现展开之后每一列内容的垂直居中对齐 */
.vcenter {
    display: flex;
    align-items: center;
}
</style>