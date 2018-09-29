var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var ttf2woff2 = require('gulp-ttf2woff2');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence');

gulp.task('build-dashboard-css', function () {	
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
    .pipe(sourcemaps.init({loadMaps: true}))
	.pipe(concat('dashboard.css'))
	.pipe(cleanCss())
	.pipe(gulp.dest('public/build/css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/build/css'));
});

gulp.task('build-fonts', function () {	
	return gulp.src(['public/fonts/fontawesome-webfont.ttf','public/fonts/glyphicons-halflings-regular.ttf'])
		.pipe(ttf2woff2())
		.pipe(gulp.dest('public/build/fonts/'));
});

gulp.task('build-vendorJS', function() {
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
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/build/js'))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/build/js'));
});

gulp.task('build-appJS', function() {
    return  gulp.src([
        '!app/services/*.spec.js',
        'app/services/*.js',
        '!app/directives/**/*.spec.js',
        'app/directives/**/*.js',
        '!app/components/**/*.spec.js',
        'app/components/**/*.js',
    ])
    .pipe(concat('appresources.js'))
    .pipe(gulp.dest('public/build/js'));
});

gulp.task('clean-build', function () {
  return gulp.src('public/build', {read: false})
    .pipe(clean());
});

gulp.task('default', gulpSequence('clean-build',['build-fonts','build-dashboard-css','build-vendorJS','build-appJS']));
