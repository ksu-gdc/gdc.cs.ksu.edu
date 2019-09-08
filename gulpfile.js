// gulp modules
const gulp = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const data = require('gulp-data');
const mergeJson = require('gulp-merge-json');
const nunjucksRender = require('gulp-nunjucks-render');
const stripComments = require('gulp-strip-comments');
const minify = require('gulp-minifier');

// other modules
const browserSync = require('browser-sync').create();

const config = require('./_config.json')._config;
const buildDir = config.build.path;
const assetsDir = `${buildDir}/${config.site.paths.assets}`;
const stylesDir = `${buildDir}/${config.site.paths.styles}`;
const scriptsDir = `${buildDir}/${config.site.paths.scripts}`;
const imagesDir = `${buildDir}/${config.site.paths.images}`;

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
		.pipe(stripComments.text({ ignore: /url\([\w\s:\/=\-\+;,]*\)/g }))
		.pipe(
			minify({
				minify: true,
				minifyCSS: true
			})
		)
		.pipe(gulp.dest(stylesDir));
};
const buildScripts = function() {
	return gulp
		.src('./src/scripts/**/*.js')
		.pipe(stripComments())
		.pipe(
			minify({
				minify: true,
				minifyJS: {
					sourceMap: false
				}
			})
		)
		.pipe(gulp.dest(scriptsDir));
};
const buildData = function() {
	return gulp
		.src(['./_config.json', './src/**/*.json'])
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
		.pipe(stripComments.html())
		.pipe(
			minify({
				minify: true,
				minifyHTML: {
					collapseWhitespace: true,
					conservativeCollapse: true
				}
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

let browserReloadTimeout;
module.exports = {
	clean: cleanBuild,
	build: build,
	serve: gulp.series(build, function() {
		browserSync.init({
			ui: config.serve.ui.allow
				? {
						port: config.serve.ui.port
				  }
				: false,
			server: {
				baseDir: buildDir
			},
			port: config.serve.server.port,
			reloadDelay: 2000,
			logLevel: 'debug'
		});
		function browserSyncReload(done) {
			browserSync.reload();
			done();
		}
		gulp.watch(
			'./src/styles/**/*.+(scss|css)',
			gulp.series(buildStyles, browserSyncReload)
		);
		gulp.watch(
			'./src/scripts/**/*.js',
			gulp.series(buildScripts, browserSyncReload)
		);
		gulp.watch(
			[
				'./_config.json',
				'./src/**/*.json',
				'./src/pages/**/*.+(html|njk)'
			],
			gulp.series(buildData, buildHtml, cleanBuildData, browserSyncReload)
		);
	})
};
