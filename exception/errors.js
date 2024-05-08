const express = require('express')
const app = express()

//used for route error handling
app.use((req, res) => {
    console.error(`Not found: ${req.path}`);
    res.status(404).json({
      ok: false,
      message: "Route not found",
    });
  });
  
  //used for error 500 handling
  app.use((err, req, res, next) => {
    console.error(`FATAL ERROR: ${req.path}`);
    console.error(err);
  
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  });

  module.exports = app