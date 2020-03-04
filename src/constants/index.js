export const PARA_KEY =
  "TlKCoqpb8YEqFwqmep6YwIvRikETkcbL9RBurRBCopJLKFMcwIrF3M9FF7L0hb9u";

export const ResponseCode = {
 "SUCCESS":200,
 "AUTH_ERR":400000,  //令牌为空或已失效
 "UNAUTHORIZED":400001,  //unauthorized
 "TOKEN_EXPIRED":400002,  //token is expired
 "TOKEN_INVALID":400003,  //token is invalid
 "AUTH_DENY":400004, //权限不足
 "BAD_REQUEST":500000,
 "SERVER_ERROR":500001,
 "BIND_ERROR":500002, //参数异常
}
