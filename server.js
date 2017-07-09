const http = require('http');
const fs = require('fs');
const query = require('querystring')

function postRespond(elementName, elementSymbol, elementAtomicNumber, elementDescription) {
return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${elementName}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${elementName}</h1>
  <h2>${elementSymbol}</h2>
  <h3>${elementAtomicNumber}</h3>
  <p>${elementDescription}</p>
</body>
</html>`
}

let createPost = postRespond()

const server = http.createServer( (req, res) => {
    if (req.method == 'POST') {
        req.on('data', (data) => {
            let content = data.toString()
            let newData = query.parse(content)
            console.log('newData: ', newData)
            console.log("new content: " + content);
            let fileName = req.url;
            fs.writeFile(`public/${fileName}.html`, postRespond(newData.elementName, newData.elementSymbol,newData.elementAtomicNumber, newData.elementDescription), (err) => {
              if(err) throw err;
            });
        });
        res.writeHead(200, {'Content-Type': 'application/json', 'success' : 'true', 'Date' : `${new Date().toUTCString()}`});
    };
    res.end();
});
server.listen(8080, '0.0.0.0')

