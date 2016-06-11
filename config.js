var config = {
    uber: {
        client_id: 'client_id',
        client_secret: 'client_secret',
        server_token: 'server_token',
        redirect_uri: 'redirect_uri',
        name: 'Pley-Rebu',
        language: 'en_US', // optional, defaults to en_US
        sandbox: true // optional, defaults to false
    },
    yelp: {
        consumer_key: 'consumer_key',
        consumer_secret: 'very very secret',
        token: 'token',
        token_secret: 'token_secret'
    }

};

config.mongoUri = 'mongodb://localhost:27017/pr';
//max session time out for remembered users

config.cookieMaxAge = 30 * 24 * 3600 * 2000;

module.exports = config;