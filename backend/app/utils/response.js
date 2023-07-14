const badResponse = (statusCode, message, error = null) => {
  const response = {
    status: statusCode,
    message,
  };

  if (error) {
    response.error = error;
  }

  return response;
};

const successResponse = (statusCode, message, data) => {
  if (data) {
    return {
      status: statusCode,
      message,
      data,
    };
  }
  return {
    status: statusCode,
    message,
  };
};

export { badResponse, successResponse };
