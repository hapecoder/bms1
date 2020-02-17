var gcurr = []
var url = "http://10.115.120.178:8081/api/v1/group/page";
var reqtime = 1
var getdata = function () {
  reqtime++;
  fetch(url + "?page=" + reqtime + "&size=10", {
      method: 'get'
    }).then(response => response.json()).then(data => data.data.data)
    .then(function (data) {
      console.log(data);
      for (i = 0; i < 10; i++) {
        gcurr.push(data[i].groupCurr);
      }
    })
    .catch(err => console.log(err));
  return getdata
}
setInterval(getdata(), 10000)


var num = 1;
var id = 0;

$(document).ready(function () {


  beginplot(1);

});



function beginplot(batx) {
  var chart = {
    type: 'spline',
    animation: Highcharts.svg,
    marginRight: 10,
    events: {
      load: function () {
        // set up the updating of the chart each second
        var series1 = this.series[0];

        setInterval(function () {
          let x = new Date().getTime(); // current time
          let y = parseFloat(gcurr[id]); //current data 
          id++;
          series1.addPoint([x, y], true, false); //第一个true表示更新，第二个true表示是否保存前面数据

        }, 1000); //每隔一秒更新一次
      }
    }
  };



  var title = {
    text: '电池组历史电流数据'
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
    }]
  };
  var tooltip = {
    formatter: function () {
      return '<b>' + this.series.name + '</b><br/>' +
        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
        Highcharts.numberFormat(this.y, 2);
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
    name: 'curr data',
 
  }, ];




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



  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });
  Highcharts.setOptions({
    colors: ['black', 'blue']
  });
  $('#container').highcharts(json);
  Highcharts.setOptions({
    colors: ['red']
  });
}