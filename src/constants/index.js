export const PARA_KEY =
  "TlKCoqpb8YEqFwqmep6YwIvRikETkcbL9RBurRBCopJLKFMcwIrF3M9FF7L0hb9u";

export const ResponseCode = {
  SUCCESS: 200,
  TOKEN_STATUS_ERROR: 401,
  AUTH_ERR: 400000, //令牌为空或已失效
  UNAUTHORIZED: 400001, //unauthorized
  TOKEN_EXPIRED: 400002, //token is expired
  TOKEN_INVALID: 400003, //token is invalid
  AUTH_DENY: 400004, //权限不足
  BAD_REQUEST: 500000,
  SERVER_ERROR: 500001,
  BIND_ERROR: 500002, //参数异常
  DEL_ACTION_FAIL: 500003,
  DEL_ACTION_SUCCESS: 500004,
  UPDATE_ACTION_FAIL: 500005,
  UPDATE_ACTION_SUCCESS: 500006
};

export const defaultAvatar =
  "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1618065806,14298536&fm=26&gp=0.jpg";
