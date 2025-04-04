const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (process.env.NODE_ENV === 'development') {
    console.log('Error Middleware Message :'.bgBrightRed, err);
  }

  if (err.name == 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource Not Found';
  }

  res.status(statusCode).json({
    message,
  })
}

export { errorHandler };