/**
 * Created by mac on 18/4/12.
 */

var myChart = echarts.init(document.getElementById('scgk'));

// 指定图表的配置项和数据
var option0 = {
    legend: {
        right:0,
        itemWidth:10,
        itemHeight:10,
    },
    tooltip: {},
    dataset: {
        source: [
            ['product', '电厂', '溶出', '燃料'],
            ['2018-03-01', 14, 9, 12],
            ['2018-03-02', 8, 10, 12],
            ['2018-03-03', 11, 8, 6],
            ['2018-03-04', 12, 11, 10],
            ['2018-03-05', 12, 11, 10],
            ['2018-03-06', 10, 4, 14],
            ['2018-03-07', 6, 10, 5],
        ]
    },
    xAxis: {
        type: 'category',
        splitNumber:100,
        axisLine:{
            show:true,
            lineStyle:{
                color:"#cacaca"
            }
        },
        axisTick: {
            show: false
        },
        splitLine:{
            show:false
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#000',
                fontSize:'12'
            }
        },
    },
    yAxis: {
        axisLine:{
            show:true,
            lineStyle:{
                color:"#cacaca"
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#000',
                fontSize:'12'
            }
        },
        splitLine:{
            show:false
        }
    },
    color:["#33dad2","#59aeee","#b0a4d6"],
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
        {type: 'bar',barWidth:14},
        {type: 'bar',barWidth:14},
        {type: 'bar',barWidth:14}
    ]
};
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option0);

var myChart1 = echarts.init(document.getElementById('cpgk'));

var option1 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['分解','熔烧','煤气站'],
        right:0,
        itemWidth:10,
        itemHeight:10,
    },
    grid: {
        left: '5%',
        right: '4%',
        bottom: '10%',
        containLabel: false
    },
    color:["#3ddcd4","#59aeee","#b4a8d8"],
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2018-03-01','2018-03-02','2018-03-03','2018-03-04','2018-03-05','2018-03-06','2018-03-07']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'分解',
            type:'line',
            stack: '',
            data:[10, 10, 8, 7, 6, 8, 9],
            smooth: true
        },
        {
            name:'熔烧',
            type:'line',
            stack: '',
            data:[14, 16, 15, 14, 12, 10, 9],
            smooth: true
        },
        {
            name:'煤气站',
            type:'line',
            stack: '',
            data:[6, 8, 11, 13, 11, 15, 12],
            smooth: true
        }
    ]
};

myChart1.setOption(option1);

var myChart2 = echarts.init(document.getElementById('cbgk'));

var option2 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        x: 'right',
        itemWidth:10,
        itemHeight:10,
        data:['主材消耗','辅材消耗','动力消耗','跑冒滴漏']
    },
    color:["#33dad2","#59aeee","#b0a4d6","#929292"],
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['20%', '50%'],
            avoidLabelOverlap: true,
            label: {

                normal: {
                    position:"outside",
                    show: true,
                    formatter: '{b}: {c}({d}%)'

                }
            },
            labelLine: {
                normal: {
                    show: true,
                    length:20
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            data:[
                {value:335, name:'主材消耗'},
                {value:310, name:'辅材消耗'},
                {value:234, name:'动力消耗'},
                {value:135, name:'跑冒滴漏'}
            ]
        }
    ]
};
myChart2.setOption(option2);



/*myChart3.setOption(option3);
var myChart3 = echarts.init(document.getElementById('zc-item1'));
var labelTop = {//上层样式
    normal : {
        color :'#59aeee',
        label : {
            show : true,
            position : 'center',
            formatter : '{b}',
            textStyle: {
                baseline : 'center',
                fontSize:14
            }
        },
        labelLine : {
            show : false
        }
    }
};
var labelFromatter = {//环内样式
    normal : {//默认样式
        label : {//标签
            formatter : function (a,b,c){return 100 - c + '%'},
            // labelLine.length：30,  //线长，从外边缘起计算，可为负值
            textStyle: {//标签文本样式
                color:'black',
                align :'center',
                baseline : 'center'//垂直对其方式
            }
        }
    },
};

var labelBottom = {//底层样式
    normal : {
        color: '#ddd',
        label : {
            show : false,
            position : 'center',
            fontSize:20
        },
        labelLine : {
            show : false
        }
    },
    emphasis: {//悬浮式样式
        color: '#929292'
    }
};
var radius = [70,80];// 半径[内半径，外半径]

var option3 = {
    animation:false,
    title:{
        text:'矿耗',
        bottom:"15%",
        left:"center",
        textStyle:{
            fontSize:"14"
        }
    },
    tooltip : {         // 提示框. Can be overwrited by series or data
        trigger: 'axis',
        //show: true,   //default true
        showDelay: 0,
        hideDelay: 50,
        transitionDuration:0,
        borderRadius : 8,
        borderWidth: 2,
        padding: 10,    // [5, 10, 15, 20]
    },
    series : [
        {
            type : 'pie',
            center : ['50%', '50%'],//圆心坐标（div中的%比例）
            radius : radius,//半径
            x: '0%', // for funnel
            itemStyle : labelTop,//graphStyleA,//图形样式 // 当查到的数据不存在（并非为0），此属性隐藏
            clockWise:false,
            data : [
                {name:'矿耗', value:100,itemStyle : labelBottom},
                {name:'50%', value:50, itemStyle :labelTop }
            ]
        }
    ]
};

myChart3.setOption(option3);*/


