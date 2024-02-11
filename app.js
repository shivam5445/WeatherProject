const express = require("express");
const https = require("https");

const bodyparser = require("body-parser");

const app = express();

app.use(bodyparser.urlencoded({extended:true}));

app.get("/" ,function(req,res){
    res.sendFile(__dirname +"/index.html");
    
    
    // res.send("Server is up and running");
})

app.post("/" , function(req,res){
    console.log(req.body.cityname);
    // console.log("post request recieved . ");
    const query = req.body.cityname;
    const api = "ed8c428d1828480c41516466bb56f604"
    const unit ="metric"
    const url="https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + api + "&units=" + unit;
    https.get(url,function(response){
        console.log(response.statusCode);
        response.on("data",function(data){
        // console.log(data);
        const Weatherdata = JSON.parse(data);
        // console.log(Weatherdata);
        // const object = {
        //     name  : "Shivam",
        //     Favfood : "Paneer"
        // }
        // console.log(JSON.stringify(object));
        const temp = Weatherdata.main.temp;
        const weatherDiscription = Weatherdata.weather[0].description;
        const icon = Weatherdata.weather[0].icon;
        const imageurl = "https://openweathermap.org/img/wn/"+ icon + "@2x.png";

        res.write("<p>the weather discription is " + weatherDiscription  + "</p>");
        res.write("<h1>the temperature is " + query +" " + temp + "degree celcius</h1>");
        res.write("<img src="+ imageurl + ">");
        res.send();
        })
    })
})






app.listen(process.env.PORT ||3000,function(){
    console.log("server is running at port 3000");
});