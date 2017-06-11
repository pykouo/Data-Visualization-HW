d3.json("source/source.json", function(error, data) {
    if (error) {
        console.log(error);
    } else {

        //當事人序=1 依照氣候分
        var weather = d3.nest()
            .key(function(d) {
                return d.當事人序;
            })
            .sortKeys(d3.ascending)
            .key(function(d) {
                return d.天候;
            })
            .sortKeys(d3.ascending)
            .entries(data);
        var weatherData = [];
        var weatherType = ['其他', '暴雨', '強風', '雪', '雨', '陰', '晴'];
        for (let i = 0; i < weather[0].values.length; i++) {
            let cData = [];
            cData.push(weatherType[i]);
            cData.push(weather[0].values[i].values.length);
            weatherData.push(cData);
        }
        var chart1 = c3.generate({
            bindto: '#weather',
            data: {
                columns: weatherData,
                type: 'donut'
            },
            axis: {
                x: {
                    type: 'category'
                }
            }
        });

        // 依照是否有下雨
        var weatherData2 = [];
        var rainType = ['下雨日', '無下雨日']
        for (let i = 0; i < 2; i++) {
            let cData = [];
            if (i == 0) {
                cData.push(rainType[i]);
                cData.push(weather[0].values[1].values.length + weather[0].values[3].values.length + weather[0].values[4].values.length);
            } else {
                cData.push(rainType[i]);
                cData.push(weather[0].values[5].values.length + weather[0].values[6].values.length);
            }
            weatherData2.push(cData);
        }
        var chart2 = c3.generate({
            bindto: '#weather2',
            data: {
                columns: weatherData2,
                type: 'donut'
            },
            axis: {
                x: {
                    type: 'category'
                }
            }
        });

        //依照年紀
        var ageAmount = [];
        var manType = ['H01', 'H02', 'H03', ''];
        var age = d3.nest()
            .key(function(d) {
                return d.年齡;
            })
            .sortKeys(d3.ascending)
            .key(function(d) {
                return d.車種;
            })
            .sortKeys(d3.ascending)
            .entries(data);
        // console.log(age);
        for (let i = 0; i < age.length; i++) {
            for (let j = 0; j < age[i].values.length; j++) {
                //年紀>=0 除去異常值
                if (age[i].key >= 0 && age[i].key != '') {
                    //去除行人或其他
                    if (!manType.includes(age[i].values[j].key)) {
                        if (isNaN(ageAmount[age[i].key])) {
                            ageAmount[age[i].key] = 0;
                        }
                        ageAmount[age[i].key] += age[i].values[j].values.length;
                    }
                }
            }

        }
        // console.log(ageAmount);
        var ageSamllObj = [];
        var ageObj = []
        for (let i = 0; i < ageAmount.length; i++) {
            if (ageAmount[i] !== undefined) {
                // console.log(ageAmount[i]);
                let obj = {};
                obj.noOfAccident = ageAmount[i];
                obj.place = i;
                ageSamllObj.push(obj);
            }
        }
        // console.log(ageSamllObj);
        //分成9個年齡組
        var node0 = [],
            node1 = [],
            node2 = [],
            node3 = [],
            node4 = [],
            node5 = [],
            node6 = [],
            node7 = [],
            node8 = [];
        for (let i = 0; i < 9; i++) {
            let obj = {};
            obj.noOfAccident = 0;
            obj.place = '';
            // drilldown: '';
            ageObj.push(obj);
        }
        for (let i = 0; i < ageSamllObj.length; i++) {

            if (ageSamllObj[i].place < 12) {
                ageObj[0].noOfAccident += ageSamllObj[i].noOfAccident;
                ageObj[0].place = '未滿12歲';
                node0.push(ageSamllObj[i]);
            } else if (12 <= ageSamllObj[i].place && ageSamllObj[i].place < 18) {
                ageObj[1].noOfAccident += ageSamllObj[i].noOfAccident;
                ageObj[1].place = '12~17歲';
                // console.log(node1);
                node1.push(ageSamllObj[i]);
            } else if (18 <= ageSamllObj[i].place && ageSamllObj[i].place < 25) {
                ageObj[2].noOfAccident += ageSamllObj[i].noOfAccident;
                ageObj[2].place = '18~24歲';
                node2.push(ageSamllObj[i]);
            } else if (25 <= ageSamllObj[i].place && ageSamllObj[i].place < 35) {
                ageObj[3].noOfAccident += ageSamllObj[i].noOfAccident;
                ageObj[3].place = '25~34歲';
                node3.push(ageSamllObj[i]);
            } else if (35 <= ageSamllObj[i].place && ageSamllObj[i].place < 45) {
                ageObj[4].noOfAccident += ageSamllObj[i].noOfAccident;
                ageObj[4].place = '35~44歲';
                node4.push(ageSamllObj[i]);
            } else if (45 <= ageSamllObj[i].place && ageSamllObj[i].place < 55) {
                ageObj[5].noOfAccident += ageSamllObj[i].noOfAccident;
                ageObj[5].place = '45~54歲';
                node5.push(ageSamllObj[i]);
            } else if (55 <= ageSamllObj[i].place && ageSamllObj[i].place < 65) {
                ageObj[6].noOfAccident += ageSamllObj[i].noOfAccident;
                ageObj[6].place = '55~64歲';
                node6.push(ageSamllObj[i]);
            } else if (65 <= ageSamllObj[i].place && ageSamllObj[i].place < 70) {
                ageObj[7].noOfAccident += ageSamllObj[i].noOfAccident;
                ageObj[7].place = '65~69歲';
                node7.push(ageSamllObj[i]);
            } else if (70 <= ageSamllObj[i].place) {
                ageObj[8].noOfAccident += ageSamllObj[i].noOfAccident;
                ageObj[8].place = '70歲以上';
                node8.push(ageSamllObj[i]);
            }
        }
        // console.log(node0);
        ageObj[0].drilldown = node0;
        ageObj[1].drilldown = node1;
        ageObj[2].drilldown = node2;
        ageObj[3].drilldown = node3;
        ageObj[4].drilldown = node4;
        ageObj[5].drilldown = node5;
        ageObj[6].drilldown = node6;
        ageObj[7].drilldown = node7;
        ageObj[8].drilldown = node8;
        var ageAmountAccident = [];
        for (let i = 0; i <= ageObj.length; i++) {
            if (i == 0) {
                ageAmountAccident[i] = '車禍件數';
            } else {
                // console.log(i);
                // console.log(ageObj[i - 1].noOfAccident);

                ageAmountAccident[i] = ageObj[i - 1].noOfAccident;
            }
        }
        // console.log(ageAmountAccident);
        var chart3 = c3.generate({
            bindto: '#age',
            data: {
                x: 'x',
                columns: [
                    ['x', '未滿12歲', '12~17歲', '18~24歲', '25~34歲', '35~44歲', '45~54歲', '55~64歲', '65~69歲', '70歲以上'],
                    ageAmountAccident,
                ],
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 130
                }
            }
        });

        // console.log(ageObj);
        // var objAge = {};
        // for(let i=0;i<9;i++){
        //     objAge[i] = ageObj[i]

        // }
        // objAge = JSON.parse(JSON.stringify(ageObj));
        // console.log(objAge);
        // str = JSON.stringify(objAge);
        // console.log(str);
        // var config = {
        //     containerId: "age",
        //     width: 500,
        //     height: 500,
        //     data: objAge,
        //     heading: {
        //         text: "Medical Colleges in India",
        //         pos: "top"
        //     },
        //     label: function(d) {
        //         return d.data.place + ":" + d.data.noOfAccident;
        //     },
        //     value: "noOfAccident",
        //     inner: "drilldown",
        //     tooltip: function(d) {
        //         return "<div style='background-color: #e4e4e4; color: #000; padding: 15px; text-align: center; border: dotted 1px black;'><strong>" + d.place + "</strong> " + d.noOfAccident + "件車禍</div>";
        //     },
        //     transition: "linear",
        //     transitionDuration: 500,
        //     donutRadius: 50,
        //     gradient: true,
        //     colors: d3.scale.category20(),
        //     labelColor: "white",
        //     stroke: "#eee",
        //     strokeWidth: 3,
        //     drilldownTransition: "linear",
        //     drilldownTransitionDuration: 0,
        //     highlightColor: "#c00"
        // };
        // console.log('QQ');
        // var samplePie = new psd3.Pie(config);


        //性別年齡和車禍關係
        var sexAmount = [];
        // var manType = ['H01', 'H02', 'H03', ''];
        var sex = d3.nest()
            .key(function(d) {
                return d.性別;
            })
            .sortKeys(d3.ascending)
            .key(function(d) {
                return d.年齡;
            })
            .sortKeys(d3.ascending)
            .key(function(d) {
                return d.車種;
            })
            .sortKeys(d3.ascending)
            .entries(data);
        var mAmount = [],
            fAmount = [],
            oAmount = [];
        // console.log(sex);
        for (let i = 0; i < sex.length; i++) {
            if (sex[i].key == 1) {
                //男性
                for (let j = 0; j < sex[i].values.length; j++) {
                    //年紀>=0 除去異常值
                    if (sex[i].values[j].key >= 0 && sex[i].values[j].key != '') {
                        //去除行人或其他
                        for (let k = 0; k < sex[i].values[j].values.length; k++) {
                            // console.log(sex[i].values[j].values[k].key);
                            if (!manType.includes(sex[i].values[j].values[k].key)) {
                                if (isNaN(mAmount[sex[i].values[j].key])) {
                                    mAmount[sex[i].values[j].key] = 0;
                                }
                                mAmount[sex[i].values[j].key] += sex[i].values[j].values[k].values.length;
                            }
                        }
                    }
                }
            } else if (sex[i].key == 2) {
                //女性
                for (let j = 0; j < sex[i].values.length; j++) {
                    //年紀>=0 除去異常值
                    if (sex[i].values[j].key >= 0 && sex[i].values[j].key != '') {
                        //去除行人或其他
                        for (let k = 0; k < sex[i].values[j].values.length; k++) {
                            // console.log(sex[i].values[j].values[k].key);
                            if (!manType.includes(sex[i].values[j].values[k].key)) {
                                if (isNaN(fAmount[sex[i].values[j].key])) {
                                    fAmount[sex[i].values[j].key] = 0;
                                }
                                fAmount[sex[i].values[j].key] += sex[i].values[j].values[k].values.length;
                            }
                        }
                    }
                }
            } else {
                //其他
                for (let j = 0; j < sex[i].values.length; j++) {
                    //年紀>=0 除去異常值
                    if (sex[i].values[j].key >= 0 && sex[i].values[j].key != '') {
                        //去除行人或其他
                        for (let k = 0; k < sex[i].values[j].values.length; k++) {
                            // console.log(sex[i].values[j].values[k].key);
                            if (!manType.includes(sex[i].values[j].values[k].key)) {
                                if (isNaN(oAmount[sex[i].values[j].key])) {
                                    oAmount[sex[i].values[j].key] = 0;
                                }
                                oAmount[sex[i].values[j].key] += sex[i].values[j].values[k].values.length;
                            }
                        }
                    }
                }
            }

        }
        // console.log(mAmount);
        // console.log(fAmount);
        // console.log(oAmount);
        var m = ['', 0, 0, 0, 0, 0, 0, 0, 0, 0],
            f = ['', 0, 0, 0, 0, 0, 0, 0, 0, 0],
            o = ['', 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i <= mAmount.length; i++) {
            if (i == 0) {
                m[i] = '男性';
            } else {
                if (!isNaN(mAmount[i - 1])) {
                    if ((i - 1) < 12) {
                        m[1] += mAmount[i - 1];
                    } else if (12 <= (i - 1) && (i - 1) < 18) {
                        m[2] += mAmount[i - 1];
                    } else if (18 <= (i - 1) && (i - 1) < 25) {
                        m[3] += mAmount[i - 1];
                    } else if (25 <= (i - 1) && (i - 1) < 35) {
                        m[4] += mAmount[i - 1];
                    } else if (35 <= (i - 1) && (i - 1) < 45) {
                        m[5] += mAmount[i - 1];
                    } else if (45 <= (i - 1) && (i - 1) < 55) {
                        m[6] += mAmount[i - 1];
                    } else if (55 <= (i - 1) && (i - 1) < 65) {
                        m[7] += mAmount[i - 1];
                    } else if (65 <= (i - 1) && (i - 1) < 70) {
                        m[8] += mAmount[i - 1];
                    } else if (70 <= (i - 1)) {
                        m[9] += mAmount[i - 1];
                    }
                }

            }

        }
        for (var i = 0; i <= fAmount.length; i++) {
            if (i == 0) {
                f[i] = '女性';
            } else {
                if (!isNaN(fAmount[i - 1])) {
                    if ((i - 1) < 12) {
                        f[1] += fAmount[i - 1];
                    } else if (12 <= (i - 1) && (i - 1) < 18) {
                        f[2] += fAmount[i - 1];
                    } else if (18 <= (i - 1) && (i - 1) < 25) {
                        f[3] += fAmount[i - 1];
                    } else if (25 <= (i - 1) && (i - 1) < 35) {
                        f[4] += fAmount[i - 1];
                    } else if (35 <= (i - 1) && (i - 1) < 45) {
                        f[5] += fAmount[i - 1];
                    } else if (45 <= (i - 1) && (i - 1) < 55) {
                        f[6] += fAmount[i - 1];
                    } else if (55 <= (i - 1) && (i - 1) < 65) {
                        f[7] += fAmount[i - 1];
                    } else if (65 <= (i - 1) && (i - 1) < 70) {
                        f[8] += fAmount[i - 1];
                    } else if (70 <= (i - 1)) {
                        f[9] += fAmount[i - 1];
                    }
                }
            }

        }
        for (var i = 0; i <= oAmount.length; i++) {
            if (i == 0) {
                o[i] = '其他';
            } else {
                if (!isNaN(oAmount[i - 1])) {
                    if ((i - 1) < 12) {
                        o[1] += oAmount[i - 1];
                    } else if (12 <= (i - 1) && (i - 1) < 18) {
                        o[2] += oAmount[i - 1];
                    } else if (18 <= (i - 1) && (i - 1) < 25) {
                        o[3] += oAmount[i - 1];
                    } else if (25 <= (i - 1) && (i - 1) < 35) {
                        o[4] += oAmount[i - 1];
                    } else if (35 <= (i - 1) && (i - 1) < 45) {
                        o[5] += oAmount[i - 1];
                    } else if (45 <= (i - 1) && (i - 1) < 55) {
                        o[6] += oAmount[i - 1];
                    } else if (55 <= (i - 1) && (i - 1) < 65) {
                        o[7] += oAmount[i - 1];
                    } else if (65 <= (i - 1) && (i - 1) < 70) {
                        o[8] += oAmount[i - 1];
                    } else if (70 <= (i - 1)) {
                        o[9] += oAmount[i - 1];
                    }
                }
            }

        }

        var chart4 = c3.generate({
            bindto: '#sex',
            data: {
                x: 'x',
                columns: [
                    ['x', '未滿12歲', '12~17歲', '18~24歲', '25~34歲', '35~44歲', '45~54歲', '55~64歲', '65~69歲', '70歲以上'],
                    m, f, o,
                ],
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 130
                }
            }
        });
        var flag = false;
        $('#group').on('click', function() {
            if (!flag) {
                chart4.groups([
                    ['男性', '女性']
                ]);
                $('#group').text('將男女分開');
                flag = true;
            } else {
                chart4.groups([
                    ['男性'],
                    ['女性']
                ]);
                $('#group').text('將男女合併');
                flag = false;
            }


        });
        var flag2 = false;

        $('#pie').on('click', function() {
            if (!flag) {
                $('#pie').text('轉為長條圖');
                chart4.transform('pie');
                flag = true;
            } else {
                chart4.transform('bar');
                $('#pie').text('轉為圓餅圖');
                
                flag = false;
            }
        });
    }
});
