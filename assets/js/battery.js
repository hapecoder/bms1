// var B1soc = []
// var B1soh = []
// var B1temp = []
// var B1volt = []
// var url1 = "http://10.115.120.137:8081/api/v1/B1/page";
// var B2soc = []
// var B2soh = []
// var B2temp = []
// var B2volt = []
// var url2 = "http://10.115.120.137:8081/api/v1/B2/page";
var m = 17
var n = 17045
var Bsoc = new Array();
var Bsoh = new Array();
var Btemp = new Array();
var Bvolt = new Array();
for (var i = 0; i < m; i++) {
    Bsoc[i] = new Array();
    Bsoh[i] = new Array();
    Btemp[i] = new Array();
    Bvolt[i] = new Array();
}
var data ={
    "startDateTime":"2019-11-28 13:39:00",
    "endDateTime":"2019-11-28 14:47:00",
    "did":"1"
}

var q=0
var getdata = function () {

    for (let did = 1; did < 17; did++) {
        data.did = did;
        debugger
        fetch("http://10.115.120.178:8081/api/v1/B/search", {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json()).then(data => data.data)
            .then(function (data) {

                for (i = q; i < q+10; i++) {
                    Bvolt[did].push(data[i].volt);
                    Bsoh[did].push(data[i].soh);
                    Btemp[did].push(data[i].temp);
                    Bsoc[did].push(data[i].soc);
                }
            })
            .catch(err => console.log(err));
    }
    q=q+10
    // fetch(url1 + "?page=" + reqtime + "&size=10", {
    //         method: 'get'
    //     }).then(response => response.json()).then(data => data.data.data)
    //     .then(function (data) {
    //         console.log(data);
    //         for (i = 0; i < 10; i++) {
    //             B1volt.push(data[i].volt);
    //             B1soh.push(data[i].soh);
    //             B1temp.push(data[i].temp);
    //             B1soc.push(data[i].soc);
    //         }
    //     })
    //     .catch(err => console.log(err));

    // fetch(url2 + "?page=" + reqtime + "&size=10", {
    //         method: 'get'
    //     }).then(response => response.json()).then(data => data.data.data)
    //     .then(function (data) {
    //         console.log(data);
    //         for (i = 0; i < 10; i++) {
    //             B2volt.push(data[i].volt);
    //             B2soh.push(data[i].soh);
    //             B2temp.push(data[i].temp);
    //             B2soc.push(data[i].soc);
    //         }
    //     })
    //     .catch(err => console.log(err));
}

var id = 0;


//窗体加载
window.onload = function () {
    this.getdata();
    $("#actchoose").click(function () {
        $("#actstate").text("电池" + $("#s1").val() + "与电池" + $("#s2").val() + "进行均衡");
    });
    $("#actstate").click(function () {
        $("#actstate").text("");
    });
    $('[data-toggle="tooltip"]').tooltip(); //提示框
    setInterval(update, 1000)

}
//测试开始
function update() {
    var x = id
    if (x % 9 == 0) {
        getdata();
    }
    var soclist = [];
    for (let did = 1; did < 17; did++) {


        var soc = Bsoc[did][x];
        // if (soc > 100) {
        //     soc = 100
        // };
        soclist.push(soc);
        $('#battery' + did).css("width", soc + "%");
        $('#battery' + did).attr("class", Findcname(soc))
        $('#battery' + did).text(soc + "%")

        var u = Bvolt[did][x];
        var s = Bsoh[did][x];
        var t = Btemp[did][x];
        $('#u' + did).text(u);
        $('#t' + did).text(t);
        $('#soh' + did).text(s);
    }

    let max=eval("Math.max(" +soclist.toString()+")");
    let min=eval("Math.min(" +soclist.toString()+")");
    let socv=(max-min).toFixed(4);
    let maxindex=soclist.indexOf(max);
    let minindex=soclist.indexOf(min);
    $('#variance').text(socv)
    $("#s1").attr("value",maxindex)
    $("#s2").attr("value",minindex)
    id++;


}





function Findcname(x) {
    var cname = '';
    if (x <= 30) {
        cname = 'progress-bar progress-bar-striped progress-bar-animated bg-danger';
    }
    if (x > 30) {
        cname = 'progress-bar progress-bar-striped progress-bar-animated bg-warning';
    }
    if (x > 60) {
        cname = 'progress-bar progress-bar-striped progress-bar-animated bg-success';
    }
    return cname
}