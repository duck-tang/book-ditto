var http = require('http');
var mine = require('./mine.js').types;
var fs = require('fs');
var path=require('path');
var url=require('url');

var DIR = __dirname


http.createServer(function(request, response) {

var layout = fs.readFileSync('./index.html',{encoding:'utf8'});
    if(request.url == '/')
        request.url = '/index.html'
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join(DIR, pathname);

    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            console.log(realPath)
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });

}).listen(8080,function(){
    console.log('http is listening at port 8080')
});
