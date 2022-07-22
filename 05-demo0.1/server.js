const { Socket } = require('dgram');
var fs = require('fs');
var http = require('http');
var net = require('net');

var HTTP_PORT = "8000";
var TCP_PORT = "9000";
var TIMEOUT = 30 * 1000;
var tcpClient = null;

// http server
var httpServer = http.createServer(function (req, res) {
    console.log(req.method + ':' + req.url);
    switch (req.url) {
        case '/':
            res.end(fs.readFileSync('./index.html'));
            break;
        case '/open':
            operateLed('1');
            res.end('succeed');
            break;
        case '/close':
            operateLed('0');
            res.end('succeed');
            break;
        case '/data':
            var result = getData();
            res.end(result);
            break;
        default:
            res.writeHead(400);
            res.end();
            break;
    }
});
httpServer.listen(HTTP_PORT);
httpServer.on('error', function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    console.log(error);
});
httpServer.on('listening', function () {
    var addr = httpServer.address();
    var bind;
    if (typeof addr === 'string') {
        bind = 'pipe ' + addr;
    } else {
        bind = 'port ' + addr.port;
    }
    console.log('htt server listening on ' + bind);
});

// tcp server
var tcpServer = net.createServer((socket) => {
    var addr = socket.remoteAddress + ':' + socket.remotePort;
    console.log(addr, 'connect.');
    socket.addr = addr;
    tcpClient = socket;
    // 接收数据
    socket.on('data', data => {
        var str = addr + '==>' + data.toString('ascii');
        console.log(str);
        socket.lastValue = data.toString('ascii');
    });
    // close
    socket.on('close', () => {
        console.log(addr, 'close');
        tcpClient = null;
    })
    socket.on('error', (err) => {
        console.log('error', err);
        tcpClient = null;
    });
    socket.setTimeout(TIMEOUT);
    socket.on('timeout', () => {
        console.log(socket.url, socket.addr, 'socket timeout');
        socket.end();
        tcpClient = null;
    });
});
tcpServer.on('error', (err) => {
    console.log('error', err);
    tcpClient = null;
});
tcpServer.listen({
    port: TCP_PORT,
    host: '0.0.0.0'
}, () => {
    console.log('tcp server running on', tcpServer.address());
});

function getData() {
    var addr = '无连接';
    if (tcpClient && tcpClient.addr) {
        addr = tcpClient.addr;
    }
    var data = '无数据';
    if (tcpClient && tcpClient.lastValue) {
        data = tcpClient.lastValue;
    }
    var result = JSON.stringify({
        addr: addr,
        data: data
    });
    return result;
}

function operateLed(status) {
    if (tcpClient) {
        tcpClient.write(status, 'ascii');
    }
    else {
        console.log('error:not tcpClient.');
    }
}