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
    return getdata
}
setInterval(getdata(), 10000)


window.onload = function () {
    $("#warningled").hide();
    debugger


    updateBegin(0);
}

function updateBegin(x) {

    d = moment().format('HH:mm:ss');
    if (gcurr[x] != undefined) {
        $("tbody").append('  <tr> <td>' + gcurr[x] + '</td><td>' +
            gvolt[x] + '</td><td>' + gtemp[x] + '</td><td>' + gsoc[x] + '<td>' + d + '</td>');
    }
    // if (gsoc[x] < 96) {
    //     $("#warningled").show(100);

    // }
    // if (gsoc[x] >= 96) {
    //     $("#warningled").hide(100);

    // }
    $("tr").eq(-2).attr("style", "background-color: "); //倒数第二个变回原色
    $("tr:last").attr("style", "background-color: azure");
    x++;
    t = setTimeout(updateBegin, 1000, x);
    if (x == 99999) {
        clearTimeout(t);
    }


}
$(document).ready(function () {
    $(".dropdown-item").click(function () {
        var num = parseInt($(this).text());

        clearTimeout(t);
        $("tbody").empty(); //只删除子元素
        i = 0;
        updateBegin(num);
        console.log(num);
    });
});