// Load plugins.
const _ = require('lodash');
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const cssnano = require('cssnano');
const del = require('del');
const fs = require('fs');
const ghpages = require('gh-pages');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const run = require('gulp-run');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const yaml = require('js-yaml');

// Configuration.
var config = {};
config.baseDirectory = 'components';
config.patternDirectory = config.baseDirectory + '/_patterns';
config.patternLab = {
  watchFiles: [
    config.patternDirectory + '/**/*.twig',
    config.patternDirectory + '/**/*.md',
    config.patternDirectory + '/**/*.yml',
    config.baseDirectory + '/_data/**/*.yml',
  ],
  publicDirectory: './pattern-lab/public/',
  ghData: 'components/_data/gh-data',
  swatches: [
    {
      src: 'components/_patterns/00-base/global/01-colors/_color-vars.scss',
      dest: 'components/_patterns/00-base/global/01-colors/colors.yml',
      lineStartsWith: '$',
      allowVarValues: false,
    },
  ],
};
config.sass = {
  srcFiles: config.patternDirectory + '/style.scss',
  watchFiles: [
    config.patternDirectory + '/style.scss',
    config.patternDirectory + '/**/*.scss',
  ],
  destDir: 'components/css',
};
config.js = {
  srcFiles: config.patternDirectory + '/**/*.js',
  watchFiles: [config.patternDirectory + '/**/*.js'],
  destDirPatterns: 'components/js/patterns',
  destDirOther: 'components/js/other',
};
config.npm = {
  srcFiles: './node_modules/',
};

// BrowserSync.
function browserSync(done) {
  browsersync.init({
    server: { baseDir: config.patternLab.publicDirectory },
  });
  done();
}

// BrowserSync Reload.
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Color swatches.
function swatches(done) {
  // TODO:
  done();
}

// CSS task.
function css(done) {
  return gulp
    .src(config.sass.srcFiles)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.sass.destDir))
    .pipe(browsersync.stream());
  done();
}

// JS task.
function js(done) {
  return (
    gulp
      .src([config.js.srcFiles])
      .pipe(plumber())
      // .pipe(uglify())
      .pipe(gulp.dest(config.js.destDirPatterns))
      .pipe(browsersync.stream())
  );
  done();
}

// Clean js assets.
function cleanJS(done) {
  return del([config.js.destDirPatterns]);
  done();
}

// Generate Pattern Lab task.
function plGenerate(done) {
  return run('php pattern-lab/core/console --generate').exec();
  done();
}

// Watch files.
function watchFiles() {
  gulp.watch(config.sass.watchFiles, gulp.series(css, plGenerate));
  gulp.watch(config.js.watchFiles, gulp.series(cleanJS, js, plGenerate));
  gulp.watch(
    config.patternLab.watchFiles,
    gulp.series(plGenerate, browserSyncReload),
  );
}

// Copy certain files from NPM to js directory.
function copyNPM(done) {
  gulp
    .src(config.npm.srcFiles + 'hoverintent/dist/hoverintent.min.js')
    .pipe(gulp.dest(config.js.destDirOther));
  done();
}

// Copy PL site files to build directory.
function copyBuild(done) {
  gulp
    .src(config.patternLab.publicDirectory + '/**/*')
    .pipe(gulp.dest('build'));
  done();
}

// Clear gh-pages cache.
function ghPagesCache(done) {
  return run('rm -rf node_modules/gh-pages/.cache').exec();
  done();
}

// Add _data for gh-pages.
function ghDataAdd(done) {
  gulp
    .src(['components/_data/data.yml'])
    .pipe(replace('base_path:', 'base_path: ../..'))
    .pipe(gulp.dest(config.patternLab.ghData));
  done();
}

// Remove _data for gh-pages.
function ghDataRemove(done) {
  return del([config.patternLab.ghData + '/*']);
  done();
}

// Publish compiled PL to gh-pages branch.
function ghPublish(done) {
  ghpages.publish(
    'build',
    {
      message: 'Publish gh-pages: auto-generated commit via gulp.',
    },
    function(err) {
      if (err === undefined) {
        console.log('PL successfully deployed to github!');
      } else {
        console.log(err);
      }
    },
  );
  done();
}

// Define grouped tasks.
const watch = gulp.parallel(watchFiles, browserSync);
const start = gulp.series(
  gulp.parallel(css, js),
  plGenerate,
  copyNPM,
  copyBuild,
  watch,
);
const buildPages = gulp.series(
  cleanJS,
  gulp.parallel(css, js),
  ghDataAdd,
  plGenerate,
  copyBuild,
);
const deployPages = gulp.series(
  ghPagesCache,
  buildPages,
  ghPublish,
  ghDataRemove,
);

// Exports.
exports.deployPages = deployPages;
exports.default = start;
