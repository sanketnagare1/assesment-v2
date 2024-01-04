import express from 'express';
import router from './routes/routes.js';
import errorMiddleware from './middlewares/Error.js';
const app = express();
app.use(express.json())
app.use('/api/', router)
app.use(errorMiddleware)

export default app;