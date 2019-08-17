// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
// takes in 2 sets of input data the first is the main data set and the second
// is the data set to be integrated into the first using an average of its
// compisite parts. It then displays the resulting table in location.
// Both data sets need a label column, the second data set must
// have the following keys element0,percent0,element1,percent1,...elementx,percentx
function runDescriptorScalingModule(location,inputData) {
  //helper methods
  function createNewSymbol(listOfElementsInComposition){
    var newSymbol="";
    for(var i = 0; i<(listOfElementsInComposition.length); i=i+2){
      newSymbol=newSymbol+listOfElementsInComposition[i]['Symbol'];
    }
    return newSymbol;
  }
  function getAverage(listOfElementsInComposition,propertyName){
    var result = 0.0;
    var property = 0.0;
    var percentage = 0.0;
    for(var i = 0 ;i<listOfElementsInComposition.length;i++){
      if((i%2)==0){
        property = listOfElementsInComposition[i][propertyName];
      }else{
        percentage = listOfElementsInComposition[i]
        result = result + property*percentage;
      }
    }
    result = result/(listOfElementsInComposition.length/2);
    return result;
  }

  function compareData(composition){
    var listOfProperites = keys[1];
    var listOfElementDataInComposition = [];
    var listOfElementNamesInComposition = [];
    var numberOfElementsInComposition = (Object.keys(composition).length)/2;
    for(var i = 0;i<numberOfElementsInComposition;i++){
      var row = organizedMatrixDataSet[composition["Element"+i]];
      if(row != null){
        listOfElementDataInComposition.push(math.multiply(row,composition['Percent'+i]));
        listOfElementNamesInComposition.push(composition["Element"+i]);
      }
    }
    var newCompoundData={};
    for(var i = 0;i<listOfElementDataInComposition[0].length;i++){
      var sum = 0;
      for (var j = 0; j < listOfElementDataInComposition.length; j++) {
        sum = sum + listOfElementDataInComposition[j][i];
      }
      newCompoundData[listOfProperites[i]] = (sum/numberOfElementsInComposition).toFixed(4);
    }
    newCompoundData[keys[0][0]]=listOfElementNamesInComposition.join("");
    // for(var i = 1;i<listOfProperites.length;i++){
    //   newCompoundData[listOfProperites[i]]=getAverage(listOfElementsInComposition,listOfProperites[i]).toFixed(4).toString(10);
    // }
    return newCompoundData;
  }
  //required methods

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

  var fullDataList=[];
  var keys=[];
  var newData = [];
  var data=inputData[1];
  var keys = catigorizeKeys(data);
  var matrixDataSet = convertObjectDataToMatrix(data);
  var symbols = convertObjectStringToList(data);
  var organizedMatrixDataSet = [];
  for(var i=0; i<matrixDataSet.size()[0]; i++){
    organizedMatrixDataSet[symbols[i]] = matrixDataSet.subset(math.index(i,math.range(0,matrixDataSet.size()[1])))._data[0];
  }
  for(var i=0; i<inputData[0].length; i++){
    var row = inputData[0][i];
    newData.push(compareData(row));
  }
  var fullDataList = data.concat(newData);
  keys = Object.keys(fullDataList[0]);
  symbols = convertObjectStringToList(fullDataList);
  fullDataList = math.transpose(convertObjectDataToMatrix(fullDataList))._data;
  fullDataList.unshift(symbols);
  presentData(location,keys,fullDataList);
  var result = {data:convertToCsv(keys,math.transpose(fullDataList)),
              name:moduleArray[location.parentElement.moduleNumber].moduleName+".csv"};
  return result;
}
