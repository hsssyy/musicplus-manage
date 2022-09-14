export const mixin = {
    methods: {
        notify(title, type) {
            this.$notify({
                title: title,
                type: type,
                offset: 80//偏移量
            })
        },
        //获取性别中文
        changeSex(value) {
            if (value == 0) {
                return '女';
            }
            if (value == 1) {
                return '男';
            }
            if (value == 2) {
                return '组合';
            }
            if (value == 3) {
                return '不明';
            }
            return value;
        },
        ///根据相对地址获取绝对地址
        getUrl(url) {
            return `http://127.0.0.1:8888` + `${url}`
        },
        //弹出删除窗口
        handleDelete(id) {
            this.idx = id;
            this.delVisible = true;
        },
        //上传图片成功之后要做的工作
        handleAvatorSuccess(res) {
            let _this = this;
            if (res.code == 1) {
                _this.getData();
                _this.$notify({
                    title: '上传成功',
                    type: 'success'
                });
            } else {
                _this.$notify({
                    title: '上传失败',
                    type: 'error'
                });
            }
        },
    }
}