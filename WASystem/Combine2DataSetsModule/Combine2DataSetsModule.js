// last modified:8/17/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
// Takes in 2 input datasets and returns a combined version of the 2 data sets.
// addtionally it will display table in the module
// labels or specific keys are not needed
function runCombine2DataSetsModule(location,inputData) {
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
  function concatData(dataA,dataB){
    var d = dataA.concat(dataB);
    return dataA.concat(dataB);
  }

  var fullDataList = concatData(math.clone(inputData[0]),math.clone(inputData[1]));
  var symbols = convertObjectStringToList(fullDataList);
  var keys = catigorizeKeys(fullDataList);
  fullDataList = math.transpose(convertObjectDataToMatrix(fullDataList)._data);
  if(keys[0].length != 0){
    fullDataList.unshift(symbols);
  }
  presentData(location,keys[0].concat(keys[1]),fullDataList);
  var result = {data:convertToCsv(keys[0].concat(keys[1]),math.transpose(fullDataList)),
              name:moduleArray[location.parentElement.moduleNumber].moduleName+".csv"};
  return result;
}
