// Har API response isi format me jayega — frontend ke liye predictable structure

export const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

export const sendSuccess = (res, message, data = null, meta = null) =>
  sendResponse(res, 200, true, message, data, meta);

export const sendCreated = (res, message, data = null) =>
  sendResponse(res, 201, true, message, data);
