const express = require('express');
const cors = require("cors");
const winston = require("winston");
const moment = require("moment");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: 'logs.txt' }),
        new winston.transports.Console()
    ]
});

app.all("*", (req, res, next)=> {
    logger.info(`Got a ${req.method} request - Route ${req.url} - ${moment().format()}`);
    next();
})

const {authRouter} = require('./routers/authRouter');
app.use('/auth' ,authRouter);

const {userRouter} = require('./routers/userRouter');
app.use('/api/user' ,userRouter);

const {memoryRouter} = require('./routers/memoryRouter');
const { updateLocale } = require('moment');
app.use('/api/memories', memoryRouter);

app.all('*',(req,res) => {
    res.status(404).json({status:"error", message:`Route not found!`});
});

const port = process.env.PORT || 3006;
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
