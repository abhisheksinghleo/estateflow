const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

app.get('/health', function (req, res) {
  return res.status(200).json({ status: 'ok' });
});

app.use('/api/v1', routes);

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

module.exports = app;
