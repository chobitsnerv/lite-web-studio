import LocalService from "utils/local_request.js";

export const getDataSheets = (params) => {
  return LocalService({
    url: "/datasheets/" + params,
    method: "get",
    headers: {
      "Content-Type": "text/csv",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
};
