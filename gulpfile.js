var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var ttf2woff2 = require('gulp-ttf2woff2');

var rename = require('gulp-rename');
const minify = require('gulp-minify');
var uglify = require('gulp-uglify');

gulp.task('pack-dashboard-css', function () {	
	return gulp.src([
        'public/css/bootstrap-min.css',
        'public/css/font-awesome.min.css',
        'public/css/dashboardstyles.css',
        'app/directives/line/line.css',
        'app/directives/datatable/datatable.css',
        'app/directives/satellite/satellite.css',
        'public/css/datetimepicker.css',
        'public/css/paneliconstyles.css',
        'app/directives/groundtrack/groundtrack.css',
        'app/directives/clock/clock.css',
        'app/directives/datalog/datalog.css',
        'app/components/deleteMenu/delete.css',
        'app/directives/alarmpanel/alarmpanel.css',
        'app/directives/systemmap/systemmap.css',
        'app/directives/command/command.css',
        'public/css/vis.min.css',
        'app/directives/timeline/timeline.css',
        'public/css/ng-sortable.min.css',
        'public/css/ng-sortable.style.min.css',
        'public/css/dygraph.min.css',
        'public/css/select.min.css',
        'public/css/gridster/angular-gridster.min.css',
        'public/css/gridster/grid.css'
    ])
	.pipe(concat('dashboard.css'))
	.pipe(cleanCss())
	.pipe(gulp.dest('public/build/css'));
});

gulp.task('pack-fonts', function () {	
	return gulp.src(['public/fonts/fontawesome-webfont.ttf','public/fonts/glyphicons-halflings-regular.ttf'])
		.pipe(ttf2woff2())
		.pipe(gulp.dest('public/build/fonts/'));
});

gulp.task('pack-services', function() {
    return  gulp.src([
      	'!app/services/*.spec.js',
      	'app/services/*.js'
    ])
    .pipe(concat('appServices.js'))
    .pipe(gulp.dest('public/build/services'))
    .pipe(rename('appServices.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/build/services'));
});

gulp.task('pack-directiveControllers', function() {
    return  gulp.src([
      	'!app/directives/**/*.spec.js',
      	'app/directives/**/*.js'
    ])
    .pipe(concat('appDirectiveControllers.js'))
    .pipe(gulp.dest('public/build/directives'))
    .pipe(rename('appDirectiveControllers.min.js'))
   	.pipe(minify())
    .pipe(gulp.dest('public/build/directives'));
});

gulp.task('pack-componentControllers', function() {
    return  gulp.src([
      	'!app/components/**/*.spec.js',
      	'app/components/**/*.js'
    ])
    .pipe(concat('appComponentControllers.js'))
    .pipe(gulp.dest('public/build/components'))
    .pipe(rename('appComponentControllers.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/build/components'));
});

gulp.task('pack-vendorJS', function() {
    return  gulp.src([
        'public/scripts/jquery.js',
        'public/scripts/bootstrap.min.js',
        'public/scripts/angular-sanitize.min.js',
        'public/scripts/ui-bootstrap-tpls.js',
        'public/scripts/select.min.js',
        'public/scripts/gridster/angular-gridster.js',
        'public/scripts/angular-prompt.js',
        'public/scripts/angular-animate.min.js',
        'public/scripts/angular-aria.min.js',
        'public/scripts/angular-messages.min.js',
        'public/scripts/angular-material.min.js',
        'public/scripts/dygraph.min.js',
        'public/scripts/d3.min.js',
        'public/scripts/topojson-client.min.js',
        'public/scripts/moment.js',
        'public/scripts/moment-timezone-with-data-2012-2022.min.js',
        'public/scripts/datetimepicker.js',
        'public/scripts/datetimepicker.templates.js',
        'public/scripts/ngStorage.min.js',
        'public/scripts/angular-marked.min.js',
        'public/scripts/marked.js',
        'public/scripts/three.min.js',
        'public/scripts/AssimpJSONLoader.js',
        'public/scripts/OrbitControls.js',
        'public/scripts/vis.min.js',
        'public/scripts/angularjs-dropdown-multiselect.js',
        'public/scripts/ng-sortable.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/build/js'))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/build/js'));
});

gulp.task('pack-appJS', function() {
    return  gulp.src([
        '!app/services/*.spec.js',
        'app/services/*.js',
        '!app/directives/**/*.spec.js',
        'app/directives/**/*.js',
        '!app/components/**/*.spec.js',
        'app/components/**/*.js',
    ])
    .pipe(concat('appresources.js'))
    .pipe(gulp.dest('public/build/js'))
    .pipe(rename('appresources.min.js'))
    .pipe(minify())
    .pipe(gulp.dest('public/build/js'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('app/services/*.js', ['pack-services']);
    gulp.watch('app/directives/**/*.js', ['pack-directiveControllers']);
    gulp.watch('app/components/**/*.js', ['pack-componentControllers']);
    gulp.watch(['public/scripts/*.js','public/scripts/*.min.js'], ['pack-vendorJS']);
    gulp.watch('public/fonts/*.ttf', ['pack-fonts']);
    gulp.watch(['app/directives/**/*.css','app/components/**/*.css','public/css/*.css'], ['pack-dashboard-css']);
    gulp.watch(['app/services/*.js','app/directives/**/*.js','app/components/**/*.js'], ['pack-appJS']);
});


gulp.task('default',['pack-dashboard-css','pack-fonts','pack-services','pack-directiveControllers','pack-componentControllers','pack-vendorJS','pack-appJS','watch']);