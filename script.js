const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())
const shortid = require('shortid')
const bodyParser = require('body-parser')
const rndm = require('random-simple')
app.use(bodyParser.urlencoded({ extended: true }))
const nodemailer = require("nodemailer")

app.listen(3001 || process.env.PORT);

let users = []
let urls = []
let shorturl;
app.post("/createuser", function (req, res) {
    users.push(req.body)
})

app.get("/login", function (req, res) {
    res.json(users);
})

app.get("/user/:id", function (req, res) {
    let username = req.params.id;
    console.log(username)
    res.json(username)
})

app.post("/url", function (req, res) {

    var short = require('node-url-shortener');

    short.short(req.body, function (err, url) {
        shorturl = url
        console.log(shorturl)
        res.json(url)
    });

})
const tokenGenerator = require('generate-token');
app.get("/random", function (req, res) {
    let token = tokenGenerator.generate(5);
    console.log(token);
    res.json(token)
})


app.post('/reset', function (req, res) {
    User.findOne({ email: req.body.email }, function (error, userData) {
        if(userData==null)
        {
            return res.status(404).json({
                success: false,
                msg: "Email is not register",
            });
        }
        var transporter = nodemailer.createTransport({
            // service: 'gmail',//smtp.gmail.com  //in place of service use host...

           
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "b3b235f452f137",
                pass: "4070626b73b159"
            }

        });
        var currentDateTime = new Date();
        var mailOptions = {
            from: 'no-reply@gmail.com',
            to: req.body.email,
            subject: 'Password Reset',
            html: "<h1>Welcome To Daily Task Report ! </h1><p>\
            <h3>Hello "+userData.name+"</h3>\
            If You are requested to reset your password then click on below link<br/>\
            <a href='http://localhost:3000/change-password/"+currentDateTime+"+++"+userData.email+"'>Click On This Link</a>\
            </p>"
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                User.updateOne({email: userData.email}, {
                    token: currentDateTime, 
                    
                },  {multi:true},function(err, affected, resp) {
                    return res.status(200).json({
                        success: false,
                        msg: info.response,
                        userlist: resp
                    });
                })
            }
        });
    })
});




