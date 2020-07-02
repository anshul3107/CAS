const sampleMethod = (req, res, next) => {
    console.log('req path params >> ', {...req.params});
    console.log('req query params >> ', {...req.query});
};

exports.sampleMethod = sampleMethod;
