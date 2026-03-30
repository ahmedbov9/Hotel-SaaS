
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const corsOptions = require('./config/cors')
const apiLimiter = require('./config/rateLimit')
const errorHandler = require("./common/middlewares/error.middleware");
const { env } = require("./config/env");
const notFoundHandler = require("./common/errors/notFoundHandler");
const routes = require("./routes");


const app = express();




// Global middlewares
app.use(helmet());
app.use(require('cors')(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan( env.NODE_ENV === 'development'? "dev" : 'combined' ))

// API routes
app.use('/api' , apiLimiter, routes)




app.use(notFoundHandler);
app.use(errorHandler);
module.exports = app;
