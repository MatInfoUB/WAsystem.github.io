// last modified:8/17/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
//Takes in 1 input data and location and runs the Similarity equation on the data
// the results are then displayed in a 2d graph and table.
//The input data does not need labels or praticular keys
function runSimilarityModule(location,inputData){
  function createGraph(newData,location,symbols, resultingKeys){
    var graph = document.createElement("Div");
    graph.id = "graph"+location.parentElement.moduleNumber;
    graph.style.width = location.style.width;
    graph.style.height = "50%";
    location.appendChild(graph);
    var trace1 = {
    x: newData[0],
    y: newData[1],
    mode: 'markers',
    type: 'scatter'
    };
    var layout = {
      title: {text: 'Similarity Module'},
      xaxis: {title: {text: 'prinicpal component 1'}},
      yaxis: {title: {text: 'prinicpal component 2'}},
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0
      }
    };
    var data = [trace1];
    Plotly.newPlot(graph.id, data, layout);
    var table = document.createElement("Div");
    table.style.width = "100%";
    table.style.height = "50%";
    table.id = "table"+location.parentElement.moduleNumber;
    location.appendChild(table);
    if(keys[0].length != 0){
      newData.unshift(symbols);
    }
    var data = [{
      type: 'table',
      header: {
        values: resultingKeys,
        align: "center",
        line: {width: 1, color: 'black'},
        fill: {color: "grey"},
        font: {family: "Arial", size: 12, color: "white"}
      },
      cells: {
        values: newData,
        align: "center",
        line: {color: "black", width: 1},
        font: {family: "Arial", size: 10, color: ["black"]}
      }
    }];
    layout = {
      margin: {
        l: 0,
        r: 15,
        b: 0,
        t: 0,
        pad: 0
      }
    };
    Plotly.plot(table.id, data, layout);
  }
  function concatData(dataA,dataB){
    var d = dataA.concat(dataB);
    return dataA.concat(dataB);
  }
  function processData(data){
    var p = math.matrix(numeric.eig(covariance(data)._data).E.x);

    var pT = math.transpose(p);
    var T = math.divide(data,pT);
    var result = math.zeros(T.size()[0],2);
    for(var i=1;i<3;i++){
      var pColumn = math.abs(math.subset(T, math.index(math.range(0,result.size()[0]),i)));
      var tColumn = math.abs(math.subset(T, math.index(math.range(0,result.size()[0]),0)));
      var columnSum = math.multiply(math.transpose(tColumn),pColumn)._data[0];
      for(var j=0;j<T.size()[0];j++){
        var a = math.subset(T,math.index(j,0))*math.subset(T,math.index(j,i));
        var b = a/columnSum;
        var value = (math.subset(T,math.index(j,i))*math.subset(T,math.index(j,0)))/columnSum;
        result.subset(math.index(j,i-1),value);
      }
    }
    return math.transpose(result)._data;
  }
  var fullDataList = processData(convertObjectDataToMatrix(inputData[0]));
  fullDataList = math.round(fullDataList,4);
  var keys = catigorizeKeys(inputData[0]);
  var resultingKeys;
  if(keys[0].length!=0){
    resultingKeys = [keys[0][0]];
  }
  resultingKeys.push("x");
  resultingKeys.push("y");
  var symbols = convertObjectStringToList(inputData[0]);
  createGraph(fullDataList,location,symbols,resultingKeys);
  var result = {data:convertToCsv(resultingKeys,math.transpose(fullDataList)),
              name:moduleArray[location.parentElement.moduleNumber].moduleName+".csv"};
  return result;
}
