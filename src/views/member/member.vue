<style lang="less">
    @import './member.less';
    @import '../../styles/common.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title"> 会员列表 </p>
            <Row class="table-header"> 
                <Col span="12">
                    <Button type="primary" icon="plus" @click="newMemberClick">开卡</Button>
                </Col>
                <Col span="12" style="text-align:right;">
                    <Input v-model="queryOption.query" icon="ios-search" placeholder="输入手机号，会员姓名" style="width: 200px"></Input>
                    <Button type="primary" icon="ios-search" @click="search">搜索</Button>
                    <Button type="primary" icon="refresh" @click="refreshList">刷新列表</Button>
                </Col>
            </Row>
            <Table :columns="columns" :data="data"></Table>
            <Page :total="queryOption.total" :page-size="queryOption.pageSize" class="member-pagation" @on-change="pageChange"></Page>
            <!-- 删除会员提示框 -->
            <Modal v-model="deleteModal" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="information-circled"></Icon>
                    <span>操作警告</span>
                </p>
                <div style="text-align:center">
                    <p>会员 <strong style="color:#2d8cf0;">{{userInfo}}</strong> 将丢失所有个人信息</p>
                    <p>是否继续删除？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long :loading="modal_loading" @click="removeConfirm">确认删除</Button>
                </div>
            </Modal>

            <!-- 编辑会员提示框 -->
            <Modal v-model="detailModal" width="50%">
                <p slot="header">
                    <span>{{userInfo}} 会员储值信息</span>
                </p>
                <div class="user-info">
                    <Row class="user-info-item">
                        <Col :span="14">
                            当前金额余额：<strong class="color-default font-16">{{activeItem.total_balance}} 元</strong>， 
                            当前次数余额：<strong class="color-default font-16">{{activeItem.card_balance}} 次</strong>
                        </Col>
                        <Col :span="10">当前操作状态是：<strong class="color-error font-16">{{memberType}}</strong>，请谨慎操作</Col>
                    </Row>
                    <p class="user-info-item_p user-info-item_line"></p>
                    <Row class="user-info-item">
                        <RadioGroup v-model="memberType" @on-change="radioChange">
                            <Radio label="会员消费"></Radio>
                            <Radio label="会员充值"></Radio>
                        </RadioGroup>
                    </Row>
                    <Row class="user-info-item" v-if="memberType === '会员消费'">
                        <p class="user-info-item_p">请输入消费金额（元）：<InputNumber :min="0" :max="activeItem.total_balance" v-model="consumption.money"></InputNumber></p>
                        <p class="user-info-item_p">请输入消费次数（次）：<InputNumber :min="0" :max="activeItem.card_balance" v-model="consumption.times"></InputNumber></p>
                        <p class="user-info-item_p user-info-item_line"></p>
                        <p class="user-info-item_p">
                            消费后的金额余额为：<strong class="color-default font-16">{{activeItem.total_balance-consumption.money}}</strong> 元，
                            消费后的次数余额为：<strong class="color-default font-16">{{activeItem.card_balance-consumption.times}}</strong> 次
                        </p>
                        <p class="user-info-item_p color-error text-center">请仔细核对上述金额变动，以防造成损失</p>
                    </Row>
                    <Row class="user-info-item" v-if="memberType === '会员充值'">
                        <p class="user-info-item_p">请输入充值金额（元）：<InputNumber :min="0"  v-model="recharge.money"></InputNumber></p>
                        <p class="user-info-item_p">请输入充值次数（次）：<InputNumber :min="0"v-model="recharge.times"></InputNumber></p>
                        <p class="user-info-item_p user-info-item_line"></p>
                        <p class="user-info-item_p">
                            充值后的金额余额为：<strong class="color-default font-16">{{activeItem.total_balance+recharge.money}}</strong> 元，
                            充值后的次数余额为：<strong class="color-default font-16">{{activeItem.card_balance+recharge.times}}</strong> 次
                        </p>
                        <p class="user-info-item_p color-error text-center">请仔细核对上述金额变动，以防造成损失</p>
                    </Row>
                </div>
                <div slot="footer">
                    <Button type="primary" size="large" long :loading="modal_loading" @click="modifyConfirm">确认信息变更</Button>
                </div>
            </Modal>

            <!-- 编辑会员确认框 -->
            <Modal v-model="modifyModal" :title="memberType" @on-ok="modifySecondConfirm" @on-cancel="modifyCancel">
                <div v-if="memberType === '会员消费'">
                    <p class="confirm-item">
                        当前金额余额：<strong class="color-default font-16">{{activeItem.total_balance}}</strong> 元, 消费了  <strong class="color-default font-16">{{consumption.money}}</strong> 元，金额余额为 <strong class="color-default font-16">{{activeItem.total_balance-consumption.money}}</strong> 元
                    </p>
                    <p class="confirm-item">
                        当前次数余额：<strong class="color-default font-16">{{activeItem.card_balance}}</strong> 元, 消费了 <strong class="color-default font-16">{{consumption.times}}</strong> 次，次数余额为 <strong class="color-default font-16">{{activeItem.card_balance-consumption.times}}</strong> 元
                    </p>
                </div>
                <div v-if="memberType === '会员充值'">
                    <p class="confirm-item">
                        当前金额余额：<strong class="color-default font-16">{{activeItem.total_balance}}</strong> 元, 充值了 <strong class="color-default font-16">{{recharge.money}}</strong> 元，金额余额为 <strong class="color-default font-16">{{activeItem.total_balance+recharge.money}}</strong> 元
                    </p>
                    <p class="confirm-item">
                        当前次数余额：<strong class="color-default font-16">{{activeItem.card_balance}} </strong>次, 充值了 <strong class="color-default font-16">{{recharge.times}} </strong> 次，次数余额为 <strong class="color-default font-16">{{activeItem.card_balance+recharge.times}} </strong> 次
                    </p>
                </div>
            </Modal>

            <!-- 新增会员确认框 -->
            <Modal v-model="newModal">
                <p slot="header">
                    <span>新增会员</span>
                </p>
                <div>   
                    <Form :model="newMemberForm" :label-width="80" :rules="ruleValidate" ref="newMember">
                        <FormItem label="用户名：" prop="userName">
                            <Input v-model="newMemberForm.userName" placeholder="请输入用户名"></Input>
                        </FormItem>
                        <FormItem label="手机号：" prop="phone">
                            <Input v-model="newMemberForm.phone" placeholder="请输入手机号"></Input>
                        </FormItem>
                    </Form>
                </div>
                <div slot="footer">
                    <Button type="primary" @click="newMerberConfirm">确认</Button>
                </div>
            </Modal>

            <!-- 操作历史提示框 -->
            <Modal v-model="historyModal">
                <p slot="header">
                    <span>操作历史</span>
                </p>
                <Timeline>
                    <TimelineItem v-for="item in historyList" :key="item.create_time">
                        <p class="time">{{item.create_time}}</p>
                        <p class="content">
                            操作类型：<span :style="{color: item.type === 'recharge'? 'green' : 'red'}">{{item.typeText}}</span>
                        </p>
                        <p class="content">
                            变动值：金额变动（<span :style="{color: item.type === 'recharge'? 'green' : 'red'}">{{item.type === 'recharge'?'+':'-'}}{{item.balance_change}}</span>）元，次数变动（<span :style="{color: item.type === 'recharge'? 'green' : 'red'}">{{item.type === 'recharge'?'+':'-'}}{{item.times_change}}</span>）次
                        </p>
                        <p class="content">
                            当次结余：金额余额（{{item.balance_now}}）元，次数余额（{{item.times_now}}）次
                        </p>
                    </TimelineItem>  
                    <p v-if="!historyList || historyList.length === 0">无历史</p>
                </Timeline>
                <div slot="footer">
                </div>
            </Modal>
        </Card>
    </div>
