/**
 * Created by shalini on 10/25/16.
 */

module.exports = function(app) {

    app.get('/image', function(req,res){

            res.status(200).json({  'imageName':'Jupiter South Pole from Juno' ,
             'imageURL': 'http://apod.nasa.gov/apod/image/1610/Jupiter1_Juno_960.jpg'}); 
    });


};





