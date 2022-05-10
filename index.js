const express = require('express')

const app = express();
const keys = require('./keys.json')

app.set('keys', keys.learnmongo)

//import route
const authRoute = require('./routes/auth')
const postRoute = require('./private/post')
//connect to database
const mongoose = require('./database/mongodb.js')(app.get('keys').db_name)

//send post requests
app.use(express.json())
//Route middleware
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen(app.get('keys').port, () => console.log('Server up and running'))