<template>
    <div class="top">
        <!-- <i class="el-icon-back" @click='callback'></i> -->
        <el-button type="success" icon="el-icon-back" @click='callback'>返回按钮</el-button>
        <span>{{ infor }}</span>
    </div>
</template>

<script>
    export default {
        props: ['infor'],
        methods:{
            callback () {
                this.$router.back(-1)
            }
        }
    }
</script>

<style scoped>
.top{
  width: 100%;
  height: 40px;
  background-color: #41b883;
}
span{
    text-align: center;
    line-height: 40px;
}
</style>
