export const error = (reason, errorCode, errMsg) => ({
  result: 'error',
  reason,
  error: {
    errCode: errorCode,
    message: errMsg,
  },
});
