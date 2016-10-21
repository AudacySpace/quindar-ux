(function () {
    'use strict';
    var body = document.querySelector('body'),
        imageClasses = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'];
    try {
        body.classList.add(imageClasses[parseInt(Math.random() * imageClasses.length, 10)]);
    } catch(err) {
        body.className += imageClasses[0];
    }
}());