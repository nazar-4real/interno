const { src, dest, watch, parallel, series } = require('gulp');

const browserSync = require('browser-sync').create();
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');
const nunjucksRender = require('gulp-nunjucks-render');
const formatHtml = require('gulp-format-html');

const htmlRender = () => {
  return src([
    'app/pages/*.html',
    'app/**/[^_]*.html',
  ], {
    ignore: [
      'app/pages/template.html',
      'app/templates/**/*'
    ]
  })
    .pipe(nunjucksRender({
      path: 'app/',
      inheritExtension: true,
      envOptions: {
        trimBlocks: true,
        lstripBlocks: true,
        noCache: true
      }
    }))
    .pipe(formatHtml({
      "preserve_newlines": false,
    }))
    .pipe(dest('build/'))
    .pipe(browserSync.stream())
}

const styles = minify => {
  return src('app/scss/[^_]*.scss', {
    sourcemaps: true
  })
    .pipe(scss({
      outputStyle: `${minify}`
    })
      .on('error', scss.logError)
    )
    .pipe(autoprefixer({
      overrideBrowsersList: ['last 10 versions']
    }))
    .pipe(dest('app/css', {
      sourcemaps: true
    }))
    .pipe(browserSync.stream())
}

const stylesDev = () => {
  return styles('expanded');
}

const stylesProd = () => {
  return styles('compressed');
}

const scripts = () => {
  return src([
    'node_modules/gsap/dist/gsap.min.js',
    'node_modules/gsap/dist/ScrollTrigger.min.js',
    'node_modules/mixitup/dist/mixitup.min.js',
    'app/js/script.js'
  ], {
    sourcemaps: true
  })
    .pipe(concat('script.min.js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(dest('app/js', {
      sourcemaps: true
    }))
    .pipe(browserSync.stream())
}

const images = () => {
  return src('app/images/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIds: false }
        ]
      })
    ]))
    .pipe(dest('build/images'))
}

const build = () => {
  return src([
    'app/*.html',
    'app/css/*.css',
    'app/js/script.min.js',
    'app/fonts/**/*'
  ], { base: 'app' })
    .pipe(dest('build'))
}

const cleanBuild = () => {
  return del('build', { force: true })
}

const watchFiles = () => {
  browserSync.init({
    server: ['build/', 'app/'],
    notify: false,
    ghostMode: false,
    files: [
      'app/**/*',
      'build/**/*'
    ]
  });

  watch('app/**/*.html', htmlRender);
  watch('app/scss/**/*.scss', stylesDev);
  watch(['app/js/**/*.js', '!app/js/script.min.js'], scripts);
}

exports.htmlRender = htmlRender;
exports.stylesDev = stylesDev;
exports.stylesProd = stylesProd;
exports.scripts = scripts;
exports.images = images;
exports.watchFiles = watchFiles;
exports.cleanBuild = cleanBuild;

exports.build = series(cleanBuild, stylesProd, scripts, images, build, htmlRender);
exports.default = parallel(series(cleanBuild, htmlRender, watchFiles), stylesDev, scripts);