import express from 'express';
import dotenv from 'dotenv';
import { dbconnect } from './config/DB.js';
import router from './routes/routes.js';
import errorMiddleware from './middlewares/Error.js';
const app = express();
dotenv.config();
// Json middleware
app.use(express.json());
const port = process.env.PORT;
// connecting to db
dbconnect();
// Routes
app.use('/api/', router);
// swagger documentation
// const options = {
//     swaggerDefinition: {
//         openapi: "3.0.0",
//         info: {
//             title: "Nodejs assesment API",
//             version: "1.0.0",
//             description: "Completed the assessment",
//         },
//         servers: [
//             {
//                 url: "http://localhost:4000/",
//             },
//         ],
//     },
//     apis: [path.resolve(__dirname, 'routes/routes.js')],
// }
// const spacs = swaggerJSDoc(options);
// app.use("/api-docs",
//     swaggerui.serve,
//     swaggerui.setup(spacs)
// )
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});
app.use(errorMiddleware);
