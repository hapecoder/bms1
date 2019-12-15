var gvolt = []
var gcurr = []
var gtemp = []
var gsoc = []
var url = "http://10.115.120.21:8081/api/v1/group/page";
var reqtime=1
var getdata=function () {
    reqtime++;
    fetch(url+"?page="+reqtime+"&size=10", {
            method: 'get'
        }).then(response => response.json()).then(data => data.data.data)
        .then(function (data) {
            console.log(data);
            for (i = 0; i < 10; i++) {
                gvolt.push(data[i].groupVolt);
                gcurr.push(data[i].groupCurr);
                gtemp.push(data[i].groupTemp);
                gsoc.push(data[i].groupSoc);
            }
        })
        .catch(err => console.log(err));
}
var id=0;
function update(x) {
    x=id
    if(x%10==0){
        getdata();
    }
    $("#volt").text(gvolt[x])
    $("#curr").text(gcurr[x])
    $("#temp").text(gtemp[x])
    $("#soc").text(gsoc[x])
    $("#soc1").text(gsoc[x])
    // $("#soc1").attr("data-percent",gsoc[x]);
    id++

   
}

window.onload = function () {

    getdata();
    $('#chartNewVisitors, #chartSubscriptions').easyPieChart({
        lineWidth: 6,
        size: 160,
        scaleColor: false,
        trackColor: 'rgba(255,255,255,.25)',
        barColor: '#FFFFFF',
        animate: ({duration: 5000, enabled: true})
    
    });
    
    setInterval (update,1000,id)
}



