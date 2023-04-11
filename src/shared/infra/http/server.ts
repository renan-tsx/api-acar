import { app } from "./app";

app.listen(4444, function() {
  console.log(`
    Server http://localhost:4444
    Swagger http://localhost:4444/api-docs
  `);
});