function renderRing(id,styleArr){
    var myChartItem =  echarts.init(document.getElementById(id));
    var labelFromatter = {//环内样式
        normal : {//默认样式
            label : {
                show : true,
                position : 'center',
                formatter : function (params){  if(params.dataIndex == 1){
                    return (params.percent)+"%";
                }},
                textStyle: {
                    baseline : 'center',
                    fontSize:14
                }
            },
        },
    };
    var labelTop = {//上层样式
        normal : {
            color :styleArr[0],
            label : {
                show : true,
                position : 'center',
                formatter : '{b}',
                textStyle: {
                    baseline : 'center',
                    fontSize:14
                }
            },
            labelLine : {
                show : false
            }
        }
    };
    var labelBottom = {//底层样式
        normal : {
            color: '#ddd',
            /*label : {
                show : false,
                position : 'center',
                fontSize:0
            },
            labelLine : {
                show : false
            }*/
        },
        emphasis: {//悬浮式样式
            color: '#929292'
        }
    };
    var radius = [55,62];// 半径[内半径，外半径]


    var option = {
        animation:false,
        title:{
            text:styleArr[1],
            bottom:"15%",
            left:"center",
            textStyle:{
                fontSize:"14"
            }
        },
       /* tooltip : {         // 提示框. Can be overwrited by series or data
            trigger: 'axis',
            //show: true,   //default true
            showDelay: 0,
            hideDelay: 50,
            transitionDuration:0,
            borderRadius : 8,
            borderWidth: 2,
            padding: 10,    // [5, 10, 15, 20]
        },*/
        series : [
            {
                type : 'pie',
                center : ['50%', '50%'],//圆心坐标（div中的%比例）
                radius : radius,//半径
                x: '0%', // for funnel
                itemStyle : labelFromatter,//graphStyleA,//图形样式 // 当查到的数据不存在（并非为0），此属性隐藏
                clockWise:false,
                selectedMode: null,
                data : [
                    {name:"", value:styleArr[2],itemStyle : labelBottom},
                    {name:"已完成", value:styleArr[3], itemStyle :labelTop }
                ]
            }
        ]
    };

    myChartItem.setOption(option);
}


renderRing("zc-item1",["#59aeee","矿耗","75","25"]);
renderRing("zc-item2",["#b0a4d6","碱耗","50","50"]);
renderRing("zc-item3",["#929292","灰耗","25","75"]);

renderRing("dl-item1",["#59aeee","气耗","20","80"]);
renderRing("dl-item2",["#b0a4d6","电耗","40","60"]);
renderRing("dl-item3",["#929292","煤耗","50","50"]);



var myChart3 =  echarts.init(document.getElementById("fcxh"));

var option3 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        x: 'right',
        itemWidth:10,
        itemHeight:10,
        data:['原料工序','加球加棒','溶出工序','絮凝剂','分解工序','滤布','脱水胶','阻垢剂']
    },
    color:["#33dad2","#59aeee","#b0a4d6","#19cdc4","#00bbb2","#05a39b","#2598ee","#9883dc"],
    series: [
        {
            name:'访问来源',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:1648, name:'分解工序'},
                {value:679, name:'溶出工序'},
                {value:335, name:'原料工序'}
            ]
        },
        {
            name:'',
            type:'pie',
            radius: ['45%', '55%'],
            label: {
                normal: {
                    formatter: '{b|{b}:}{c} {per|{d}%}',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    padding: [0, 4],
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center',
                            fontSize: 12,
                        },
                        // abg: {
                        //     backgroundColor: '#333',
                        //     width: '100%',
                        //     align: 'right',
                        //     height: 22,
                        //     borderRadius: [4, 4, 0, 0]
                        // },
                        hr: {
                            borderColor: 'red',
                            width: '100%',
                            borderWidth:0,
                            height: 0
                        },
                        b: {
                            fontSize: 14,
                            lineHeight: 24,
                        },
                        d: {
                            fontSize: 14,
                            lineHeight: 24,
                        },
                        per: {
                            color: '#000',
                            backgroundColor: 'transparent',
                            padding: [2, 4],
                            lineHeight:24,
                            borderRadius: 2
                        }
                    }
                }
            },
            data:[
                {value:375, name:'滤布'},
                {value:1048, name:'脱水胶'},
                {value:235, name:'阻垢剂'},
                {value:679, name:'絮凝剂'},
                {value:335, name:'加球加棒'},
            ]
        }
    ]
};
myChart3.setOption(option3);


function renderTableData(tableData){
    $('#treeTable').dataTable({
        "bPaginate": false,
        "bAutoWidth": false,
        "bDestroy":true,
        "paging": false,
        "bProcessing": true,
        "searching": false, //禁用aa原生搜索
        "info": false,  //底部文字
        "order": [],
        "aoColumnDefs": [
            {"bSortable": false}
        ],
        "oLanguage": lang,
        "data":tableData,
        //定义列 宽度 以及在json中的列名
        "aoColumns": [
            {"data": "name",'sClass':"alignCenter ","sWidth":"30%"},
            {"data": "content",'sClass':"alignCenter ","sWidth":"70%"}

        ]
    });

}



