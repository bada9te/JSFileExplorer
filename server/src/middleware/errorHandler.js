const errorHandler = (err, req, res, next) => {
    const eStatus = err.status || 500;
    const eMsg = err.message || "Sth went wrong";

    console.error(eMsg);

    res.status(eStatus).json({
        done: false,
        error: eMsg,
        stack: process.env.NODE_ENV_TYPE === 'development' ? err.stack : null,
    });

    next();
}

module.exports = errorHandler;
