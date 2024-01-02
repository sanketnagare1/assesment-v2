import express from 'express';
import dotenv from 'dotenv'
import { dbconnect } from './config/DB.js';
import router from './routes/routes.js';
import errorMiddleware from './middlewares/Error.js';

import { createClient } from 'redis';


const app = express();

dotenv.config();

// Json middleware
app.use(express.json())

const port = process.env.PORT

// connecting to db
dbconnect();



// Redis client connection
const client = createClient();
client.on('connect', () => {
    console.log('Connected to Redis');
});
client.on('end', () => {
    console.log('Disconnected from Redis');
});
client.on('ready', () => {
    console.log('Redis is ready');
});
client.connect();
app.locals.redisClient = client;

// Routes
app.use('/api/', router)


app.listen(port, () => {
    console.log(`Server started at ${port}`)
})



app.use(errorMiddleware)