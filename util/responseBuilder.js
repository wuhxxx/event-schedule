// Construct JSON api response message according to google JSON style guide

const successResponse = data => {
    const response = {};
    response.data = data;
    return response;
};

const errorResponse = (code, name, message) => {
    const response = {};
    response.error = { code, name, message };
    return response;
};

module.exports = {
    successResponse: successResponse,
    errorResponse: errorResponse
};
