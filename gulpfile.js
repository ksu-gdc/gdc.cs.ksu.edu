// gulp modules
const gulp = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const data = require('gulp-data');
const mergeJson = require('gulp-merge-json');
const nunjucksRender = require('gulp-nunjucks-render');

// other modules
const browserSync = require('browser-sync').create();

const appSettings = require('./app-settings.json');
const buildDir = appSettings.buildConfig.buildDir;
const assetsDir = `${buildDir}/${appSettings._paths.assets}`;
const stylesDir = `${buildDir}/${appSettings._paths.styles}`;
const scriptsDir = `${buildDir}/${appSettings._paths.scripts}`;
const imagesDir = `${buildDir}/${appSettings._paths.images}`;

const cleanBuildData = function() {
	return gulp
		.src(`${buildDir}/data.json`, { allowEmpty: true, read: false })
		.pipe(clean());
};
const cleanBuild = function() {
	return gulp.src(buildDir, { allowEmpty: true, read: false }).pipe(clean());
};

const buildAssets = gulp.parallel(
	function() {
		return gulp
			.src('./src/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
			.pipe(gulp.dest(imagesDir));
	},
	function() {
		return gulp.src('./src/assets/**/*.ico').pipe(gulp.dest(assetsDir));
	}
);
const buildStyles = function() {
	return gulp
		.src('./src/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.src('./src/styles/**/*.css'))
		.pipe(gulp.dest(stylesDir));
};
const buildScripts = function() {
	return gulp.src('./src/scripts/**/*.js').pipe(gulp.dest(scriptsDir));
};
const buildData = function() {
	return gulp
		.src(['./app-settings.json', './src/**/*.json'])
		.pipe(
			mergeJson({
				fileName: 'data.json'
			})
		)
		.pipe(gulp.dest(buildDir));
};
const buildHtml = function() {
	return gulp
		.src('./src/pages/**/*.+(html|njk)')
		.pipe(
			data(function() {
				return require(`${buildDir}/data.json`);
			})
		)
		.pipe(
			nunjucksRender({
				path: ['./src/templates']
			})
		)
		.pipe(gulp.dest(buildDir));
};
const build = gulp.series(
	cleanBuild,
	gulp.parallel(
		buildAssets,
		buildStyles,
		buildScripts,
		gulp.series(buildData, buildHtml)
	),
	cleanBuildData
);

module.exports = {
	clean: cleanBuild,
	build: build,
	serve: gulp.series(build, function() {
		const serveConfig = appSettings.serveConfig;
		browserSync.init({
			ui: serveConfig.ui.allow
				? {
						port: serveConfig.ui.port
				  }
				: false,
			server: {
				baseDir: buildDir
			},
			port: serveConfig.server.port,
			reloadDelay: 2000,
			logLevel: 'debug'
		});
		gulp.watch(
			'./src/**/*',
			gulp.series(build, function(done) {
				browserSync.reload();
				done();
			})
		);
	})
};
