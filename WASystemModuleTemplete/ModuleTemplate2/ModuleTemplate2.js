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
// In this case it returns null since the resulting data requires addional user
// interaction.
function runModuleTemplate2Module(location,inputData){
  // Creates a button and adds it to location
  function addForm(location){
    var button = document.createElement("button");
    button.value = "submit";
    button.id = "formButton"+parseInt(location.id.substr(6,location.id.length));
    button.innerHTML = "Submit";
    button.style.height = "25px";
    button.addEventListener('click', formButtonClicked);
    location.appendChild(button);
  }
  // Is button listener for above button, runs the present data method and packages
  // the data and runs it though the createDataSlot method which save and tracks the
  // data.
  function formButtonClicked() {
    presentData(location,graphData._data,keys);
    var data = {data:convertToCsv(keys,graphData._data),
                name:moduleArray[location.parentElement.moduleNumber].moduleName+".csv"};
    createDataSlot(data);
  }
  // Uses plotly to create the table and append it to location
  function presentData(location,dataArray,keys){
    var table = document.createElement("Div");
    table.id = "table"+location.parentElement.moduleNumber;
    table.style.width = "100%";
    var heightOfParent = location.style.height.substr(0,location.style.height.indexOf("p"))-25;
    table.style.height = (heightOfParent)+"px";
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
  addForm(location);
  return null;
}
