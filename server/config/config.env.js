var configEnv;
try{
	configEnv = require('./config.env');
} catch(e) {
	configEnv = {};
}
module.exports = function(){
	if(isEmpty(configEnv)){
		return {
			'googleAuth' : {
			    'clientID'         : '',
			    'clientSecret'     : '',
			    'callbackURL'      : 'https://localhost/auth/google/callback'
			},
			'databaseURL' : 'mongodb://localhost:27017/quindar'
        };
	} else {
		if(process.env.NODE_ENV) {
			return {
            	'googleAuth' : {
			        'clientID'         : configEnv[process.env.NODE_ENV].googleAuth.clientID,
			        'clientSecret'     : configEnv[process.env.NODE_ENV].googleAuth.clientSecret,
			        'callbackURL'      : configEnv[process.env.NODE_ENV].googleAuth.callbackURL
			    },
			    'databaseURL' : configEnv[process.env.NODE_ENV].databaseURL
            };
		} else {
			return {
            	'googleAuth' : {
			        'clientID'         : configEnv.development.googleAuth.clientID,
			        'clientSecret'     : configEnv.development.googleAuth.clientSecret,
			        'callbackURL'      : configEnv.development.googleAuth.callbackURL
			    },
			    'databaseURL' : configEnv.development.databaseURL
            };
		}

	}
    // switch(process.env.NODE_ENV){
    //     case 'staging':
    //         return {
    //         	'googleAuth' : {
			 //        'clientID'         : configEnv.staging.googleAuth.clientID || '',
			 //        'clientSecret'     : configEnv.staging.googleAuth.clientSecret || '',
			 //        'callbackURL'      : configEnv.staging.googleAuth.callbackURL || ''
			 //    },
			 //    'databaseURL' : configEnv.staging.databaseURL || ''
    //         };

    //     case 'production':
    //         return {
    //         	'googleAuth' : {
			 //        'clientID'         : '',
			 //        'clientSecret'     : '',
			 //        'callbackURL'      : ''
			 //    },
			 //    'databaseURL' : ''
    //         };

    //     default:
    //         return {
    //         	'googleAuth' : {
			 //        'clientID'         : configEnv.local.googleAuth.clientID || '',
			 //        'clientSecret'     : configEnv.local.googleAuth.clientSecret || '',
			 //        'callbackURL'      : configEnv.local.googleAuth.callbackURL || ''
			 //    },
			 //    'databaseURL' : configEnv.local.databaseURL || ''
    //         };
    // }
};

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}