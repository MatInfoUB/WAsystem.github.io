// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
// NOTE: WA stands for Without Acronyme please find a better name
moduleArray=[];
dataArray=[];
// takes in csv object and returns a 2d array of all data columns
function convertObjectDataToMatrix(objectToList){
  var arrayOfData=[];
  for(var i=0;i<objectToList.length;i++){
    var row = [];
    for (var key in objectToList[i]) {
      var val = objectToList[i][key];
      if((!isNaN(+val) && isFinite(val))){
        if((typeof val) === "string"){
          val = parseFloat(val,10);
        }
        row.push(val);
      }
    }
    arrayOfData.push(row);
  }
  return math.matrix(arrayOfData);
}
// takes in csv object and returns a 2d array of all text columns
function convertObjectStringToList(objectToList){
  var arrayOfString=[];
  for(var i=0;i<objectToList.length;i++){
    for (var key in objectToList[i]) {
      var val = objectToList[i][key];
      if(!(!isNaN(+val) && isFinite(val))){
          arrayOfString.push(val);
      }
    }
  }
  return arrayOfString;
}
//takes in csv object and returns 2 lists of keys, the first is all the keys
//that have text in their column, the second all the keys with data in their
//columns
function catigorizeKeys(data){
  var dataColumns = Object.keys(data[0]);
  var keysColumns = [];
  for(var i=0;i<dataColumns.length;i++){
    var val = data[0][dataColumns[i]];
    if(!(!isNaN(+val) && isFinite(val))){
      keysColumns.push(dataColumns[i]);
      dataColumns.splice(i,1);
      i--;
    }
  }
  return [keysColumns,dataColumns];
}
//takes in a list of keys and a matrix of data and turns it into a csv string
function convertToCsv(keys,dataArray){
  var dressedKeys = keys.map(function(e){
    return "\""+e+"\"";
  });
  var lineArray = [];
  dataArray.forEach(function (infoArray, index) {
      var line = infoArray.join(",");
      lineArray.push(index == 0 ? dressedKeys+"\n"+line : line);
  });
  return lineArray.join("\n");
}
// This method takes in csv data in the from of an object and removes empty rows
// if a cell is empty it will add a 0
function dressInputData(data){
  var keys = Object.keys(data[0]);
  for(var i = 0;i<data.length;i++){
    var numberOfEmptyKeys = 0;
    keys.forEach(function(obj2){
      if(data[i][obj2]===""){
        numberOfEmptyKeys = numberOfEmptyKeys+1;
      }
    });
    if(numberOfEmptyKeys===keys.length){
      data.splice(i,1);
      i=i-1;
    }
  }
  keys = catigorizeKeys(data);
  var k = 0;
  for(var i = 0;i<data.length;i++){
    for (var j = 0; j < keys[1].length; j++) {
      if(data[i][keys[1][j]]===""){
        data[i][keys[1][j]] = "0";
      }
    }
    for (var j = 0; j < keys[0].length; j++) {
      if(data[i][keys[0][j]]===""){
        data[i][keys[0][j]] = "label"+k;
        k++;
      }
    }
  }
}
function createSystem(location,width,height,numberOfRows,numberOfColumns,listOfModules){
  // create scripts needed for the WASystem
  var script = document.createElement("script");
  script.src = "https://cdn.plot.ly/plotly-latest.min.js";
  document.head.appendChild(script);
  script = document.createElement("script");
  script.src = "https://d3js.org/d3.v4.min.js";
  document.head.appendChild(script);
  script = document.createElement("script");
  script.src = "https://d3js.org/d3-selection-multi.v1.min.js";
  document.head.appendChild(script);
  script = document.createElement("script");
  script.src = "https://unpkg.com/mathjs@6.0.2/dist/math.min.js";
  document.head.appendChild(script);
  script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/numeric/1.2.6/numeric.min.js";
  document.head.appendChild(script);
  //set up grid layout
  var parentNode = document.getElementById(location);
  // set up input interface
  var dataGrid = document.createElement("Div");
  dataGrid.style.width = width+"px";
  dataGrid.style.height = (height*.25)+"px";
  dataGrid.style.display = "grid";
  dataGrid.style["grid-template-columns"]="25% 75%";
  var uploadFile = document.createElement("input");
  uploadFile.id = "uploadFile";
  uploadFile.type = "file";
  uploadFile.style.display = "none";
  uploadFile.addEventListener('change', uploadFileOnChanged);
  dataGrid.appendChild(uploadFile);
  var uploadButton = document.createElement("input");
  uploadButton.id = "uploadButton";
  uploadButton.type = "button";
  uploadButton.value = "Upload\n Data";
  uploadButton.addEventListener('click', uploadButtonClicked);
  dataGrid.appendChild(uploadButton);
  var dataDiv = document.createElement("Div");
  dataDiv.id = "dataDiv";
  dataDiv.style.position = "relative";
  dataDiv.style.overflow="auto";

  dataGrid.appendChild(dataDiv);
  parentNode.appendChild(dataGrid);

  var moduleGrid = document.createElement("Div");
  var colorList = ["Red","Orange","Yellow","Green","Cyan","Blue","Violet"];
  var colorInc = 0;
  moduleGrid.id="moduleGrid";
  moduleGrid.style.width = width+"px";
  moduleGrid.style.height = height+"px";
  moduleGrid.style.display = "grid";
  var gridTempleteColumnsSet = "";
  for(var i=0;i<numberOfColumns;i++){
    gridTempleteColumnsSet=gridTempleteColumnsSet+" auto";
  }
  moduleGrid.style["grid-template-columns"] = gridTempleteColumnsSet;
  parentNode.appendChild(moduleGrid);
  // set up module spaces
  for(var i=0;i<listOfModules.length;i++){
    // insert scripts needed for specific modules
    script = document.createElement("script");
    script.src = listOfModules[i].moduleName+"/"+listOfModules[i].moduleName+".js";
    document.head.appendChild(script);
    for(var j = 0;j<listOfModules[i].scripts.length;j++){
      if(listOfModules[i].scripts[j]!==""){
        script = document.createElement("script");
        script.src = listOfModules[i].moduleName+"/"+listOfModules[i].scripts[j]+".js";
        document.head.appendChild(script);
      }
    }

    moduleArray.push({moduleFunction:listOfModules[i].moduleFunction,
                      moduleName:listOfModules[i].moduleName});
    //create block
    var container = document.createElement("div");
    container.style.backgroundColor=colorList[colorInc];
    container.class="column";
    container.style.width = ((width/numberOfColumns))+"px";
    container.style.height =((height/numberOfRows))+"px";
    container.moduleNumber = i;
    var title = document.createElement("Div");
    title.innerHTML = "Module #"+i+": "+listOfModules[i].moduleName;
    title.style.height = "25px";
    title.style.width = "100%";
    title.style["white-space"] = "nowrap";
    container.appendChild(title);
    var divSelectors = document.createElement("Div");
    divSelectors.style.display = "grid";
    divSelectors.style.height = "50px";
    gridTempleteColumnsSet="";
    for(var j=0;j<listOfModules[i].inputInstructions.length;j++){
      gridTempleteColumnsSet=gridTempleteColumnsSet+100/listOfModules[i].inputInstructions.length+"% ";
    }
    divSelectors.style["grid-template-columns"] = gridTempleteColumnsSet;
    for (var j = 0; j < listOfModules[i].inputInstructions.length; j++) {
      var label = document.createElement("Div");
      label.innerHTML = listOfModules[i].inputInstructions[j];
      label.style["white-space"] = "nowrap";
      divSelectors.appendChild(label);
    }
    //add module input options
    var selectWidth = width/numberOfColumns;
    for(var j=0;j<listOfModules[i].inputInstructions.length;j++){
      var select = document.createElement("select");
      select.className = "dataSelector";
      select.data = i;
      divSelectors.appendChild(select);
    }
    container.appendChild(divSelectors);
    //add module run button
    var runButton = document.createElement("input");
    runButton.id = "runButton"+i;
    runButton.type = "button";
    runButton.value = "Run";
    runButton.style.height = "25px";
    runButton.addEventListener('click', runButtonClicked);
    container.appendChild(runButton);
    //add module div
    container.appendChild(document.createElement("br"));
    var moduleDiv = document.createElement("div");
    moduleDiv.id = "module"+i;
    moduleDiv.style.width = "100%";
    moduleDiv.style.height = (height/numberOfRows-100)+"px";
    container.appendChild(moduleDiv);
    moduleGrid.appendChild(container);
    if(colorInc==colorList.length-1){
      colorInc=0;
    }else{
      colorInc++;
    }
  }
  //upload button listerner
  function uploadButtonClicked() {
    document.getElementById('uploadFile').click();
  }
  //upload button listerner
  function uploadFileOnChanged(evt) {
      var fileName = this.value;
      fileName = fileName.substr(fileName.lastIndexOf("\\")+1,fileName.length);
      var f = evt.target.files[0];
      if (f) {
        var r = new FileReader();
        r.onload = function(e) {
          var contents = e.target.result;
          var data = {data:contents,
                      name:fileName};
          createDataSlot(data);
        }
        r.readAsText(f);
      }
  }
  // run button listerner
  function runButtonClicked(){
    var position = this.parentElement.moduleNumber;
    var dataSet = [];
    var listOfDataSelectors = this.parentElement.getElementsByClassName("dataSelector");
    for(var i=0;i<listOfDataSelectors.length;i++){
      var tempDataSet = Plotly.d3.csv.parse(dataArray[listOfDataSelectors[i].value].data);
      dressInputData(tempDataSet);
      dataSet.push(tempDataSet);
    }
    var location = document.getElementById("module"+position);
    var child = location.lastElementChild;
    while(child){
      location.removeChild(child);
      child = location.lastElementChild;
    }
    var result = moduleArray[position].moduleFunction(location,dataSet);
    if(result != null){
      createDataSlot(result);
    }
  }
}
// creates a new data slot with the name of the data file, a download and delete
// button
function createDataSlot(data){
  var dataDiv = document.getElementById("dataDiv");
  dataArray.push(data);
  var dataSlot = document.createElement("Div");
  dataSlot.style.position = "relative";
  dataSlot.style.width="100%";
  dataSlot.style.display = "grid";
  var height = dataDiv.style.height.substr(0,dataDiv.style.height.indexOf("p"))/4;
  dataSlot.style.height="50%";
  var labelDiv = document.createElement("div");
  labelDiv.style.width = "25%";
  labelDiv.style.height = "100%";
  var label = document.createElement("label");
  label.innerHTML = dataArray[dataArray.length-1].name;
  label.style.position = "absolute";
  label.style.top="50%";
  labelDiv.appendChild(label);
  dataSlot.appendChild(labelDiv);
  var downloadButton = document.createElement("input");
  downloadButton.id = "downloadButton";
  downloadButton.type = "button";
  downloadButton.value = "Download Data";
  downloadButton.style.height = "100%";
  downloadButton.style.position = "absolute";
  downloadButton.style.right="25%";
  downloadButton.data = dataArray.length-1;
  downloadButton.addEventListener('click', downloadButtonClicked);
  dataSlot.appendChild(downloadButton);
  var deleteButton = document.createElement("input");
  deleteButton.id = "deleteButton";
  deleteButton.type = "button";
  deleteButton.value = "Delete";
  deleteButton.style.height = "100%";
  deleteButton.style.position="absolute";
  deleteButton.style.right="0";
  deleteButton.data = dataArray.length-1;
  deleteButton.addEventListener('click', deleteButtonClicked);
  dataSlot.appendChild(deleteButton);
  dataDiv.appendChild(dataSlot);
  setDataSelectorOptions();
}
// set the selector options for the dropdown in each module
function setDataSelectorOptions(){
  var listOfDataSelectors = document.getElementById("moduleGrid").getElementsByClassName('dataSelector');
  for(var i=0;i<listOfDataSelectors.length;i++){
    var child = listOfDataSelectors[i].lastElementChild;
      while (child) {
          listOfDataSelectors[i].removeChild(child);
          child = listOfDataSelectors[i].lastElementChild;
      }
    for(var j=0;j<dataArray.length;j++){
      var e1 = document.createElement("option");
      e1.value = j;
      e1.innerHTML = dataArray[j].name;
      listOfDataSelectors[i].appendChild(e1);
    }
  }
}
// download selected file
function downloadButtonClicked(){
  var encodedUri = encodeURI(dataArray[this.data].data);
  var link = document.createElement("a");
  link.href = "data:text/csv;charset=utf-8,"+encodedUri;
  link.download = dataArray[this.data].name;
  document.body.appendChild(link);
  link.click();
}
// deletes selected file
function deleteButtonClicked(){
  dataArray.splice(this.data,1);
  dataDiv.removeChild(dataDiv.children[this.data]);
  setDataSelectorOptions();
}
