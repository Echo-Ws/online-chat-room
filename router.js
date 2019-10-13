const express = require("express");
const router = express.Router();
const axios = require('axios')

var apikey = 'LBEUVrpr04SsOsrodFB5ay5AIGjaWsdd';

router.get('/js/*.js', (req, res) => {
    res.sendFile(__dirname + "/" + req.url);
});
router.get('/css/*.css', (req, res) => {
    res.sendFile(__dirname + "/" + req.url);
})

router.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
router.get("/chat", (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});
router.get("/search/:q", (req, resquest) => {
    // console.log(req.params.q)
    axios.get("http://dataservice.accuweather.com/locations/v1/cities/search", {
        params: {
            'apikey': apikey,
            q: req.params.q,
        }
    }).then(res => {
        if(res.data.length==0){
            resquest.send(-1)
        }
        else{
            resquest.send(res.data[0]['Key'])
        }
    }).catch(err => {
        console.log(err)
    })

});

router.get("/today/:q", (req, resquest) => {
    axios.get("http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/"+req.params.q, {
        params: {
            'apikey': apikey
        }
    }).then(res => {
        if(res.data.length==0){
            resquest.send(-1)
        }
        else{
            let data = []
            res.data.forEach(ele => {
                let d={}
                d['DateTime'] = ele['DateTime']
                d['IconPhrase'] = ele['IconPhrase']
                d['Temperature'] = ele['Temperature']['Value']+ele['Temperature']['Unit']
                data.push(d);
            });         
            resquest.send(data);
        }
    }).catch(err => {
        console.log(err)
    })
});

router.get("/indices/:q", (req, resquest) => {



    axios.get(`http://dataservice.accuweather.com/indices/v1/daily/5day/${req.params.q}/groups/1` ,{
        params: {
            'apikey': apikey
        }
    }).then(res => {
        if(res.data.length==0){
            resquest.send(-1)
        }
        else{
            let data = [];
            let count = 0;
            let t ;
            let nums = res.data.length;
            let dayitem = nums/5

            for(let i=0;i<nums;i++){
                let ele = res.data[i]
                if(i%dayitem==0){
                    if(t){
                        data.push(t)
                    }
                    t = {day:ele['LocalDateTime'],datas:[]}; 
                }
                let d = {}
                d['Name'] = ele['Name']
                d['Value'] = ele['Value']
                d['Category'] = ele['Category']
                t['datas'].push(d);
            }
            data.push(t);
            indice=data
            resquest.send(data);
            
        }
    }).catch(err => {
        console.log(err)
    })
});

module.exports = router;