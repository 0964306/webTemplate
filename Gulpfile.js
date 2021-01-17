/** Lan Party Webpage
 * 
 * This is a website for a lanparty. A site you find all the games.
 *
 * @author     Mats van Reenen <mail@matsvanreenen.nl>
 * @copyright  Copyright (c) 2021 Mats van Reenen <mail@matsvanreenen.nl>
 * @license    http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version    1.0 Beta
 */

const through = require('through2');
const ejs     = require('ejs');

// gulp
const Gulp    = require('gulp');
Gulp.clean    = require('gulp-clean');
Gulp.sass     = require('gulp-sass');
Gulp.markdown = require('gulp-markdown');
Gulp.cleanCSS = require('gulp-clean-css');
Gulp.uglify   = require('gulp-uglify');
Gulp.htmlMin  = require('gulp-htmlmin');

// for webserver
const fs      = require('fs');
const http    = require('http');


const PORT = 3000; // the port to run the webserver

/** httpd()
 * a test server. it will run a simple webserver on the specifyed port.
 */
function httpd(){
  function mime(ext){
    const mimeTypes = {
      js: 'text/javascript',
      css: 'text/css',
      html: 'text/html',
      svg: 'image/svg',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    }
    if(mimeTypes.hasOwnProperty(ext.toLowerCase())){
      return mimeTypes[ext];
    }else{
      return 'application/octet-stream'
    }
  }

  function servePage(req, res, url){
    if(url[url.length - 1] == '/'){
      return servePage(req, res, url + 'index.html')
    }
    var ext = url.split('.');
    ext = ext[ext.length-1];
    if(ext.length > 4){
      return servePage(req, res, url + '/index.html')
    }
    res.setHeader('Content-Type', mime(ext))
    fs.readFile(__dirname + '/app' + url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }
  http.createServer(function (req, res) {
    servePage(req, res, req.url)
  }).listen(PORT);
}

/** css()
 * compiles sass to css.
 * 
 * @param {bool} minify choos whather you want the css to be minifyed or not.
 */
function css(minify = false){
  return function buildCSS(){
    let ret = Gulp.src('src/styles/**/*.scss')
        .pipe(Gulp.sass().on('error', Gulp.sass.logError))
    if(minify){
      ret = ret.pipe(Gulp.cleanCSS({debug: true}))
    }
    return ret.pipe(Gulp.dest('app/styles'));
  }
}

/** js()
 * for now it only moves the js file from src to the app folder.
 * 
 * @param {bool} minify choos whather you want the js to be minifyed and uglifyed or not.
 */
function js(minify = true){
  return function buildJS(){
    var ret = Gulp.src('src/scripts/**/*.js')
    if(minify)
      ret = ret.pipe(Gulp.uglify())
    return ret.pipe(Gulp.dest('app/scripts'));
  }
}

//TODO: write custom md compiler to allow setting link wat template to use
/** md()
 * compiles the markdown to html and inserts it into _template.ejs.
 * 
 * @param {bool} minify choos whather you want the html to be minifyed or not.
 */
function md(minify = true){
  return function buildMD(){
    var ret = Gulp.src('src/**/*.md')
        .pipe(Gulp.markdown())
        .pipe(through.obj(async function buildEJS_be(file, enc, cb){
          try{
            const data = {
              "body": file.contents.toString()
            }
            const contents = await ejs.renderFile("./src/_tempate.ejs", data, { root: __dirname + "/src"});
            file.contents = Buffer.from(contents);
            file.extname = '.html';
            cb(null, file);
          }catch(e){
            console.error('Some error occeer at building EJS');
            console.error(e);
            cb('Some error occerd at building EJS');
          }
        }))
    if(minify)
      ret = ret.pipe(Gulp.htmlMin({
        collapseWhitespace: true
      }));
    return ret.pipe(Gulp.dest('app'));
  }
}

/** assets()
 * copys assets to app.
 */
function assets(){
  return Gulp.src('src/assets/*').pipe(Gulp.dest('app/assets'));
}

/**  build()
 * build all the content (css, js and md)
 * 
 * @param {bool} minify choos whather you want to minify or not.
 */
function build(minify = true){
  return Gulp.parallel(css(minify), js(minify), md(minify), assets)
}

/** clean()
 * cleanup all the build files to start all over again whith the build process.
 */
function clean(){
  return Gulp.src(['app'], {read: false, allowEmpty: true})
      .pipe(Gulp.clean())
}

exports.clean = clean;
exports.server = httpd;
exports.buildCSS = css(false);
exports.buildJS = js(false);
exports.buildMD = md(false);
exports.build = Gulp.series(clean, build(true));
exports.testBuild = Gulp.series(clean, build(false));
exports.test = Gulp.series(clean, build(false), httpd);
exports.default = Gulp.series(clean, build(true), httpd);
