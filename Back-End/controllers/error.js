exports.error404 = (req,res,next) =>{
    const status = error.statusCode||500;
    const data = error.data;
    const message = error.message;
res.status(status).json({
    message: message,
    data: data,
  });
}