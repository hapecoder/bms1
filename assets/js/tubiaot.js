var m = 17
var n = 17045
var Btemp = new Array();
for (var i = 0; i < m; i++) {
  Btemp[i] = new Array();
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

      fetch("http://10.115.120.178:8081/api/v1/B/search", {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                  'Content-Type': 'application/json',
              },
          }).then(response => response.json()).then(data => data.data)
          .then(function (data) {
              
              for (i = q; i < q+20; i++) {
                  Btemp[did].push(data[i].temp);
              }
          })
          .catch(err => console.log(err));
  }
  q=q+10
  return getdata
}
setInterval(getdata(),10000)

var id=0;
var num= 1;
var b;
$(document).ready(function() {  
    
    
    beginplot(1); 
    $(".dropdown-item").click(function(){
      var num=parseInt($(this).text());
      id=0;
      clearInterval(b);
      beginplot(num);
    }); 
}); 



function beginplot(did){
  var chart = {
    type: 'spline',
    animation: Highcharts.svg, 
    marginRight: 10,
    events: {
        load: function () {
            // set up the updating of the chart each second
            var series1 = this.series[0];
            b=setInterval(function () {
              let x = new Date().getTime();// current time
              let y = parseFloat(Btemp[did][id]);   //current data 
              id++;
              series1.addPoint([x, y], true, false);  //第一个true表示更新，第二个true表示是否保存前面数据
            }, 1000);         //每隔一秒更新一次
        }
      }
  };

 
  
  var title = {
      text: '第'+did+'节电池历史温度数据'
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
        Highcharts.numberFormat(this.y, 3);
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
  var series= [{
      name: 'temp data',
      
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
  
  
  
  Highcharts.setOptions({
      global: {
        useUTC: false
      }
  });
  Highcharts.setOptions({
    colors: ['black','blue']
  });
  $('#container').highcharts(json);
  Highcharts.setOptions({
    colors: ['red']
  });
} 