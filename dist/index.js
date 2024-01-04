import dotenv from 'dotenv';
import { dbconnect } from './config/DB.js';
// import router from './routes/routes.js';
// import errorMiddleware from './middlewares/Error.js';
import { createClient } from 'redis';
import app from './app.js';
dotenv.config();
// Json middleware
// app.use(express.json())
const port = process.env.PORT;
// connecting to db
dbconnect();
// Redis client connection for caching
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
// app.use('/api/', router)
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});
// middleware for handling errors
// app.use(errorMiddleware)
