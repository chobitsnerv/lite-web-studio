import axios from "axios";

let _remoteURL = "";
let _responseType = "";

// 创建 axios 实例
const RemoteService = axios.create({
  // 在请求地址前面加上 baseURL
  baseURL: "",
  // 请求超时时间
  timeout: 30000,
  responseType: "",
});

const _httpCode = {
  //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
  400: "请求参数错误",
  401: "权限不足, 请重新登录",
  403: "服务器拒绝本次访问",
  404: "请求资源未找到",
  500: "内部服务器错误",
  501: "服务器不支持该请求中使用的方法",
  502: "网关错误",
  504: "网关超时",
};

// 请求拦截
RemoteService.interceptors.request.use(
  (config) => {
    config.baseURL = _remoteURL;
    config.responseType = _responseType;
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
RemoteService.interceptors.response.use(
  (response) => {
    // 响应成功
    if (response.status === 200) {
      return Promise.resolve(response.data);
    } else {
      ElMessage({
        message: response.data.message,
        type: "warning",
      });
      return Promise.reject(response.data.message);
    }
  },
  (error) => {
    // 处理响应错误
    if (error.response) {
      // 根据请求失败的http状态码去给用户相应的提示
      let tips =
        error.response.status in _httpCode
          ? _httpCode[error.response.status]
          : error.response.data.message;
      ElMessage({
        message: tips,
        type: "warning",
      });
      return Promise.reject(error);
    } else {
      ElMessage({
        message: "请求超时, 请刷新重试",
        type: "error",
      });
      return Promise.reject("请求超时, 请刷新重试");
    }
  }
);

//动态设置远程资源URL
function setServicePara(remoteURL, type) {
  _remoteURL = remoteURL;
  _responseType = type;
}

export default { RemoteService, setServicePara };
