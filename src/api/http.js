import axios from 'axios';//axios框架实现跨域
import router from '../router';
axios.defaults.timeout = 5000;  //请求超时时间是5秒
axios.defaults.withCredentials = true;  //允许跨域 开启cookie缓存携带，如果不设置 ，后端拿不到cookie数据
//Content-Type 响应头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//基础url
axios.defaults.baseURL = "http://localhost:8888";//这个是后端的请求地址

//响应拦截器
axios.interceptors.response.use(
    response => {
        //如果reponse里面的status是200，说明访问到接口了，否则错误（Promise异步执行框架）
        if(response.status == 200){
            return Promise.resolve(response);// 程序继续执行
        }else{
            return Promise.reject(response);
        }
    },
    error => {
        if(error.response.status){
            switch(error.response.status){
                case 401:       //未登录
                    router.replace({
                        path:'/',
                        query:{
                            redirect: router.currentRoute.fullPath//把当前地址存了一下
                        }
                    });
                    break;
                case 404:   //没找到
                    break;
            }
            return Promise.reject(error.response);//返回错误信息
        }
    }
);

/**
 * 封装get方法（参数&拼接）
 */
export function get(url,params={}){

    return new Promise((resolve,reject) => {//new Promise异步访问
        axios.get(url,{params:params})
        .then(response =>{
            resolve(response.data);
        })
        .catch(err =>{
            reject(err);
        })
    });
    
}

/**
 * 封装post方法（表单提交）
 */
export function post(url,data={}){
    return new Promise((resolve,reject) => {
        axios.post(url,data)
        .then(response =>{
            resolve(response.data);
        })
        .catch(err =>{
            reject(err);
        })
    });
}