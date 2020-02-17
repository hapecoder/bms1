var gvolt = []
var gcurr = []
var gtemp = []
var gsoc = []
var gsoh=[]
// var url = "http://192.168.43.111:8081/api/v1/group/page";
var  url ="http://10.115.120.178:8081/api/v1/group/time";
var data = {
    "startDateTime": "2019-11-28 13:39:00",
    "endDateTime": "2019-11-28 14:47:00"
}
var q=0;
var getdata=function () {
    fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json()).then(data => data.data)
        .then(function (data) {
            console.log(data);
            for (i = q; i < q+1000; i++) {
                gvolt.push(data[i].groupVolt);
                gcurr.push(data[i].groupCurr);
                gtemp.push(data[i].groupTemp);
                gsoc.push(data[i].groupSoc);
                gsoh.push(data[i].groupSoh);
            }
            q=q+1000
        })
        .catch(err => console.log(err));
}
var id=0;
function update(x) {
    x=id
    if(x%1000==0){
        getdata();
    }
    $("#volt").text(gvolt[x])
    $("#curr").text(gcurr[x])
    $("#temp").text(gtemp[x])
    $("#soc").text(gsoc[x])
    $("#soh").text(gsoh[x])
    id++

    $('#chartSOC').data('easyPieChart').update(gsoc[x]);
    $('#chartSOH').data('easyPieChart').update(gsoh[x]);   
}


window.onload = function () {
    getdata();
    $('#chartSOC, #chartSOH').easyPieChart({
        lineWidth: 6,
        size: 160,
        scaleColor: false,
        trackColor: 'rgba(255,255,255,.25)',
        barColor: '#FFFFFF',
        animate: ({duration: 5000, enabled: true}),
    });
    setInterval (update,1000,id);
}