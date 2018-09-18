module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'staging':
            return {
            	'googleAuth' : {
			        'clientID'         : '6076920577-0uon1h086qbampdlt3e01dg8v1u1ab2h.apps.googleusercontent.com',
			        'clientSecret'     : 'VtaXQlwXdZZ3_rj7eS18o-II',
			        'callbackURL'      : 'https://quindar.space/auth/google/callback'
			    },
			    'databaseURL' : 'mongodb://54.184.232.90:27017/quindar'
            };

        case 'production':
            return {
            	'googleAuth' : {
			        'clientID'         : '',
			        'clientSecret'     : '',
			        'callbackURL'      : ''
			    },
			    'databaseURL' : ''
            };

        default:
            return {
            	'googleAuth' : {
			        'clientID'         : '6076920577-0uon1h086qbampdlt3e01dg8v1u1ab2h.apps.googleusercontent.com',
			        'clientSecret'     : 'VtaXQlwXdZZ3_rj7eS18o-II',
			        'callbackURL'      : 'https://localhost/auth/google/callback'
			    },
			    'databaseURL' : 'mongodb://54.184.232.90:27017/quindar'
            };
    }
};