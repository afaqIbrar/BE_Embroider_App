const express  = require('express');
const dotenv = require('dotenv').config()
const PORT  =  process.env.PORT || 5000;
const app = express();
const colors  = require('colors');

const userRoutes  = require('./routes/userRoutes');
const workerRoutes = require('./routes/workerRoutes');
const processLotRoutes = require('./routes/processLotRoutes');
const workAssignmentRoutes = require('./routes/workAssignmentRoutes');
const accountRoutes = require('./routes/accountsRoutes');
const {errorHandler , notFound} =  require('./middleware/errorMiddleWare');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');
connectDB();

app.use(cors({
  origin: process.env.APP_PATH,
  credentials:true,
  exposedHeaders: ["set-cookie"]
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());



app.use('/api/users',userRoutes);
app.use('/api/workers',workerRoutes);
app.use('/api/processLot',processLotRoutes);
app.use('/api/work',workAssignmentRoutes);
app.use('/api/account',accountRoutes);
app.get('/api/test', (req,res) => res.send('Server is ready'));
app.get('/',(req,res) => res.json('Server is ready'))
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => console.log(`Server stated on port ${PORT}`.cyan.underline))