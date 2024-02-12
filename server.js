   // (1)
// const http = require('http');

// const server = http.createServer((req, res) => {
//   if (req.url === '/') {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.write('<html><head><title>Welcome</title></head><body><h1>Welcome</h1></body></html>');
//     res.end();
//   } else if (req.url === '/login') {
//     res.end("Login")
    
//   } else if (req.url === '/signup') {
//     res.end("Signup")
   
//   } else if (req.url === '/profile') {
//     res.end("Profile")
    
//   } else {
//     res.writeHead(404, { 'Content-Type': 'text/html' });
//     res.write('<html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body></html>');
//     res.end();
//   }
// });

// server.listen(3000);
