import RemoteService from "utils/remote_request.js";

export const getAudio = (params) => {
  RemoteService.setServiceURL(params);
  return RemoteService.RemoteService({
    method: "get",
    headers: {},
  });
};
