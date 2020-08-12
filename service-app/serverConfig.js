exports.serverPort = 9000;

exports.apiKey = 'CAS-API-KEY-b904-47d3';

exports.dbURL = 'mongodb+srv://cas_user:mongo123@cluster0.i5f34.mongodb.net/CASTestdb?retryWrites=true&w=majority';

exports.jwtPrvtKey = 'CAS-JWT-SECRET-KEY'; // Key to encrypt JWT token

// Email parameters
exports.sgKey = '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';
exports.fromEmail = 'x19192304@student.ncirl.ie';

//Google Distance Matrix API
exports.distMatrixAPIKey = 'AIzaSyDVP6kYppzzGl2Ht2YSv1SBkBulY6fAhMM';
exports.distMatrixEndpoint = 'https://maps.googleapis.com/maps/api/distancematrix/json';

//Facebook API Parameters
exports.fbAppId = '2731754247049365';
exports.fbAppSecretKey = '2590cf38f8f7bce38c79f2f282bc3f1f';
exports.fbAppCallbackURL = 'http://localhost:9000/auth/facebook/callback';

// exports.clientAppURL = 'http://localhost:3000';
exports.clientAppURL = 'http://54.157.170.56:3000';

exports.sqsQueueUrl = 'https://sqs.us-east-1.amazonaws.com/076411644770/CASAppQueue.fifo';
