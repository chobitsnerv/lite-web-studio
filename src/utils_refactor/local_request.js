import axios from "axios";

// 创建 axios 实例
const LocalService = axios.create({
  // 在请求地址前面加上 baseURL
  baseURL: import.meta.env.BASE_URL,
  // 请求超时时间
  timeout: 30000,
});

// 请求拦截
LocalService.interceptors.request.use(
  (config) => {
    // 在请求前做某些事情
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
LocalService.interceptors.response.use(
  (response) => {
    // 响应成功
    return response.data;
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default LocalService;
