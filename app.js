const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname +"/index.html");
});

app.post("/", function(req, res) {
    const query = req.body.cityname;
    const api = "ed8c428d1828480c41516466bb56f604";
    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api}&units=${unit}`;
    
    https.get(url, function(response) {
        if (response.statusCode === 404) {
            // City not found
            res.send('<script>alert("City not found. Please enter a valid city name."); window.location.href = "/";</script>');
        } else{
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            res.render("weather", {
                city: query,
                temperature: temp,
                description: weatherDescription,
                iconUrl: imageUrl
            });
        });
    }
    }).on("error", function(error) {
        // Handle other errors
        console.error("Error:", error);
        res.send('<script>alert("An error occurred. Please try again later."); window.location.href = "/";</script>');
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running at port 3000");
});
