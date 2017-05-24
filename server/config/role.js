//Define user roles
module.exports = {

    'roles' : {
	    'MD' : {
	    	'name' : 'Mission Director',
	    	'callsign' : 'MD',
	    	'multiple' : false
	    },
	    'CC' : {
	    	'name' : 'Spacecraft Communications Controller',
	    	'callsign' : 'CC',
	    	'multiple' : true
	    },
	    'SYS' : {
	    	'name' : 'Spacecraft Systems Controller',
	    	'callsign' : 'SYS',
	    	'multiple' : true
	    },
	    'GC' : {
	    	'name' : 'Ground Communications Controller',
	    	'callsign' : 'GC',
	    	'multiple' : true
	    },
	    'NAV' : {
	    	'name' : 'Navigation and Control Specialist',
	    	'callsign' : 'NAV',
	    	'multiple' : true
	    },
	    'IT' : {
	    	'name' : 'Information Technology Specialist',
	    	'callsign' : 'IT',
	    	'multiple' : true
	    },
	    'PROXY' : {
	    	'name' : 'Proxy Services and Encyption Specialist',
	    	'callsign' : 'PROXY',
	    	'multiple' : true
	    },
	    'SIM' : {
	    	'name' : 'Simulation Specialist',
	    	'callsign' : 'SIM',
	    	'multiple' : true
	    },
	    'VIP' : {
	    	'name' : 'Observer',
	    	'callsign' : 'VIP',
	    	'multiple' : true
	    }
	}
};