// config/auth.js
// when committing change callbackURL      : 'https://quindar.space/auth/google/callback'
// when working locally change callbackURL  : 'https://localhost/auth/google/callback'

// expose our config directly to our application using module.exports
module.exports = {

    'googleAuth' : {
        'clientID'         : '6076920577-0uon1h086qbampdlt3e01dg8v1u1ab2h.apps.googleusercontent.com',
        'clientSecret'     : 'VtaXQlwXdZZ3_rj7eS18o-II',
        'callbackURL'      : 'https://localhost/auth/google/callback'
    }

};
