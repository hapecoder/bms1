var gvolt = []
var gcurr = []
var gtemp = []
var gsoc = []
var url = "http://10.115.120.21:8081/api/v1/group/page";
var reqtime = 1
var getdata = function () {
    reqtime++;
    fetch(url + "?page=" + reqtime + "&size=10", {
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



//窗体加载
window.onload = function () {
    this.getdata();
    testBegin(0);
}
//测试开始
function testBegin(val) {

    var bat7 = document.getElementById("battery7");

    for (var i = val; i <= 100; i++) {


        cname7 = Findcname(i);
        bat7.style.setProperty('width', i + '%');
        bat7.className = cname7;
        bat7.innerText = i + '%';


        window.setTimeout("testBegin(" + ++i + ")", 200);
        break
    }


    var bat1 = document.getElementById("battery1");
    var soc1 = gsoc[1];
    var u1 = gvolt[1];
    var i1 = gcurr[1];
    bat1.style.setProperty('width', soc1 + '%');
    bat1.className = Findcname(soc1);
    bat1.innerText = soc1 + '%';
    $('#u1').text(u1);
    $('#i1').text(i1);

    var bat2 = document.getElementById("battery2");
    var soc2 = gsoc[2];
    var u2 = gvolt[2];
    var i2 = gcurr[2];
    bat2.style.setProperty('width', soc2 + '%');
    bat2.className = Findcname(soc2);
    bat2.innerText = soc2 + '%';
    $('#u2').text(u2);
    $('#i2').text(i2);

    var bat3 = document.getElementById("battery3");
    var soc3 = gsoc[3];
    var u3 = gvolt[3];
    var i3 = gcurr[3];
    bat3.style.setProperty('width', soc3 + '%');
    bat3.className = Findcname(soc3);
    bat3.innerText = soc3 + '%';
    $('#u3').text(u3);
    $('#i3').text(i3);


    var bat8 = document.getElementById("battery8");
    bat8.style.setProperty('width', '99%');
    bat8.className = 'progress-bar progress-bar-striped progress-bar-animated bg-success';
    bat8.innerText = '99%';




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