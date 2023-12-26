import express from 'express';
import dotenv from 'dotenv'
import { dbconnect } from './config/DB.js';
import router from './routes/routes.js';

const app = express();

dotenv.config();    

// Json middleware
app.use(express.json())

const port = process.env.PORT

// connecting to db
dbconnect();

// Routes
app.use('/api/', router)

app.listen(port, ()=> {
    console.log(`Server started at ${port}`)
})