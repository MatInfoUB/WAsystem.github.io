// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
// Takes in 1 set of input data runs feasture classification equation on it and
// displays the resulting graph at location with 3 boxes with perspecified ranges.
// the data set need the following keys, EutecticComp,EutecticAngle,Radius1,Radius2

function runFeatureClassificationModule(location,inputData){
  function makeBox(xMin,xMax,yMin,yMax,color, name){
    var line1 = {x: [xMin, xMax],y: [yMin,yMin], mode: 'lines',line: {color: color,width: 3}, name: name};
    var line2 = {x: [xMax,xMax],y: [yMin, yMax], mode: 'lines',line: {color: color,width: 3}, name: name};
    var line3 = {x: [xMin, xMax],y: [yMax, yMax], mode: 'lines',line: {color: color,width: 3}, name: name};
    var line4 = {x: [xMin, xMin],y: [yMin, yMax], mode: 'lines',line: {color: color,width: 3}, name: name};
    return [line1, line2, line3, line4]
  }
  function presentData(location, graphData) {
    var graph = document.createElement("Div");
    graph.id = "graph"+location.parentElement.moduleNumber;
    graph.style.width = "100%";
    graph.style.height = "100%";
    location.appendChild(graph);
    var userData ={ x: graphData[0],
                    y: graphData[1],
                    mode: 'markers',
                    type: 'scatter',
                    marker: {
                      color: colors[3],
                      width: 3
                    }
                  };
    var lowBox = makeBox(-25,0,0,72,colors[0],'low confidence');
    var mediumBox = makeBox(-20,-4,18,58,colors[1], 'medium confidence');
    var highBox = makeBox(-15,-9.5,25,54,colors[2], 'high confidence');
    var data = lowBox.concat(mediumBox).concat(highBox).concat(userData);
    var layout = {showlegend: false,
                  xaxis: {title: '[(RA-RB)%X)](nm)', range: [-100, 100]},
                  yaxis: {title: 'Eutectic Angle(°)', range: [0, 100]},
                  title: 'Metallic Glass Confidence Intervals',
                  margin: {
                    l: 25,
                    r: 0,
                    b: 25,
                    t: 25,
                    pad: 0
                  }
                };
    Plotly.newPlot(graph.id, data, layout);
  }
  var colors = ['rgba(153,153,0,1)', 'rgba(153,76,0,1)', 'rgba(153,0,0, 1)', 'rgba(0,0,153, 1)'];
  var x = [], y = [], standard_deviation = [];
  for (var i=0; i<inputData[0].length; i++) {
    var row = inputData[0][i];
    x.push((row['Radius1']-row['Radius2'])%row['EutecticComp']);
    y.push(row['EutecticAngle']);
  }
  var graphData = [x,y];
  presentData(location,graphData);
  var moduleNumber = parseInt(location.id.substr(6,location.id.length));
  var result = {data:convertToCsv(["x","y"],math.transpose(graphData)),
                name:moduleArray[location.parentElement.moduleNumber].moduleName+".csv"};
  return result;
}
