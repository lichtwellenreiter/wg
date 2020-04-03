const express = require('express')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const engines = require('consolidate');
const app = express()

const SERVERURL = process.env.SERVER_URL || 'localhost'
const SERVERPORT = process.env.SERVER_PORT || 3000
const REDISURL = process.env.REDIS_URL || 'localhost';
const REDISPORT = process.env.REDIS_PORT || 6379;

app.use(express.static(path.join(__dirname, 'static')))
app.use(morgan('combined'))
app.set('views', __dirname + '/static')
app.engine('html', engines.mustache)
app.set('view engine', 'html')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// Initialize Datastore
let redis = require('redis')
let client = redis.createClient(REDISPORT, REDISURL)


client.on('connect', () => {
    console.log('Redis client connected to Redis Server on [' + REDISURL + ':' + REDISPORT + ']');
});

client.on('error', (err) => {
    console.log('Something went wrong [' + REDISURL + ':' + REDISPORT + '] ' + err);
});


// All routes that are available, First OpenShift needed routes
app.get('/liveness', (req, res) => {
    res.json({
        "app": {
            "version": "1.0.0",
            "name": "weightgauge",
            "description": "A Weightgauge to display the current and target and some mid target"
        }
    })
})


app.get('/health', (req, res) => {
    res.json({"status": "UP"})
})

// Now some Application routes
app.get('/', (req, res) => {
    res.render("static/index.html")
})

app.get('/getAll', (req, res) => {

    let max = getKey('max')
    let current = getKey('current');
    let target = getKey('target');
    let semi = getKey('semi');

    res.json({
        "max": max,
        "current": current,
        "target": target,
        "semi": semi
    })

})

app.get('/initredis', (req, res) => {
    client.set('max', '110', redis.print)
    client.set('current', '106.7', redis.print)
    client.set('target', '85', redis.print)
    client.set('semi', '100', redis.print)
    client.set('weekchallenge', 'No refined Sugar!', redis.print)
    client.set('semireward', 'New Coffeemachine', redis.print)
    res.json({
        "msg": "done"
    })
})

// Set this new Shit
app.get('/setWeekchallenge/:challenge', (req, res) => {
    console.log(req.params.challenge)
    client.set('weekchallenge', req.params.challenge, redis.print)
    res.redirect("/")
})

app.get('/setSemiReward/:reward', (req, res) => {
    console.log(req.params.reward)
    client.set('semireward', req.params.reward, redis.print)
    res.redirect("/")
})

app.get('/setSemi/:semi', (req, res) => {
    console.log(req.params.semi)
    client.set('semi', req.params.semi, redis.print)
    res.redirect("/")
})

app.get('/setCurrent/:current', (req, res) => {
    console.log(req.params.current)
    client.set('current', req.params.current, redis.print)
    res.redirect("/")
})

app.listen(SERVERPORT, () => console.log(`server started on ${SERVERURL}:${SERVERPORT}`))

function getKey(key) {
    client.get(key, (error, response) => {
        if (response) {
            return response.toString()
        } else {
            console.error("Error Accessing REDIS Storage")
        }
    })
}