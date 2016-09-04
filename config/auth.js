// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        // your App ID
        'clientID': '1035056279864779',
        // your App Secret
        'clientSecret': process.env.CLIENTSECRET,
        'callbackURL': 'http://mean268.herokuapp.com/auth/facebook/callback'
    },
    // 作業
    'googleAuth': {
        'clientID': 'your-secret-clientID-here',
        'clientSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    }

};