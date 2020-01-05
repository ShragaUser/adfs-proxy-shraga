const trycatch = (func, handleError = (err) => console.error(err)) => async (...args) => {
    const result = { result: null, error: null };
    try {
        result.result = await func(...args);
    } catch (err) {
        result.error = err;
        await handleError(err);
    }
    return result;
}


module.exports = { trycatch };