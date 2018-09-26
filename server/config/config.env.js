var configEnv;
try{
	configEnv = require('./config.env');
} catch(e) {
	configEnv = {};
}
module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'staging':
            return {
            	'googleAuth' : {
			        'clientID'         : configEnv.staging.googleAuth.clientID || '',
			        'clientSecret'     : configEnv.staging.googleAuth.clientSecret || '',
			        'callbackURL'      : configEnv.staging.googleAuth.callbackURL || ''
			    },
			    'databaseURL' : configEnv.staging.databaseURL || ''
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
			        'clientID'         : configEnv.local.googleAuth.clientID || '',
			        'clientSecret'     : configEnv.local.googleAuth.clientSecret || '',
			        'callbackURL'      : configEnv.local.googleAuth.callbackURL || ''
			    },
			    'databaseURL' : configEnv.local.databaseURL || ''
            };
    }
};