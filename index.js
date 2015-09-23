import d3 from 'd3';
import nv from 'nvd3';
import axios from 'axios';
import getStarHistory from './getStarHistory';
require("babel-core/polyfill"); //??????????????????没有它会出错  http://babeljs.io/docs/usage/polyfill/

const getConfig = {
  params:{
    client_id: '4e4f2621589085b864d7',
    redirect_uri: 'http://www.timqian.com/star_history',
  },
};
(async function(){
  const res = await axios.get('https://github.com/login/oauth/authorize',getConfig).catch(function (err) {console.log(err);});
})();


let data = [];

d3.select("button").on("click", async function() {
  let repo = document.getElementById('repo').value
  repo = repo == '' ? 'petkaantonov/bluebird' : repo;
  console.log(repo);

  const starHistory = await getStarHistory(repo).catch(function(err) {
    console.log(err);
  });
  console.log(starHistory);

  // 新数据集
  data.push({
    key: repo,
    values: starHistory.map((item) => {
      return {
        x: new Date(item.date),
        y: Number(item.starNum)
      }
    }),
  });
  console.log(JSON.stringify(data));

  nv.addGraph(function() {
    var chart = nv.models.lineChart()
      .useInteractiveGuideline(true)
      .color(d3.scale.category10().range());

    chart.xAxis
      .tickFormat(function(d) {
        return d3.time.format('%x')(new Date(d))
      });

    chart.yAxis
      .axisLabel('Stars')
      .tickFormat(d3.format('d'));

    d3.select('#chart svg')
      .datum(data)
      .transition().duration(500)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
});
