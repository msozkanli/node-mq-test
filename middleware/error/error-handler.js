let ErrorHandler = function (err, req, res, next) {
    console.log(err.stack);
    res.status(500);

    if (Array.isArray(err)) {
        res.locals.error = err;
    } else {
        res.locals.error = [{msg: err.message}]
    }


    next();
};

module.exports = ErrorHandler;