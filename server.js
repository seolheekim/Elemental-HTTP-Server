const http = require('http');
const fs = require('fs');
const query = require('querystring')

// //Read contents of files
// let index = fs.readFileSync('./public/index.html')
// let helium = fs.readFileSync('./public/helium.html')
// let hydrogen = fs.readFileSync('./public/hydrogen.html')
// let error = fs.readFileSync('./public/404.html')
// let css = fs.readFileSync('./public/css/styles.css')



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

  //





    // Begining of POST Requests
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
    //res.end();

    // Beginning of GET method
    if(req.method === 'GET') {
      let pathName = req.url;
      let contentType;

    if(req.url.indexOf('.html') > -1) {
      pathName ='./public' + req.url;
      contentType = 'text/html';
    }
    if(pathName === '/') {
      pathName = './public/index.html';
      contentType = 'text/html';
    } else {
      if(req.url.indexOf('.css') > -1) {
        pathName = './public' + req.url;
        contentType = 'text/css';
      }
    }

    // Read contents of file
    fs.readFile(pathName, (err, data)=> {
      if(err) {
        contentType = 'text/html';
        fs.readFile('./public/404.html', (err, data) => {
          res.writeHead(404, {
            'Content-Type': contentType,
          });
          res.write(data.toString());
          res.end();

        });
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
        });
        res.write(data.toString());
        res.end();
      }
    });
  }

});





const port = 8080;
server.listen(port)

