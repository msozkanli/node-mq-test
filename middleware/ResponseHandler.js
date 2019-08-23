let ResponseHandler = (req, res) => {
    if (res.locals.error) {

        let response = {
            status: 500,
            messages: res.locals.error,
            data: null
        };
        console.log(JSON.stringify(response));
        res.json(response);
    } else {
        let response=res.locals.data;
        console.log(JSON.stringify(response));
        res.json(response)
    }
};

module.exports = ResponseHandler;