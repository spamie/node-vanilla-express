// VANILLA node.js : javascript only plus express
// 10/12/18 11:12 initial ver
// 10/12/18 add express response handler to replace manual GET/POST handler

// Core Modules
var dns = require('dns');
var os = require('os');
const v8 = require('v8');

const express = require('express');   // express non built in module
const app = express(); 

let etime = new Date();

const PORT = process.env.PORT || 5000;  // needed for Heroku -or- local running

function logger (mssg) {
    let nowtime = new Date();
    console.log(Date().toString().slice(0, 24) + ' : ' + ( nowtime - etime ) + ' (ms) : ' + mssg);    
    etime = nowtime;
};

// LOG START
logger('Started app.js');

// Define Routes
app.get('/', (req, res) => res.send('This is node.js with builtin modules and express ONLY.'))

app.listen(PORT, () => console.log(`Node.js listening on port ${PORT}!`))

// LOG END
logger('Finished app.js');
