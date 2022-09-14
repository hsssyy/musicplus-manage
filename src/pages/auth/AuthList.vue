<template>
    <div>
        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==='0'" type="success">一级</el-tag>
                        <el-tag v-else-if="scope.row.level==='1'" type="warning">二级</el-tag>
                        <el-tag v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 权限列表
            rightsList: []
        }
    },
    created() {
        // 获取所有的权限
        this.getRightsList()
    },
    methods: {
        // 获取权限列表
        async getRightsList() {
            const { data: res } = await this.$http.get('rights/list')
            if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
            this.rightsList = res.data
            return this.$message.success('获取权限列表成功！')
        }
    }
}
</script>

<style>

</style>