const express = require('express');
const http = require('http');
require("dotenv").config();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoConnection = require('./util/mongoConnection');
const users = require('./User/userRouter');
const trainData = require('./TrainData/DataTableRouter');
const tempData = require('./TempData/TempDataRoutes');
const document = require('./Document/DocumentRouter');

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.use(helmet());


mongoConnection();


app.get('/', (req, res) => res.send('Server is running'));

app.use('/api/users', users);
app.use('/api/trainData', trainData);
app.use('/api/tempData', tempData);
app.use('/api/documents', document);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});



server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}...`);
});
