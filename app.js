const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const usersFilePath = path.join(__dirname, 'users.json');

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (req.method === 'GET') {
    if (reqUrl.pathname === '/') {
      const filePath = path.join(__dirname, 'public', 'index.html');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Internal Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data.replace(/{{title}}/g, 'Home').replace(/{{heading}}/g, 'Welcome'));
        }
      });
    } else if (reqUrl.pathname === '/profile') {
      const { name } = reqUrl.query;
      if (name) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`Hello, ${name}!`);
      } else {
        res.writeHead(400);
        res.end('Not found');
      }
    } else {
      const filePath = path.join(__dirname, 'public', reqUrl.pathname);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          const extname = path.extname(reqUrl.pathname);
          let contentType = 'text/html';
          if (extname === '.css') {
            contentType = 'text/css';
          }
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    }
  } else if (req.method === 'POST') {
    if (reqUrl.pathname === '/signup') {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        const { email, password, username } = JSON.parse(data);
        fs.readFile(usersFilePath, 'utf8', (err, fileData) => {
          if (err) {
            res.writeHead(500);
            res.end('Internal Server Error');
          } else {
            const users = JSON.parse(fileData);
            if (users.find(user => user.email === email)) {
              res.writeHead(400);
              res.end('Email already exists');
            } else {
              users.push({ email, password, username });
              fs.writeFile(usersFilePath, JSON.stringify(users), err => {
                if (err) {
                  res.writeHead(500);
                  res.end('Internal Server Error');
                } else {
                  res.writeHead(302, { Location: '/login' });
                  res.end();
                }
              });
            }
          }
        });
      });
    } else if (reqUrl.pathname === '/login') {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        const { email, password } = JSON.parse(data);
        fs.readFile(usersFilePath, 'utf8', (err, fileData) => {
          if (err) {
            res.writeHead(500);
            res.end('Internal Server Error');
          } else {
            const users = JSON.parse(fileData);
            const user = users.find(user => user.email === email && user.password === password);
            if (!user) {
              res.writeHead(400);
              res.end('Invalid email or password');
            } else {
              res.writeHead(302, { Location: `/profile?name=${user.username}` });
              res.end();
            }
          }
        });
      });
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});