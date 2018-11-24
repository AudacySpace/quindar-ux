module.exports = {
    apps : [{
        name : 'quindar',
        script : './index.js',
        watch : true,
        log_date_format : "YYYY-MM-DD HH:mm:ss Z",
        env : {
            NODE_ENV : 'development'
        },
        env_production : {
            NODE_ENV : 'production'
        },
        env_staging : {
            NODE_ENV : 'staging'
        }
    }]
};
