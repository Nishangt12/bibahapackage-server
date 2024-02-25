const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./database');
const errorMiddleware = require('./Middleware/error');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload');

// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});
app.use(express.json({ limit: '10mb' }));

// Connection
connection();

// Config
dotenv.config({ path: 'Server/.env' });

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRETKEY,
});

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Increase file size limit (10MB in this example, adjust as needed)
app.use(
  fileUpload({
    limits: { fileSize: 30 * 1024 * 1024 }, // 10MB limit
  })
);

// Routes
const product = require('./routes/product');
const user = require('./routes/users');
const category = require('./routes/categoryRoutes');
const order = require('./routes/orderRoute');
const invoice=require('./routes/invoiceRoute');

app.use('/api/v1', product);
app.use('/api/log', user);
app.use('/api/v1', category);
app.use('/api/ord', order);
app.use('/api/inv', invoice);


// Errors Middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(`Listening on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
