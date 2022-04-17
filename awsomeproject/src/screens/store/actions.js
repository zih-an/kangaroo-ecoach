/*
 * action 类型
 */
export const ADD_TOKEN = 'ADD_TOKEN';//登录时加入token验证数据
export const ADD_EMAIL = 'ADD_EMAIL';
export const ADD_PWD = 'ADD_PWD';
export const ADD_PLAN = 'ADD_PLAN';//加入所有计划
export const ADD_PLAN_INDEX = 'ADD_PLAN_INDEX';//加入所有计划
export const ADD_TODAY = 'ADD_TODAY';//加入今日计划id
export const CHANGE_TODAY = 'CHANGE_TODAY';//加入今日计划id
export const DELETE_TODAY = 'DELETE_TODAY';//删除今日计划id
export const ADD_TODAY_DETAIL = 'ADD_TODAY_DETAIL';//加入今日计划详情（用于展示）
export const ADD_SHOP = 'ADD_SHOP';//加入商品信息
export const ADD_TITLE = 'ADD_TITLE';//加入浏览页标题信息
export const ADD_COLLECT = 'ADD_COLLECT';//加入收藏信息
export const DELETE_COLLECT = 'DELETE_COLLECT';//删除收藏信息
export const CHANGE_COLLECT = 'CHANGE_COLLECT';//更改收藏信息





/*
 * action 创建函数，暴露给组件使用，组件内部直接调用即可自动通过reducers更新state
 */

export function addToken(tokenText) {
    return { type: ADD_TOKEN, text: tokenText}
}
export function addEmail(emailText) {
    return { type: ADD_EMAIL, text: emailText}
}
export function addPwd(pwdText) {
    return { type: ADD_PWD, text: pwdText}
}

export function addPlan(plan){
    return { type: ADD_PLAN, content:plan}
}
export function addPlanIndex(plan){
    return { type: ADD_PLAN_INDEX, content:plan}
}
export function addToday(plan){
    return { type: ADD_TODAY, content:plan}
}
export function changeToday(plan){
    return { type: CHANGE_TODAY, content:plan}
}

export function deleteToday(ixdex){
    return { type: DELETE_TODAY, id:ixdex}
}

export function addTodayDetail(plans){
    return { type: ADD_TODAY_DETAIL, content:plans}
}
export function addShop(items){
    return { type: ADD_SHOP, content:items}
}
export function addTitle(items){
    return { type: ADD_TITLE, content:items}
}
export function addCollect(items){
    return { type: ADD_COLLECT, content:items}
}
export function changeCollect(items){
    return { type: CHANGE_COLLECT, content:items}
}
export function deleteCollect(items){
    return { type: DELETE_COLLECT, content:items}
}