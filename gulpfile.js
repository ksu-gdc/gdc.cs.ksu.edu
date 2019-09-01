const { src, dest, series, parallel } = require('gulp');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const data = require('gulp-data');
const mergeJson = require('gulp-merge-json');
const nunjucksRender = require('gulp-nunjucks-render');

const appSettings = require('./app-settings.json');
const buildDir = './build';
const assetsDir = `${buildDir}/${appSettings._paths.assets}`;
const stylesDir = `${buildDir}/${appSettings._paths.styles}`;
const scriptsDir = `${buildDir}/${appSettings._paths.scripts}`;
const imagesDir = `${buildDir}/${appSettings._paths.images}`;

// cleaning
function cleanBuildData() {
	return src(`${buildDir}/data.json`, { allowEmpty: true, read: false }).pipe(
		clean()
	);
}
function cleanBuild() {
	return src(buildDir, { allowEmpty: true, read: false }).pipe(clean());
}

// moving/building assets
function buildAssets_Images() {
	return src('./src/assets/images/**/*.+(png|jpg|jpeg|gif|svg)').pipe(
		dest(imagesDir)
	);
}
function buildAssets_Favicons() {
	return src('./src/assets/**/*.ico').pipe(dest(assetsDir));
}

// moving/building styles
function buildStyles() {
	return src('./src/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(src('./src/styles/**/*.css'))
		.pipe(dest(stylesDir));
}

// moving/building scripts
function buildScripts() {
	return src('./src/scripts/**/*.js').pipe(dest(scriptsDir));
}

// moving/building data
function buildJsonData() {
	return src(['./app-settings.json', './src/**/*.json'])
		.pipe(
			mergeJson({
				fileName: 'data.json'
			})
		)
		.pipe(dest(buildDir));
}

// moving/building html
function buildHtml() {
	return src('./src/pages/**/*.+(html|njk)')
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
		.pipe(dest(buildDir));
}

// gulp commands
exports.build = series(
	cleanBuild,
	parallel(
		buildAssets_Images,
		buildAssets_Favicons,
		buildStyles,
		buildScripts,
		series(buildJsonData, buildHtml)
	),
	cleanBuildData
);
exports.clean = cleanBuild;
