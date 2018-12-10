// VANILLA node.js : javascript only plus express
// 10/12/18 11:12 initial ver
// 10/12/18 add express response handler to replace manual GET/POST handler

// Core Modules
const fs = require('fs');
const http = require('http');
var dns = require('dns');
const { parse } = require('querystring');
var os = require('os');
const v8 = require('v8');

let etime = new Date();

const PORT = process.env.PORT || 5000;

function logger (mssg) {
    let nowtime = new Date();
    console.log(Date().toString().slice(0, 24) + ' : ' + ( nowtime - etime ) + ' (ms) : ' + mssg);    
    etime = nowtime;
};

// LOG START
logger('Started app.js');

// HTTP Server Start
// const hostname = '127.0.0.1';

// const port = 3000; replaced by heroku
const server = http.createServer((req, res) => {

    // The request object is an instance of IncomingMessage
    logger('Req : ' + req.method + '-' + req.url + '- ' + ' -from- ' + req.headers["user-agent"].slice(0, 30));

    if (req.method === 'POST') {
        collectRequestData(req, result => {
            logger('Parsed data : ' + JSON.stringify(result));

            // POST request handler - now body is complete
            switch (req.url) {
                case '/contactform-action':   // on POST sends back 'contactform_action'
                    logger('Handle contactform-action : ');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('POST Returns :' + JSON.stringify(result) + '\nName :' + result.name + '\nCompany :' + result.company);
                    break;
                default:  // should really be a 404
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Really a POST:404 but lets be nice and say Hello World\n');
            }; // POST req.url switch
        });
    }; // POST request 

    // Get here even if a POST request hasnt finished its async send of data ! - dont put POST req handlers in here
    if (req.method === 'GET') switch (req.url) {
        case '/home':
        case '/':
            fs.createReadStream(__dirname + '/assets/index.html', 'utf8').pipe(res);  // pipe the html to the result
            break;
        case '/favicon.ico':
            fs.createReadStream(__dirname + '/assets/favicon.ico', 'binary').pipe(res);  // pipe the file to the result
            break;
        case '/contactform.css':
            fs.createReadStream(__dirname + '/assets/contactform.css', 'utf8').pipe(res);  // pipe the file to the result
            break;
        case '/contactform':   // on POST sends back 'contactform-action'
            fs.createReadStream(__dirname + '/assets/contactform.html', 'utf8').pipe(res);  // pipe the html to the result
            break;
        case '/dns':
            // DNS Lookup
            var w3 = dns.lookup('google.com', function (err, addresses, family) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('DNS Lookup Returns :' + addresses);
            });
            break;
        case '/os':
            // OS Lookup
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('OS Lookup Returns :' + os.platform + ' - ' + os.arch + JSON.stringify(os.cpus()));
            break;
        case '/v8':
            // v8 Lookup
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('OS Lookup Returns :' + JSON.stringify( v8.getHeapStatistics() ));
            break;
        default:  // should really be a 404
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Really a GET:404 but lets be nice and say Hello World\n');
    } // GET req.url switch

});
server.listen(PORT, /*hostname,*/ () => {
    // logger(`Server running at http://${hostname}:${PORT}/`);
    logger(`Server running on port ${ PORT }`);
});

// ASYNC File Reader with callback
fs.readFile('./assets/readme.txt', (err, data) => {
    if (err) throw err;
    logger('readme.txt async read complete : ' + data.slice(0,70));
});

// timeout_vs_immediate.js
setTimeout(() => {
    logger('timeout 0ms fired');
}, 0);
setTimeout(() => {
    logger('timeout 100ms fired');
}, 100);

setImmediate(() => {
    logger('immediate fired');
});

// LOG END
logger('Finished app.js');

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}