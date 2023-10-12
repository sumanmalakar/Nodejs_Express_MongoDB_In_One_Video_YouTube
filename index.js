// const http = require('http');

import http from 'http';
import { sum,multiply } from './app.js';
import fs from 'fs'
import path from 'path';

const server = http.createServer((req,res)=>{
//   console.log(req.url)
    if(req.url === '/'){
        res.end("<h1>This is a Home route</h1>")
    }else if(req.url === '/about'){
        res.end("<h1>This is a About page</h1>")
    }else if(req.url === '/suman'){
        res.end("<h1>This is a Suman page</h1>")

    }
});

// console.log(fs)

// const fileRead = fs.readFileSync('./sample.txt','utf-8')

// console.log(fileRead)

// const content = "This is anothe content"

// fs.writeFile('index.java',content,()=>{
//     console.log("file crated")
// })

// console.log(path)

// const extenstion = path.extname("smaple.pdf");
// console.log(extenstion)

// sum(100,200)
// multiply(20,4)

const port = 1000;
server.listen(port,()=>{
console.log(`Server is running on port ${port}`)
})



// console.log(http)