const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

// console.log(dataObj)

const slugs = dataObj.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);

console.log(slugs);

const server = http.createServer((req, res) => {
  // const pathname = req.url;
  // console.log(pathname)
  const { query, pathname } = url.parse(req.url, true);
  console.log(query);
  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
    res.end(output);
  } else if (pathname === '/product') {
    // Product page
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    res.end('<h1>Page not found! </h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is loading...');
});
