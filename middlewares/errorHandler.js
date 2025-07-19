import constants from "../constants.js";
const errorHandler = (err,req,res,next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500;
     switch (statusCode) {
    case constants.VALIDATION_ERROR :
      res.json({
        title: "Validation error",
        message: err.message,
        stackTrace: err.stack,
      });

      break;
    case constants.NOT_FOUND :
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
    break;
     case constants.UNAUTHORIZED:
      res.json({
        title: "unauthorized ",
        message: err.message,
        stackTrace: err.stack,
      });
    break;
     case constants.FORBIDDEN:
      res.json({
        title: "forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
    break;
    default:
        console.log("no error all good")
      break;
  }
}

export default errorHandler;