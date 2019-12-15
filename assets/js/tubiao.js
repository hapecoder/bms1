mydata = {
	"name":"bms",
	"battery": {
        "1":{"u":"30",
             "i":"-1",
             "soc":"97"   
            },
        "2":{"u":"20",
            "i":"-1.1",
            "soc":"96"   
           },
        "3":{"u":"10",
           "i":"-1.1",
           "soc":"95"   
          },
	}
}

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
    return getdata
}
setInterval(getdata(),10000)


var num= 1;
var id=0
$(document).ready(function() {  
    

    beginplot(1);
    $(".dropdown-item").click(function(){
      var num=parseInt($(this).text());
      console.log(num)
      $('#container').highcharts();  
      beginplot(num);
    }); 
}); 



function beginplot(batx){
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
              var x = (new Date()).getTime(), // current time
              y = parseInt(mydata.battery[batx]["soc"])-Math.random();   //current data 
              
              series1.addPoint([x, y], true, false);  //第一个true表示更新，第二个true表示是否保存前面数据
              series2.addPoint([x, y+Math.random()], true, false);
            }, 1000);         //每隔一秒更新一次
        }
      }
  };

  var chart1 = {
    type: 'spline',
    animation: Highcharts.svg, 
    marginRight: 10,
    
    events: {
        load: function () {
           console.log(this);
            // set up the updating of the chart each second
            var series = this.series[0];
            
            setInterval(function () {
              var x = (new Date()).getTime(), // current time
              y = 0.05*Math.random();   //current data 
              series.addPoint([x, gsoc[gsoc.length-1]+Math.random()], true, false);  //第一个true表示更新，第二个true表示是否保存前面数据
            }, 1000);         //每隔一秒更新一次
        }
      }
  };
  
  var title = {
      text: '第'+batx+'节电池实时SOC数据'
  };   
  var title1 = {
    text: '第'+batx+'节电池SOC误差'
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
  var series= [{
      name: 'soc data',
      data: (function () {
        // generate an array of random data
        var data = [],time = (new Date()).getTime(),i;
        for (i = -19; i <= 0; i += 1) {          //显示过去20个点
            data.push({
              x: time + i * 1000,           //两个点之间间隔1秒
              y: parseInt(mydata.battery[batx]["soc"])-0.05*i*Math.random()              // 0-1随机数
            });
        }
        return data;
      }())    
  },
  {
    name: 'soc grandtruth',
    data: (function () {
      // generate an array of random data
      var data = [],time = (new Date()).getTime(),i;
      for (i = -19; i <= 0; i += 1) {          //显示过去20个点
          data.push({
            x: time + i * 1000,           //两个点之间间隔1秒
            y: parseInt(mydata.battery[batx]["soc"])+0.05*i*Math.random()              // 0-1随机数
          });
      }
      return data;
    }())    
  },];

  var series3= [
   {
    name: 'soc error',
    data: (function () {
      // generate an array of random data
      var data = [],time = (new Date()).getTime(),i;
      for (i = -19; i <= 0; i += 1) {          //显示过去20个点
          data.push({
            x: time + i * 1000,           //两个点之间间隔1秒
            y: gsoc[0]            // 0-1随机数
          });
      }
      return data;
    }())    
  }
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
  
  var json1 = {};   
  json1.chart = chart1; 
  json1.title = title1;     
  json1.tooltip = tooltip;
  json1.xAxis = xAxis;
  json1.yAxis = yAxis; 
  json1.legend = legend;  
  json1.exporting = exporting;   
  json1.series = series3;
  json1.plotOptions = plotOptions;
  
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
  $('#container2').highcharts(json1);
}

