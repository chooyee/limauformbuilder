const { src, dest } = require('gulp');
const concat = require('gulp-concat');
var minify = require('gulp-minify');

const jsBundleCom = () =>
  src([
    'src/js/components/base.js',
    'src/js/components/button.js',
    'src/js/components/cardImage.js',
    'src/js/components/checkbox.js',
    'src/js/components/column.js',
    'src/js/components/dateTimeInput.js',
    'src/js/components/header.js',
    'src/js/components/imageProcessor.js',
    'src/js/components/imageUpload.js',
    'src/js/components/number.js',
    'src/js/components/occupation.js',
    'src/js/components/password.js',
    'src/js/components/radio.js',
    'src/js/components/select.js',
    'src/js/components/text.js',
    'src/js/components/textarea.js',
    'src/js/components/textbox.js',
  ])
    .pipe(concat('components.js'))
    .pipe(dest('public/dist/js'));

const jsBundleHome = () =>
  src([
    'src/js/home/main.js',    
  ])
    .pipe(concat('main.js'))
    .pipe(minify())
    .pipe(dest('public/dist/js'));

const jsBundleForm = () =>
    src([
      'src/js/form/render.js',
      'src/js/form/formmain.js',    
    ])
      .pipe(concat('form.js'))
      .pipe(minify())
      .pipe(dest('public/dist/js'));


const jsBundle = ()=>
    jsBundleCom();
    jsBundleHome();
    jsBundleForm();


exports.jsBundle = jsBundle;