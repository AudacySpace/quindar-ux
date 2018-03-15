var mongoose = require('mongoose');
var ProxyStatus = mongoose.model('status');

module.exports = {
  getCurrentStatus: function(req, res){
        ProxyStatus.findOne({},{ '_id': 0 ,'__v':0}).sort({_id:-1}).exec(function(err,doc){
            if(err){
                console.log(err);
            }
            res.send(doc);
        });
    }
};
