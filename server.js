const app = require('./app.js')
const error = require('./exception/errors.js')
const port = 3000;

app.use(error)
  
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  })