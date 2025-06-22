var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = require('./config/swagger.config')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Custom CSS to ensure proper expansion
const customCss = `
  .swagger-ui .models {
    display: block !important;
  }
  .swagger-ui section.models {
    display: block !important;
  }
  .swagger-ui section.models.is-open {
    display: block !important;
  }
  .swagger-ui .models .model-container {
    display: block !important;
  }
  .swagger-ui .topbar { 
    display: true 
  }
`;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: customCss,
  customSiteTitle: "Otravers API Documentation",
  swaggerOptions: {
    defaultModelsExpandDepth: 3,
    defaultModelExpandDepth: 3,
    displayRequestDuration: true,
    docExpansion: "none",
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    displayOperationId: false
  }
}));

// Serve swagger spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', require('./routes/auth'));

module.exports = app;
