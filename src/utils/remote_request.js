import axios from "axios";

let _remoteURL = "";

// 创建 axios 实例
const RemoteService = axios.create({
  // 在请求地址前面加上 baseURL
  baseURL: "",
  // 请求超时时间
  timeout: 5000,
});

// 请求拦截
RemoteService.interceptors.request.use(
  (config) => {
    config.baseURL = _remoteURL;
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
    return response;
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

//动态设置远程资源URL
function setServiceURL(remoteURL) {
  _remoteURL = remoteURL;
}

export default { RemoteService, setServiceURL };
