const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoute = require('./routes/auth.js')
const userRoute = require('./routes/users.js')
const movieRoute = require('./routes/movies')
const listRoute = require('./routes/lists')


dotenv.config()

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log('DB Connected')).catch((err)=>console.log(err))

app.use(cors())

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/movie', movieRoute)
app.use('/list', listRoute)

app.listen(8700, ()=>{
    console.log('Backend running');
})