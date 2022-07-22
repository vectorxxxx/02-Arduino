var http = require('http');
var fs = require('fs');
var HTTP_PORT = "8000";
// 创建http server，并传入回调函数:
var httpServer = http.createServer(function (request, response) {
    // 回调函数接收request和response对象,
    // 获得HTTP请求的method和url:
    console.log(request.method + ': ' + request.url);
    switch (request.url) {
        case "/":
            //访问首页
            // 读取html文件并发送
            response.end(fs.readFileSync('./index.html'));
            break;
        default:
            response.writeHead(400);
            response.end();
            break;
    }
});

httpServer.listen(HTTP_PORT);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    console.error(error)

}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = httpServer.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('http server Listening on ' + bind);
}