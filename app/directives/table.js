app
.directive('tabletext', function() { 
    return { 
        restrict: 'E', 
        scope: {}, 
        template: 
        	'<table class="table table-hover">\
                <thead>\
                    <tr>\
                        <th>Category</th>\
                        <th>Name</th>\
                        <th>Value</th>\
                        <th>Time</th>\
                    </tr>\
                </thead>\
                <tbody>\
                      <tr>\
                           <td>1</td>\
                           <td>2</td>\
                           <td>3</td>\
                           <td>4</td>\
                      </tr>\
                </tbody>\
            </table>' ,
        link: function(scope, element, attrs) { 
        }
    }; 
})
