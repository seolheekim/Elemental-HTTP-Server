//requesting protocol
const http = require('http');
const fs = require('fs');
const query = require('querystring');
const port = 8080;

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
  <a href = "/" > back
</body>
</html>`
}

function linkHtml(elementName) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>The Elements</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body>
    <h1>The Elements</h1>
    <h2>These are all the known elements.</h2>
    <h3>These are 2</h3>
    <!-- new links -->
    <ol>
      <li>
        <a href="${elementName}.html">${elementName}</a>
      </li>
    </ol>
   `
}

const server = http.createServer( (req, res) => {

    // Begining of POST Requests
    if (req.method == 'POST') {
        req.on('data', (data) => {
            let content = data.toString()
            let newData = query.parse(content)
            let fileName = req.url;
            let linkToHtml = fs.readFileSync('./public/index.html', 'utf-8')
            let updateHtml = linkToHtml.replace(/(<!-- new link -->)/g, linkHtml(newData.elementName))
            console.log("updateHtml: ", updateHtml)
            //update new links to HTML
            fs.writeFile('./public/index.html', linkHtml(newData.elementName), (err) => {
              if(err) throw err;
            });
            //creating new HTML files
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
server.listen(port)

