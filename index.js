const app = require("./app");
const http = require("http");
const port = 8080;


http.createServer(app).listen(port,()=>{
  console.log(`server up and running on port ${port}`)
});
