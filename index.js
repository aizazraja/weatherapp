const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) =>{
    var valNum = parseFloat(orgVal.main.temp);
    var tem=valNum-273.15;
    var num = (tem).toFixed(0)
    let temperature =  tempVal.replace("{%tempval%}", num);
    temperature =  temperature.replace("{%tempmin%}", num);
    temperature =  temperature.replace("{%tempmax%}", num);
    temperature =  temperature.replace("{%location%}", orgVal.name);
    temperature =  temperature.replace("{%country%}", orgVal.sys.country);
    temperature =  temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    //console.log(orgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((req, res) => {
    
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?lat=24.793000&lon=67.064778&appid=bf1021968e70dfee15d368a0a271a2c2")
       
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            //console.log(arrData[0].main.temp);
            const realTimeData = arrData.map(val => replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log("connection closed due to error ");
            res.end();
        });
    }
});

server.listen(4000, "127.0.0.1", () => {
    console.log("listening to the port number 4000");
});