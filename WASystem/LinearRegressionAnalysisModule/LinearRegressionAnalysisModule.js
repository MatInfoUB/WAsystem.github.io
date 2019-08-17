// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
// takes in 2 data sets an X matrix and a Y options matrix. First it makes sure
// that the any invalid data is ignored, second it creates a dropdown menu that
// allows users to chose one of the y matrixes columns. When the user selects one
// and clicks submit it runs a multi linear regression equation on the X matrix
// the selected y matrix. It then displays the result on a 2d graph and a table
// in location. Does not need label or praticular keys
function runLinearRegressionAnalysisModule(location,inputData){
  function multiLinearRegressionMatrix(matrixY, matrixX){
    var matrixXTrans = math.transpose(matrixX);
    var a = math.inv(math.multiply(matrixXTrans,matrixX));
    var b = math.multiply(matrixXTrans,matrixY);
    var c = math.transpose(math.multiply(a,b));
    var result = math.zeros(1,matrixX.size()[0]);
    result = result.map(function(value, index, matrix){
      return  math.subset(c,math.index(0,0))*math.subset(matrixX,math.index(index[1],0))+math.subset(c,math.index(0,1))*math.subset(matrixX,math.index(index[1],1))+math.subset(c,math.index(0,2))*math.subset(matrixX,math.index(index[1],2));
    });
    var graphData = [result._data[0],math.transpose(matrixY)._data[0]];

    return graphData;
  }
  function addForm(location){
    var cont = document.createElement("select");
    cont.id = "select"+location.parentElement.moduleNumber;
    cont.style.width = "50%";
    cont.style.height = "25px";
    var i = 0;
    keys.forEach(function(e){
      var e1 = document.createElement("option");
      e1.value = i;
      e1.id = "option"+parseInt(location.id.substr(6,location.id.length));
      e1.innerHTML = e;
      cont.appendChild(e1);
      i++;
    });
    location.appendChild(cont);
    var button = document.createElement("button");
    button.value = "submit";
    button.id = "formButton"+parseInt(location.id.substr(6,location.id.length));
    button.innerHTML = "Submit";
    button.style.height = "25px";
    button.style.width = "50%";
    button.addEventListener('click', formButtonClicked);
    location.appendChild(button);
  }
  function formButtonClicked() {
    var position = location.parentElement.moduleNumber;
    var select = document.getElementById("select"+position);
    var result = parseInt(select.value,10);
    if (result != null) {
      var matrixY = math.subset(propertyDataList,math.index(math.range(0,propertyDataList.size()[0]),result));
      var graphData = math.round(multiLinearRegressionMatrix(matrixY,matrixX),4);
      if(dataSet1Keys[0].length != 0){
        var resultKeys = [dataSet1Keys[0][0],"x","y"];
      }else{
        var resultKeys = ["x","y"];
      }
      presentData(location,graphData,symbols,resultKeys);
      var data = {data:convertToCsv(resultKeys,math.transpose(graphData)),
                  name:moduleArray[position].moduleName+select.children[result].innerHTML+".csv"};
      createDataSlot(data);
    }
  }
  function presentData(location, dataArray, symbols, resultKeys){
    var graph = document.createElement("Div");
    graph.id = "graph"+location.parentElement.moduleNumber;
    graph.style.width = location.style.width;
    var heightOfParent = location.style.height.substr(0,location.style.height.indexOf("p"))-25;
    graph.style.height = (heightOfParent*.5)+"px";
    location.appendChild(graph);
    var data=[
      {
        color:'rgb(300,100,200)',
        type: 'scatter',
        x: dataArray[0],
        y: dataArray[1],
        mode: 'markers',
        type: 'scatter'
      }
    ];
    if(symbols.length == 0){
      data[0].text=symbols;
    }
    var layout = {
      margin: {
        l: 15,
        r: 0,
        b: 25,
        t: 0,
        pad: 0
      }
    };
    Plotly.newPlot(graph.id, data, layout)
    var table = document.createElement("Div");
    table.id = "table"+location.parentElement.moduleNumber;
    table.style.width = location.style.width;
    table.style.height = (heightOfParent*.5)+"px";
    location.appendChild(table);
    if(symbols.length != 0){
      dataArray.unshift(symbols);
    }
    var data = [{
      type: 'table',
      header: {
        values: resultKeys,
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
  var dataSet1 = math.clone(inputData[0]);
  var dataSet2 = math.clone(inputData[1]);
  var dataSet1Keys = catigorizeKeys(dataSet1);
  var dataSet2Keys = catigorizeKeys(dataSet2);
  for(var i=0;i<dataSet1.length;i++){
    if(isNaN(dataSet1[i][dataSet1Keys[1][0]])){
      dataSet1.splice(i,1);
      dataSet2.splice(i,1);
      i=i-1
    }
  }
  for(var i=0;i<dataSet2.length;i++){
    if(isNaN(dataSet2[i][dataSet2Keys[1][0]])){
      dataSet1.splice(i,1);
      dataSet2.splice(i,1);
      i=i-1
    }
  }
  var symbols = convertObjectStringToList(dataSet1);
  var keys = catigorizeKeys(dataSet2)[1];
  var propertyDataList = convertObjectDataToMatrix(dataSet2);
  var matrixX = math.matrix(convertObjectDataToMatrix(dataSet1));
  var length = matrixX.size()[1];
  addForm(location);
  return null;
}
