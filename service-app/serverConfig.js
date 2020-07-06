exports.serverPort = 9000;

exports.apiKey = 'CAS-API-KEY-b904-47d3';

exports.dbURL = 'mongodb+srv://cas_user:mongo123@cluster0.i5f34.mongodb.net/CASdb?retryWrites=true&w=majority';

exports.jwtPrvtKey = 'CAS-JWT-SECRET-KEY'; // Key to encrypt JWT token

// Email parameters
exports.postmarkKey = '1c2f0ba7-b904-47d3-b567-f3ed18679c6a';
exports.fromEmail = 'x19192304@student.ncirl.ie';

//Facebook API Parameters
exports.fbAppId = '2731754247049365';
exports.fbAppSecretKey = '2590cf38f8f7bce38c79f2f282bc3f1f';
exports.fbAppCallbackURL = 'http://localhost:9000/auth/facebook/callback';
