// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
// Takes in one input data and displays a text box asking for an n value. when
// the user clicks submit it runs the isomaps script on the data. The result is
// displayed on a 3d surface map and a table in location.
function runVolcanoPlotModule(location,inputData) {
  var isomapResult;
  var nullSymbols = [];
  var graphData;
  var keys;
  function addForm(){
    var l1 = document.createElement("label");
    l1.innerHTML ="n size:";
    location.appendChild(l1);
    var e1 = document.createElement("input");
    e1.id = "form"+location.parentElement.moduleNumber;
    l1.style.width = "50%";
    l1.style.height = "25px";
    l1.appendChild(e1);
    location.appendChild(l1);
    var button = document.createElement("button");
    button.value = "submit";
    button.id = "formButton"+location.parentElement.moduleNumber;
    button.innerHTML = "Submit";
    button.style.height = "25px";
    button.style.width = "50%";
    button.addEventListener('click', formButtonClicked);
    location.appendChild(button);
  }
  function formButtonClicked() {
    var nValue = parseInt(document.getElementById("form"+location.parentElement.moduleNumber).value,10);
    if (nValue>=0) {
      var fullDataMatrix = convertObjectDataToMatrix(inputData[0]);
      var euclidianFullDataMatrix = L2_distance(fullDataMatrix)
      isomapResult = isomap(euclidianFullDataMatrix,'epsilon',nValue,{});
      var symbols = convertObjectStringToList(inputData[0]);
      graphData = math.round(isomapResult.Y.coords[2],4);
      isomapResult.Y.removedValues.forEach(function(i){
        nullSymbols.push(symbols[i]);
        symbols.splice(i,1);
      });
      var inputKeys = catigorizeKeys(inputData[0]);
      if(inputKeys[0].length == 0){
        keys = ["x","y","z"];
      }else{
        keys = [inputKeys[0][0],"x","y","z"];
      }
      presentData(location,graphData,symbols);
      var data = {data:convertToCsv(keys,math.transpose(graphData)),
                  name:moduleArray[location.parentElement.moduleNumber].moduleName+".csv"};
      createDataSlot(data);
    }
  }
  function presentData(location,dataArray,symbols){
    var graph = document.createElement("Div");
    graph.id = "graph"+location.parentElement.moduleNumber;
    var height = ((location.style.height.substr(0,location.style.height.indexOf("p"))-25)/2)+"px";
    graph.style.width = "100%";
    graph.style.height = height;
    location.appendChild(graph);
    var data=[
      {
        opacity:0.8,
        color:'rgb(300,100,200)',
        type: 'mesh3d',
        x: dataArray[0],
        y: dataArray[1],
        z: dataArray[2],
      }
    ];
    if(symbols != 0){
      data[0].text = symbols
    }
    var layout = {
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    }
    };
    Plotly.newPlot(graph.id, data,layout);
    var j = 0;
    isomapResult.Y.removedValues.forEach(function(i){
      symbols.splice(i,0,nullSymbols[j]);
      j++;
      graphData[0].splice(i,0,NaN);
      graphData[1].splice(i,0,NaN);
      graphData[2].splice(i,0,NaN);
    });
    var table = document.createElement("Div");
    table.id = "table"+location.parentElement.moduleNumber;
    table.style.width = location.style.width;
    table.style.height = height;
    location.appendChild(table);
    if(symbols != 0){
      dataArray.unshift(symbols);
    }
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
  // var fullDataMatrix = convertObjectDataToMatrix(inputData[0]);
  // var euclidianFullDataMatrix = L2_distance(fullDataMatrix)
  // var isomapResult = isomap(euclidianFullDataMatrix,'epsilon',4,{});
  // var symbols = convertObjectStringToList(inputData[0]);
  // var graphData = math.round(isomapResult.Y.coords[2],4);
  // var nullSymbols = [];
  // isomapResult.Y.removedValues.forEach(function(i){
  //   nullSymbols.push(symbols[i]);
  //   symbols.splice(i,1);
  // });
  // var inputKeys = catigorizeKeys(inputData[0]);
  // if(inputKeys[0].length == 0){
  //   var keys = ["x","y","z"];
  // }else{
  //   var keys = [inputKeys[0][0],"x","y","z"];
  // }
  // presentData(location,graphData,symbols);
  // var result = {data:convertToCsv(keys,math.transpose(graphData)),
  //             name:moduleArray[location.parentElement.moduleNumber].moduleName+".csv"};
  // return result;
  addForm();
  return null;
}
