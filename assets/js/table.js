var gvolt = []
var gcurr = []
var gtemp = []
var gsoc = []
var gsoh = []
var url = "http://10.115.120.178:8081/api/v1/group/time";
var data = {
    "startDateTime": "2019-11-28 13:39:00",
    "endDateTime": "2019-11-28 14:47:00"
}

var q = 0
var getdata = function () {

    fetch(url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json()).then(data => data.data)
        .then(function (data) {
            console.log(data);
            for (let i = q; i < q + 100; i++) {

                gvolt.push(data[i].groupVolt);
                gcurr.push(data[i].groupCurr);
                gtemp.push(data[i].groupTemp);
                gsoc.push(data[i].groupSoc);
                gsoh.push(data[i].groupSoh);
            }
            q = q + 100
        })
        .catch(err => console.log(err));

    return getdata
}
setInterval(getdata(), 100000)


window.onload = function () {
    // $("#warningled").hide();

    // Init Sliders
    demo.initFormExtendedSliders();
    // Init DatetimePicker
    demo.initFormExtendedDatetimepickers();

    $("#timechoose").click(function () {
        data.startDateTime = $("#timestart").val();
        data.endDateTime = $("#timeend").val();
        clearTimeout(t);
        id = 0;
        gvolt = []
        gcurr = []
        gtemp = []
        gsoc = []
        gsoh = []
        debugger;
        getdata()
        
        $("tbody").empty(); //只删除子元素
        updateBegin(0);
    });

    updateBegin(0);
}
var id = 0

function updateBegin(x) {
    x = id;
    d = moment().format('HH:mm:ss');
    if (gcurr[x] != undefined) {
        $("#tablebody").append('  <tr> <td>' + gcurr[x] + '</td><td>' +
            gvolt[x] + '</td><td>' + gtemp[x] + '</td><td>' + gsoc[x] + '</td><td>' + gsoh[x] + '</td>');
    }
    // if (gsoc[x] < 96) {
    //     $("#warningled").show(100);
    // }
    // if (gsoc[x] >= 96) {
    //     $("#warningled").hide(100);
    // }
    $("tr").eq(-2).attr("style", "background-color: "); //倒数第二个变回原色
    $("tr:last").attr("style", "background-color: azure");

    id++;
    t = setTimeout(updateBegin, 1000, id);

    if (x == 99999) {
        clearTimeout(t);
    }


}