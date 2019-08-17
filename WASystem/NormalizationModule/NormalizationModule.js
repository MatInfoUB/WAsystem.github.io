// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
// Takes in 1 input data set and returns the normalied version of the data. It
// then displays the resulting data on a table in location.
// labels or specific keys are not needed
function runNormalizationModule(location,inputData) {
  function normalizeMatrix(matrix, type){
    //make list of columns means
    var numberOfRows = matrix.size()[0];
    var numberOfColumns = matrix.size()[1];
    var standardDeviation = 0;
    var mean = 0;
    if(type === 'population'){
      standardDeviation = math.std(matrix,0,'uncorrected');
      mean = math.mean(matrix,0);
    }
    else if(type === 'sample'){
      standardDeviation = math.std(matrix,0);
      mean = math.mean(matrix,0);
    }
    //use standard Deviation equation on all the columns
    var result = matrix.map(function(value,index, m){
      var m = math.subset(mean,math.index(index[1]));
      var sd = math.subset(standardDeviation,math.index(index[1]));
      return (value-m)/sd;
    });
    return result;
  }

  //helper methods
  function presentData(location,keys,dataArray){
    var table = document.createElement("Div");
    table.id = "table"+location.parentElement.moduleNumber;
    table.style.width = "100%";
    table.style.height = "100%";
    location.appendChild(table);
    var data = [{
      type: 'table',
      header: {
        values: keys,
        align: "center",
        line: {width: 1, color: 'black'},
        fill: {color: "grey"},
        font: {family: "Arial", size: 12, color: "white"}
      },
      cells: {
        values: dataArray,
        align: "center",
        line: {color: "black", width: 1},
        font: {family: "Arial", size: 10, color: ["black"]}
      }
    }];
    var layout = {
    margin: {
      l: 0,
      r: 15,
      b: 0,
      t: 0,
      pad: 0
    }
    };
    Plotly.plot(table.id, data,layout);
  }
  var keys = Object.keys(inputData[0][0]);
  var symbols = convertObjectStringToList(inputData[0]);
  var fullDataMatrix = convertObjectDataToMatrix(inputData[0]);
  var result = normalizeMatrix(fullDataMatrix,'sample');
  var fullDataList = math.transpose(result)._data;
  fullDataList = math.round(fullDataList,4);
  if(symbols != 0){
    fullDataList.unshift(symbols);
  }
  presentData(location,keys,fullDataList);
  var result = {data:convertToCsv(keys,math.transpose(fullDataList)),
              name:moduleArray[location.parentElement.moduleNumber].moduleName+".csv"};
  return result;
}
