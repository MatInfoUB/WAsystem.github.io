// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
//Takes in data and location and creates input textboxes of all the data columns
//the user must add waights and click submit. It will then use a weighted
//decision tree and create and display a force directed diagram of the results.
//The imput data must have a labels column.
function runDecisionTheoryModule(location,inputData){
  var graphData={"links":[],"nodes":[]};
  var data=[];
  var inputNodes=[];
  var listOfPriority=[];
  var colorList = [];
  var orderedData = {}
  function createGraph(){
    createForceDirectedGraph(graphData,"graph"+location.parentElement.moduleNumber);
  }
  function processData(){
    // var lowFill = 0;
    // listOfPriority.forEach(function(e){
    //   if(Number.isNaN(e)==false && e>lowFill){
    //     lowFill=e;
    //   }
    // });
    // var lowFill = lowFill+1;
    // for(var i=0;i<listOfPriority.length;i++){
    //   if(Number.isNaN(listOfPriority[i])==true){
    //     listOfPriority[i]=lowFill;
    //   }
    // }
    var elements = Object.keys(data);
    if(listOfPriority.length>1){
      for(var i = 0;i<elements.length;i++){
        var sum = 0;
        for(var j = 0 ;j<listOfPriority.length;j++){
          sum = sum + data[elements[i]]._data[0][j]*listOfPriority[j];
        }
        orderedData[elements[i]] = sum;
      }
    }else{
      orderedData = data;
    }
    var nodeList = graphData["nodes"];
    var linkList = graphData["links"];
    foundMatch:
    for(var i=0;i<inputNodes.length;i++){
      var a = inputNodes[i];
      for(var j=0;j<inputNodes.length;j++){
        if(i!=j){
          var b = inputNodes[j];
          var result = compareTwoNodes(a,b);
          if(result != 0){
            if(result == 1){
              linkList.push({"source": b,"target": a});
              nodeList.push({"name":b,"color" : getRandomColorString()});
              nodeList.push({"name":a,"color" : getRandomColorString()});
            }else{
              linkList.push({"source": a,"target": b});
              nodeList.push({"name":a,"color" : getRandomColorString()});
              nodeList.push({"name":b,"color" : getRandomColorString()});
            }
            inputNodes.splice(i,1);
            inputNodes.splice(j-1,1);
            break foundMatch;
          }
        }
      }
    }
    for(var i=0;i<inputNodes.length;i++){
      var relationsArray=[];
      for(var j=0;j<nodeList.length;j++){
        relationsArray.push(compareTwoNodes(nodeList[j].name,inputNodes[i]));
      }
      var start = relationsArray.lastIndexOf(-1);
      var end = relationsArray.indexOf(1);
      if(start==-1 && end==-1){
        break;
      }
      var nodesBelow = [];
      var nodesAbove = [];
      if(start!=-1){
        linkList.push({"source": nodeList[start].name,"target": inputNodes[i]});
        nodesBelow.push(nodeList[start].name);
        for(var j=start;-1<j;j--){
          var secondaryLinks = compareTwoNodes(nodeList[j].name,nodeList[start].name);
          if(secondaryLinks==0 && j!=start){
            linkList.push({"source": nodeList[j].name,"target": inputNodes[i]});
            nodesBelow.push(nodeList[j].name);
          }
        }
      }
      if(end!=-1){
        linkList.push({"source": inputNodes[i],"target":nodeList[end].name});
        nodesAbove.push(nodeList[end].name);
        for(var j=end; nodeList.length>j;j++){
          var secondaryLinks = compareTwoNodes(nodeList[end].name,nodeList[j].name);
          if(secondaryLinks==0 && j!=end){
            linkList.push({"source": inputNodes[i],"target": nodeList[j].name});
            nodesAbove.push(nodeList[j].name);
          }
        }
      }
      for(var j = 0;j<nodesBelow.length;j++){
        for(var k = 0;k<nodesAbove.length;k++){
          for(var l = 0;l<linkList.length;l++){
            if(linkList[l].target === nodesAbove[k] && linkList[l].source === nodesBelow[j]){
                linkList.splice(l,1);
            }
          }
        }
      }
      var node = {"name":inputNodes[i]};
      var contains0s = relationsArray.indexOf(0);
      if(relationsArray.indexOf(0) == -1){
        node.color = getRandomColorString();
      }else{
        node.color = nodeList[contains0s].color;
      }
      if(start !=-1){
        nodeList.splice(start+1,0,node);
      }else if(end != -1){
        nodeList.splice(end,0,node);
      }else{
        nodeList.push(node);
      }
      inputNodes.splice(i,1);
      i=i-1;
    }
  }
  //compares node a and b and retruns 1(a), -1(b) or 0(equal)
  function compareTwoNodes(aNode,bNode){
    var a = orderedData[aNode];
    var b = orderedData[bNode];
    var c = math.subtract(a,b);
    if(c>0){
      return 1;
    }else if(c<0){
      return -1;
    }else{
      return 0;
    }
    // var cType =typeof c;
    // if(cType==='number'){
    //   c = math.matrix([[c]]);
    // }

    // var limit = Math.max(...listOfPriority);
    // for(var k=1;k<limit+1;k++){
    //   var list = [];
    //   var propertyColumn = listOfPriority.indexOf(k);
    //   while(propertyColumn!=-1){
    //     var propertyValue = math.subset(c,math.index(0,propertyColumn));
    //     if(propertyValue>0){
    //       list.push(1);
    //     }else if(propertyValue==0){
    //       list.push(0);
    //     }else if(propertyValue<0){
    //       list.push(-1);
    //     }
    //     propertyColumn = listOfPriority.indexOf(k,propertyColumn+1);
    //   }
    //   if(list.every(function(value){return value==1})){
    //     return 1;
    //   }else if(list.every(function(value){return value==-1})){
    //     return -1;
    //   }
    // }
    // return 0;
  }
  function getRandomColorString(){
    var array = [0,0,0];
    var retVal = "";
    var isNotUnique = true;
    while (isNotUnique) {
      for (var i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 255)+127;
      }
      retVal="rgb("+array[0]+","+array[1]+","+array[2]+")";
      if(!colorList.includes(retVal)){
        isNotUnique = false;
      }
    }
    return retVal;
  }
  //check if lik already exist
  function isDuplicate(link){
    var retVal = false;
    graphData["links"].forEach(function(j, index, object){
      if(j["source"] === link["source"] && j["target"] === link["target"]){
        retVal = true;
      }
    });
    return retVal;
  }

  function addForm(){
    var div = document.createElement("div");
    var gridTempleteColumnsSet = "";
    for(var i=0;i<keys.length*2+1;i++){
      gridTempleteColumnsSet=gridTempleteColumnsSet+" auto";
    }
    div.style["grid-template-columns"] = gridTempleteColumnsSet;
    div.style.display = "grid";
    div.style.width="100%";
    div.style.height ="25px";
    keys.forEach(function(e,i){
      var l1 = document.createElement("div");
      l1.innerHTML = e+":";
      l1.class="column";
      // l1.style.width =(100/(keys.length+1))/2+"%";
      l1.style.width="100%";
      l1.style.height ="100%";
      l1.style["white-space"] = "nowrap";
      l1.style.overflow = "hidden";
      div.appendChild(l1);
      var e1 = document.createElement("input");
      e1.type = "text";
      e1.class = "formInput"
      // e1.style.width =(100/(keys.length+1))/2+"%";
      // e1.style.height ="100%";
      e1.style.width="100%";
      e1.class="column";
      div.appendChild(e1);
    });
    var button = document.createElement("button");
    button.type = "submit";
    button.from = "form";
    button.value = "submit";
    button.innerHTML = "Submit";
    button.style.width ="100%";
    button.addEventListener('click', formButtonClicked);
    div.appendChild(button);
    location.appendChild(div);
  }

  function formButtonClicked() {
    var listOfInputs = location.getElementsByTagName("input");
    listOfPriority=[]
    for(var i = 0;i<listOfInputs.length;i++){
      listOfPriority.push(parseFloat(listOfInputs[i].value, 10));
    }
    processData();
    createGraph();
  }
  // extractData();
  var dataSet = math.clone(inputData[0]);
  var keys = Object.keys(dataSet[0]);
  keys.splice(0,1);
  inputNodes = convertObjectStringToList(dataSet);
  var tmpData = convertObjectDataToMatrix(dataSet);
  var length = tmpData.size()[1];
  for(var i=0;i<tmpData.size()[0];i++){
    data[inputNodes[i]] = math.subset(tmpData,math.index(i,math.range(0,length)));
  }
  addForm();
  var heightOfParent = location.style.height.substr(0,location.style.height.indexOf("p"))-25;
  var widthOfParent = location.parentElement.style.width.substr(0,location.parentElement.style.width.indexOf("p"));
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', widthOfParent);
  svg.setAttribute('height', heightOfParent);
  svg.id = "graph"+location.parentElement.moduleNumber;
  location.appendChild(svg);
}
