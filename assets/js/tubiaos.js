var m = 17
var n = 17045
var Bsoc = new Array();
var dlstmE = new Array();
var dlstmP = new Array();
var lstmE = new Array();
var bpE = new Array();
var ekfE = new Array();

for (var i = 0; i < m; i++) {
    Bsoc[i] = new Array();
    dlstmE[i] = new Array();
    dlstmP[i] = new Array();
    lstmE[i] = new Array();
    bpE[i] = new Array();
    ekfE[i] = new Array();
}
var dataT = {
    "startDateTime": "2019-11-28 13:39:00",
    "endDateTime": "2019-11-28 13:55:00",
    "did": "1"
}
var q = 10; //起始id


var method_soc = "DLSTM";
var num = 1;
var id = 0;
var b;
$(document).ready(function () {

    // Init Sliders
    demo.initFormExtendedSliders();
    // Init DatetimePicker
    demo.initFormExtendedDatetimepickers();

    beginplot(1);
    beginplot2(1, method_soc);
    $("#bchoose").click(function () {
        num = parseInt($("#s1").val());
        id = 0;
        clearInterval(b);
        beginplot(num);
        beginplot2(num, method_soc);
    });
    $("#timechoose").click(function () {           //时间筛选
        dataT.startDateTime = $("#timestart").val();
        dataT.endDateTime = $("#timeend").val();
        id = 0;
        tid=0;
        clearInterval(b);
        beginplot(num);
        beginplot2(num, method_soc);
    });
    $(".dropdown-item").click(function () {
        method_soc = $(this).text();
        $("#method_name").text(method_soc);
        id = 0;
        clearInterval(b);
        beginplot(num);
        beginplot2(num, method_soc);
    });
    setInterval(getdata(), 9000);

});
var getdata = function () {

    for (let did = 1; did < 17; did++) {
        dataT.did = did;

        fetch("http://10.115.120.178:8081/api/v1/error/search", {
                method: 'POST',
                body: JSON.stringify(dataT),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => response.json()).then(data => data.data)
            .then(function (data) {

                for (i = q; i < q + 200; i++) {
                    Bsoc[did].push(data[i].realSoc);
                    dlstmE[did].push(data[i].dlstmError);
                    dlstmP[did].push(data[i].dlstmPre);
                    lstmE[did].push(data[i].lstmError);
                    bpE[did].push(data[i].bpError);
                    ekfE[did].push(data[i].ekfError);
                }
            })
            .catch(err => console.log(err));
    }
    q = q + 200
    return getdata
}



function beginplot(did) {
    var chart = {
        type: 'spline',
        animation: Highcharts.svg,
        marginRight: 10,
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series1 = this.series[0];
                console.log(this);
                var series2 = this.series[1];
                setInterval(function () {
                    var x = new Date().getTime(); // current time
                    var y = parseFloat(Bsoc[did][id]); //current data 
                    var y1 = parseFloat(dlstmP[did][id]);
                    series1.addPoint([x, y], true, false); //第一个true表示更新，第二个true表示是否保存前面数据
                    series2.addPoint([x, y1], true, false);
                }, 1000); //每隔一秒更新一次
            }
        }
    };
    var title = {
        text: '第' + did + '节电池历史SOC数据'
    };
    var xAxis = {
        type: 'datetime',
        tickPixelInterval: 150
    };
    var yAxis = {
        title: {
            text: 'Value'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }],

    };
    var tooltip = {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 4);
        }
    };
    var plotOptions = {
        area: {
            pointStart: 0,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    };
    var labels = {
        formatter: function () {
            return this.value.toFixed(4); //这里是两位小数，你要几位小数就改成几
        },
        style: {
            color: 'black'
        }
    };
    var legend = {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        borderWidth: 0
    };
    var exporting = {
        enabled: false
    };
    var series = [{
            name: 'soc real',

        },
        {
            name: 'soc pre',

        },
    ];
    var json = {};
    json.chart = chart;
    json.title = title;
    json.tooltip = tooltip;
    json.xAxis = xAxis;
    json.yAxis = yAxis;
    json.legend = legend;
    json.exporting = exporting;
    json.series = series;
    json.plotOptions = plotOptions;
    json.labels = labels;

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    Highcharts.setOptions({
        colors: ['black', 'blue']
    });
    $('#container').highcharts(json);
}

var tid=0
function beginplot2(did, method_soc) {
    var chart = {
        type: 'spline',
        animation: Highcharts.svg,
        marginRight: 10,
        events: {
            load: function () {
                // set up the updating of the chart each second
                var series1 = this.series[0];
                console.log(this);
                b = setInterval(function () {
                    debugger
                    var q = dataT.startDateTime.replace(new RegExp("-", "gm"), "/");
                    var x= (new Date(q)).getTime()+tid*1000; //得到毫秒数
                    if (method_soc == "DLSTM") {
                        var y = parseFloat(dlstmE[did][id]); //current data 
                    } else if (method_soc == "LSTM") {
                        var y = parseFloat(lstmE[did][id]); //current data 
                    } else if (method_soc == "BP") {
                        var y = parseFloat(bpE[did][id]); //current data 
                    } else if (method_soc == "EKF") {
                        var y = parseFloat(ekfE[did][id]); //current data 
                    }
                    id++;
                    tid++;
                    series1.addPoint([x, y], true, false); //第一个true表示更新，第二个true表示是否保存前面数据
                }, 1000); //每隔一秒更新一次
            }
        }
    };
    var title = {
        text: '第' + did + '节电池' + method_soc + '方法误差'
    };
    var xAxis = {
        type: 'datetime',
        tickPixelInterval: 150,
        dateTimeLabelFormats: {
            month: '%Y-%m-%d %H:%M:%S'
        }
    };
    var yAxis = {
        title: {
            text: 'Value'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }],

    };
    var tooltip = {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 4);
        }
    };
    var plotOptions = {
        area: {
            pointStart: 0,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    };
    var labels = {
        formatter: function () {
            return this.value.toFixed(4); //这里是两位小数，你要几位小数就改成几
        },
        style: {
            color: 'black'
        }
    };
    var legend = {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        borderWidth: 0
    };
    var exporting = {
        enabled: false
    };
    var series = [{
        name: 'soc data',
    }, ];
    var credits = {
        enabled: false // 禁用版权信息
    }
    var json = {};
    json.chart = chart;
    json.title = title;
    json.tooltip = tooltip;
    json.xAxis = xAxis;
    json.yAxis = yAxis;
    json.legend = legend;
    json.exporting = exporting;
    json.series = series;
    json.plotOptions = plotOptions;
    json.labels = labels;
    json.credits = credits;
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    Highcharts.setOptions({
        colors: ['red']
    });
    $('#container2').highcharts(json);
}