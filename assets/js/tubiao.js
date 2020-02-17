var m = 17
var n = 17045
var Bsoc = new Array();
for (var i = 0; i < m; i++) {
  Bsoc[i] = new Array();
}
var data = {
  "startDateTime":"2019-11-28 14:00:00",
  "endDateTime":"2019-11-28 14:11:00",
  "did":"1"
}
var q=0;
var getdata = function () {

  for (let did = 1; did < 17; did++) {
    data.did = did;

    fetch("http://10.115.120.178:8081/api/v1/B/search", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => response.json()).then(data => data.data)
      .then(function (data) {
        console.log(data);
        for (i = q; i < q+10; i++) {
          Bsoc[did].push(data[i].soc);
        }
      })
      .catch(err => console.log(err));
  }

  q=q+10;
  return getdata
}
setInterval(getdata(), 9000)


var num = 1;
var id = 0;
var b;
$(document).ready(function () {


  beginplot(1);
  beginplot2(1);
  $("#bchoose").click(function () {
    var num = parseInt($("#s1").val());
    id=0;
    clearInterval(b);
    beginplot(num);
    beginplot2(num);
  });
});



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
          let x = new Date().getTime(); // current time
          let y = parseFloat(Bsoc[did][id]); //current data 
          series1.addPoint([x, y], true, false); //第一个true表示更新，第二个true表示是否保存前面数据
          series2.addPoint([x, y + 0.01 * Math.random() - 0.005], true, false);
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
      name: 'soc data',
      // data: (function () {
      //   // generate an array of random data
      //   var data = [],
      //     time = (new Date()).getTime(),
      //     i;
      //   for (i = -5; i <= 0; i += 1) { //显示过去20个点
      //     data.push({
      //       x: time + i * 1000, //两个点之间间隔1秒
      //       y: Bsoc[did][0] // 0-1随机数
      //     });
      //   }
      //   return data;
      // }())
    },
    {
      name: 'soc grandtruth',
      // data: (function () {
      //   // generate an array of random data
      //   var data = [],
      //     time = (new Date()).getTime(),
      //     i;
      //   for (i = -5; i <= 0; i += 1) { //显示过去20个点
      //     data.push({
      //       x: time + i * 1000, //两个点之间间隔1秒
      //       y: Bsoc[did][0] // 0-1随机数
      //     });
      //   }
      //   return data;
      // }())
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


function beginplot2(did) {
  var chart = {
    type: 'spline',
    animation: Highcharts.svg,
    marginRight: 10,
    events: {
      load: function () {
        // set up the updating of the chart each second
        var series1 = this.series[0];
        console.log(this);
        b=setInterval(function () {
          let x = new Date().getTime(); // current time
          let y = parseFloat(Bsoc[did][id]); //current data 
          id++;
          series1.addPoint([x, y], true, false); //第一个true表示更新，第二个true表示是否保存前面数据
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
      name: 'soc data',
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
    colors: ['red']
  });
  $('#container2').highcharts(json);
}