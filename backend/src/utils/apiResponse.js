/**
 * Standardized API response helpers
 */
export function success(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

export function paginated(res, data, pagination, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
}

export function error(res, message = 'Internal server error', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}
