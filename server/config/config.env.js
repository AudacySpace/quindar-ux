var configEnv;
try{
	configEnv = require('./config.env');
} catch(e) {
	configEnv = {};
}
module.exports = function(){
	if(isEmpty(configEnv)){
		//default values if configuration not present
		return {
			'googleAuth' : {
			    'clientID'         : '',
			    'clientSecret'     : '',
			    'callbackURL'      : ''
			},
			'databaseURL' : 'mongodb://localhost:27017/quindar'
        };
	} else {
		//values of NODE_ENV - 'staging', 'production', 'development'
		if(process.env.NODE_ENV) {
			return {
            	'googleAuth' : {
			        'clientID'         : configEnv[process.env.NODE_ENV].googleAuth.clientID,
			        'clientSecret'     : configEnv[process.env.NODE_ENV].googleAuth.clientSecret,
			        'callbackURL'      : configEnv[process.env.NODE_ENV].googleAuth.callbackURL
			    },
			    'databaseURL' : configEnv[process.env.NODE_ENV].databaseURL
            };
		} else { //return values for development environment in case NODE_ENV not set
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
};

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