</template>

<script>
import moment from 'moment'
import dateFormat from './format'
export default {
    name: 'member_index',
    data(){
        const phonePassCheck = (rule, value, callback) => {
            if (!value){
                callback(new Error('请输入手机号'));
            }else{
                if(/^[1][3,4,5,7,8][0-9]{9}$/.test(value)){
                    callback();
                }else{
                    callback(new Error('手机号不合法'));
                }
            }
        };
        const namePassCheck =  (rule, value, callback) => {
            if (!value){
                callback(new Error('请输入用户名'));
            }else{
                if(/^[\u4e00-\u9fa5]+$/.test(value)){
                    callback();
                }else{
                    callback(new Error('只允许输入汉字'));
                }
            }
        };
        return {
            queryOption:{
                total: 35,
                pageNow: 1,
                pageSize: 15,
                query: ''
            },
            consumption: {
                money: 0,
                times: 0
            },
            recharge: {
                money: 0,
                times: 0
            },
            historyList: [],
            newMemberForm: {
                userName: '',
                phone: ''
            },
            ruleValidate: {
                phone: { validator: phonePassCheck, trigger: 'blur' },
                userName: { validator: namePassCheck, trigger: 'blur' }
            },
            memberType: '会员消费',
            activeItem: {},
            userInfo: "",
            deleteModal: false,
            detailModal: false,
            modifyModal: false,
            modal_loading: false,
            newModal: false,
            historyModal: false,
            columns: [
                {
                    title: '卡号',
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '手机号',
                    key: 'phone',
                    width: 120
                },
                {
                    title: '余额（元）',
                    key: 'total_balance'
                },
                {
                    title: '会员卡次数余额',
                    key: 'card_balance',
                    width: 120
                },
                {
                    title: '注册日期',
                    key: 'create_time',
                    width: 160
                },
                {
                    title: '最后消费日期',
                    key: 'update_time',
                    width: 160
                },
                {
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
                                        this.historyClick(params)
                                    }
                                }
                            }, '历史'),
                            h('Button', {
                                props: {
                                    type: 'primary'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.detailClick(params)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error'
                                },
                                on: {
                                    click: () => {
                                        this.removeClick(params)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            data: []
        };
    },
    methods: {
        pageChange(pageNow){
            this.queryOption.pageNow = pageNow;
            this.fetchMemberList();
        },
        removeClick(params){
            this.activeItem = params.row;
            this.userInfo = params.row.name +' （'+ params.row.phone +'）';
            this.deleteModal = !this.deleteModal;
        },
        removeConfirm(){
            this.modal_loading = true;
            this.$http.delete('/api/member/' + this.activeItem.phone).then(res => {
                if(res.statusText === 'OK' && res.data){
                    if(res.data.errorCode === 0){
                        this.modal_loading = false;
                        this.deleteModal = !this.deleteModal;
                        this.fetchMemberList();
                        this.$Message.success('删除成功');
                    }
                }
            });
        },
        detailClick(params){
            this.activeItem = JSON.parse(JSON.stringify(params.row));
            this.userInfo = params.row.name+ '( '+ params.row.phone +')';
            this.detailModal = !this.detailModal;
            this.resetMoneyAndTimes();
        },
        modifyConfirm(){
            this.detailModal = false;
            this.modifyModal = true;
        },
        modifySecondConfirm(){
            let postParmas = {
                balance_old: this.activeItem.total_balance,
                times_old: this.activeItem.card_balance,
                type: this.memberType === '会员充值' ? 'recharge' : 'consumption',
                balance_change: this.memberType === '会员充值' ? this.recharge.money : this.consumption.money,
                times_change: this.memberType === '会员充值' ? this.recharge.times : this.consumption.times,
            };
            this.$http.put('/api/member/' + this.activeItem.phone, postParmas).then(res => {
                if(res.statusText === 'OK' && res.data){
                    if(res.data.errorCode === 0){
                        this.$Message.success('更新数据成功');
                        this.fetchMemberList();
                    }
                }
            });
        },
        modifyCancel(){

        },
        newMemberClick(){
            this.newModal = !this.newModal;
        },
        newMerberConfirm(){
            this.$refs['newMember'].validate((valid) => {
                if (valid) {
                    this.$http.post('/api/member/new',{
                        userName: this.newMemberForm.userName,
                        phone: this.newMemberForm.phone,
                        create_time: dateFormat()
                    }).then(res => {
                        if(res.statusText === 'OK' && res.data){
                            if(res.data.errorCode === 0){
                                this.$Notice.success({
                                    title: '添加会员成功',
                                    duration: 2
                                });
                                this.refreshList();
                                this.newModal = false;
                            }
                        }
                    });
                }else{
                    this.$Message.error('发生错误，请按照提示修改新用户信息');
                }
            })
        },
        historyClick(params){
            this.historyModal = true;
            this.$http.get('/api/member/history/' + params.row.phone).then(res => {
                if(res.statusText === 'OK' && res.data){
                    if(res.data.errorCode === 0){
                        let historyList = [];
                        res.data.data && res.data.data.forEach(row => {
                            row.create_time = moment(new Date(row.create_time)).format('YYYY-MM-DD hh:mm:ss');
                            row.typeText = row.type === 'recharge' ? '充值' : '消费';
                        });
                        this.historyList = res.data.data;
                    }
                }
            });
        },
        radioChange(){
            this.resetMoneyAndTimes();
        },
        resetMoneyAndTimes(){
            this.consumption = {
                money: 0,
                times: 0
            };
            this.recharge = {
                money: 0,
                times: 0
            };
        },
        search(){
            this.queryOption.pageNow = 1;
            this.fetchMemberList();
        },
        refreshList(){
            this.queryOption.pageNow = 1;
            this.queryOption.query = '';
            this.fetchMemberList();
        },
        fetchMemberList(){
            this.$http.get(`/api/member/list?pageNow=${this.queryOption.pageNow}&pageSize=${this.queryOption.pageSize}&query=${this.queryOption.query}`).then(res => {
                let data = [];
                if(res.statusText === 'OK' && res.data){
                    res.data.data && res.data.data.forEach(row => {
                        data.push({
                            id: row.id,
                            name: row.member_name,
                            phone: row.member_phone,
                            total_balance: row.balance,
                            card_balance: row.times,
                            create_time: row.create_time ? moment(new Date(row.create_time)).format('YYYY-MM-DD hh:mm:ss') : '---',
                            update_time: row.update_time ? moment(new Date(row.update_time)).format('YYYY-MM-DD hh:mm:ss') : '---'
                        });
                        ;
                    });
                    this.queryOption.total = res.data.total;
                    this.data = data;
                    this.$Notice.success({
                        title: '会员列表数据已加载完成',
                        duration: 2
                    });
                }
            });
        }
        
    },
    beforeMount(){
        this.fetchMemberList();
    }
};
</script>
