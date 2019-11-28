<template>
    <div class="index">
        <div class="p1" @click="get"></div>
    </div>
</template>
<script>
export default {
    name:"index",
    data(){
        return {
            index:"hahah"
        }
    },
    methods:{
        get(){
            console.log("hahaha");
        }
    }
}
</script>
<style lang="stylus" scoped>
.index
    width 100%
    height 100%
    position:absolute
    left 0
    top 0
    background url(../assets/images/bg.png) no-repeat center top
    background-size auto auto;
    overflow hidden
.index
    .p1
        width 345px
        height 535px;
        background url(../assets/images/1.png) no-repeat center top
        background-size 100% 100%
        margin 0 auto
        margin-top 80px
</style>