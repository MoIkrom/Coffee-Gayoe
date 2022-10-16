module.exports = {
  successResponse: (res, status, data, meta) => {
    res.status(status).json({
      err: null,
      data,
      meta,
    });
  },

  errorResponse: (res, status, err) => {
    res.status(status).json({
      data: [],
      err,
    });
  },
};
