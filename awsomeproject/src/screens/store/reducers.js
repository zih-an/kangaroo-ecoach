import { combineReducers } from 'redux';

const defaultState={
    token:'',
    email:'',
    pwd:''
};
const defaultPlan=[];
const defaultTitle="";
const defaultPlanIndex=[];
const defaultTodayPlan=[];
const defaultTodayPlanB=[];
const defaultCollect=[];
const defaultTodayPlanDetail=[];
const defaultShop=[];
const defaultReport = {};
const defaultReportTime = {};
function  login (state=defaultState,action) {
//reducer只能接受state，不能改变
//登陆界面的state：login，含加入邮箱、token、密码
    if(action.type==='ADD_EMAIL'){
        let newState=JSON.parse(JSON.stringify(state));
        newState.email=action.text;
        return newState;
    }
    if(action.type==='ADD_TOKEN'){
        let newState=JSON.parse(JSON.stringify(state));
        newState.token=action.text;
        return newState;
    }
    if(action.type==='ADD_PWD'){
        let newState=JSON.parse(JSON.stringify(state));
        newState.pwd=action.text;
        return newState;
    }
    return state;
}
function allPlans (state=defaultPlan,action){
    //所有计划的state：含一次加入所有计划
    if(action.type==='ADD_PLAN'){
        return action.content
    }
    return state;
}
function allPlansIndex (state=defaultPlanIndex,action){
    //所有计划的state：含一次加入所有计划
    if(action.type==='ADD_PLAN_INDEX'){
        return action.content.map((item,index)=>{return {"id":item.id,"title":item.title}})
    }
    return state;
}
function todayPlans (state=defaultTodayPlan,action){
    //今日计划的id数组，含增删计划id
    if(action.type==='ADD_TODAY'){
        let newState=JSON.parse(JSON.stringify(state));
        let arr=newState.concat(action.content);
        let arrSort=arr.sort(function(a, b){return a - b});
        return Array.from(new Set(arrSort));
    }
    else if(action.type==='DELETE_TODAY'){
        return state.filter((plan)=>{return plan !== action.id});
    }
    else if(action.type==='CHANGE_TODAY'){
        let arr=action.content;
        let newState = state.filter((plan)=>{return arr.includes(plan)});
        arr=newState.concat(action.content);
        let arrSort=arr.sort(function(a, b){return a - b});
        return Array.from(new Set(arrSort));
    }
    return state;
}
function todayPlansB (state=defaultTodayPlanB,action){
    //今日计划的id数组，含增删计划id
    if(action.type==='ADD_TODAY_B'){
        let newState=JSON.parse(JSON.stringify(state));
        let arr=newState.concat(action.content);
        let arrSort=arr.sort(function(a, b){return a - b});
        return Array.from(new Set(arrSort));
    }
    else if(action.type==='DELETE_TODAY_B'){
        return state.filter((plan)=>{return plan !== action.id});
    }
    else if(action.type==='CHANGE_TODAY_B'){
        let arr=action.content;
        let newState = state.filter((plan)=>{return arr.includes(plan)});
        arr=newState.concat(action.content);
        let arrSort=arr.sort(function(a, b){return a - b});
        return Array.from(new Set(arrSort));
    }
    return state;
}

function  todayPlansDetail (state=defaultTodayPlanDetail,action){
    //今日计划的详情数组，在更新id数组后每次直接更新为获取的数据即可
    if(action.type==='ADD_TODAY_DETAIL'){
        return action.content;
    }

    return state;
}
function  shop (state=defaultShop,action){
    //商城商品的state，登录时一次读入所有商品
    if(action.type==='ADD_SHOP'){
        return action.content
    }
    return state;
}

function report (state = defaultReport,action){
    if(action.type==='ADD_REPORT'){
        return action.content;}
    return state;
}

function title (state=defaultTitle,action){
    if(action.type==='ADD_TITLE'){
        return action.content
    }
    return state;
}
function collect (state=defaultCollect,action){
    //今日计划的id数组，含增删计划id
    if(action.type==='ADD_COLLECT'){
        let newState=JSON.parse(JSON.stringify(state));
        let arr=newState.concat(action.content);
        let arrSort=arr.sort(function(a, b){return a - b});
        return Array.from(new Set(arrSort));
    }
    else if(action.type==='DELETE_COLLECT'){
        return state.filter((plan)=>{return plan !== action.content});
    }
    else if(action.type==='CHANGE_COLLECT'){
        let arr=action.content;
        let newState = state.filter((plan)=>{return arr.includes(plan)});
        arr=newState.concat(action.content);
        let arrSort=arr.sort(function(a, b){return a - b});
        return Array.from(new Set(arrSort));
    }
    return state;
}

function reportTime (state=defaultReportTime,action){
    if(action.type==='ADD_REPORT_TIME'){
        return action.content;}
    return state;
}
//组合所有reducer（state），外部通过theApp一次引用，只需在根目录App.js引入一次即可，其余使用state的组件
//只需额外单独引入actions用于改变组件状态，并用connect(react-redux特性)函数来关联组件与state、action即可
// const theApp = combineReducers({login,allPlans,todayPlans,todayPlansDetail,shop,allPlansIndex,report});
const theApp = combineReducers({login,allPlans,todayPlans,todayPlansDetail,shop,allPlansIndex,title,collect,report,reportTime,todayPlansB});
export default theApp;