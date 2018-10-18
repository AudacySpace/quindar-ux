// Grab the config env file if it's there
var config;

try{
	config = require('./config.env');
} catch(e) {
	config = {};
}

module.exports = function(){
	if(isEmpty(config)){
		//default values if configuration not present
		return {
			'googleAuth' : {
			    'clientID'         : '',
			    'clientSecret'     : '',
			    'callbackURL'      : ''
			},
			'databaseURL' : 'mongodb://localhost:27017/quindar',
			'databaseOpts' : { useMongoClient : true }
        };
	} else {
		//values of NODE_ENV - 'staging', 'production', 'development'
		if(process.env.NODE_ENV) {
			return {
            	'googleAuth' : {
			        'clientID'         : config[process.env.NODE_ENV].googleAuth.clientID,
			        'clientSecret'     : config[process.env.NODE_ENV].googleAuth.clientSecret,
			        'callbackURL'      : config[process.env.NODE_ENV].googleAuth.callbackURL
			    },
			    'databaseURL' : config[process.env.NODE_ENV].databaseURL,
			    'databaseOpts' : config[process.env.NODE_ENV].databaseOpts
            };
		} else { //return values for development environment in case NODE_ENV not set
			return {
            	'googleAuth' : {
			        'clientID'         : config.development.googleAuth.clientID,
			        'clientSecret'     : config.development.googleAuth.clientSecret,
			        'callbackURL'      : config.development.googleAuth.callbackURL
			    },
			    'databaseURL' : config.development.databaseURL,
			    'databaseOpts' : config.development.databaseOpts
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
