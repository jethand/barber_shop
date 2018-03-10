<style>

</style>
<template>
    <Card>
        <p slot="title">用户管理</p>
        <Table :columns="columns" :data="data"></Table>
    </Card>
</template>
<script>
    export default {
        data(){
            return {
                columns: [
                    {
                        title: '账号名称',
                        key: 'account'
                    },{
                        title: '身份',
                        key: '管理员'
                    },{
                        title: '操作',
                        width:  260,
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'default'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            
                                        }
                                    }
                                }, '操作')
                            ])
                        }
                    }
                ],
                data: []
            }
        }
    }
</script>