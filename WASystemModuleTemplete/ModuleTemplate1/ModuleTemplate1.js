// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
//Main method that runs the function for standardization preposes
//it should have the following naming standard :
// run{module name}Module(location,inputData)
// location: is the module div html object where alll the graphs and
// tables would be put.
// inputData: is a list of javascript objects representing the csv files selected
// to keep generalitly if will be a list regardless of the number of csv files.
// The resulting data is packaged and returned.
function runModuleTemplate1Module(location,inputData) {
  // Uses plotly to create the table and append it to location
  function presentData(location,dataArray,keys){
    var table = document.createElement("Div");
    table.id = "table"+location.parentElement.moduleNumber;
    table.style.width = "100%";
    table.style.height = "100%";
    location.appendChild(table);
    var data = [{
      type: 'table',
      header: {
        values: keys,
      },
      cells: {
        values: dataArray,
      }
    }];
    layout = {
    margin: {
      l: 0,
      r: 15,
      t: 0,
      pad: 0
    }
    };
    Plotly.plot(table.id, data, layout);
  }
  var graphData = convertObjectDataToMatrix(inputData[0]);
  var keys = Object.keys(inputData[0][0]);
  presentData(location,graphData._data,keys);
  var result = {data:convertToCsv(keys,graphData._data),
                name:moduleArray[location.parentElement.moduleNumber].moduleName+".csv"};
  return result;
}
