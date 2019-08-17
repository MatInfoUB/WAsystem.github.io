// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
// various helper methods for isomap.js
function sortMatrix(matrix){
  matrix = math.transpose(matrix);
  var numberOfRows = matrix.size()[0];
  var numberOfColumns = matrix.size()[1];
  var B = math.zeros(numberOfRows,numberOfColumns);
  var I = math.zeros(numberOfRows,numberOfColumns);
  for(var i = 0;i<numberOfRows;i++){
    var row = matrix.subset(math.index(i,math.range(0,numberOfColumns)))._data[0];
    var bRow = Array.from(row);
    bRow = bRow.sort(function(x,y) { return x-y});
    var iRow = [];
    for(var j = 0;j<bRow.length;j++){
      iRow.push(row.indexOf(bRow[j]));
    }
    B.subset(math.index(i,math.range(0,numberOfColumns)),bRow);
    I.subset(math.index(i,math.range(0,numberOfColumns)),iRow);
  }
  B=math.transpose(B);
  I=math.transpose(I);
  return [B,I];
}

function sort1DMatrix(matrix){
  if(typeof matrix === "number"){
    matrix = math.matrix([matrix]);
  }
  var numberOfColumns = matrix.size()[0];
  var B = math.matrix(math.clone(matrix._data).sort(function(a, b){return a-b}));
  var I = [];
  B.forEach(function (value, index, m) {
      var t = findIndex(matrix._data,I,0,value);
      I.push(t);
  });
  return [B,math.matrix(I)];
}

function findIndex(array,saveArray,start,value){
  var position = array.indexOf(value,start);
  if(saveArray.includes(position)){
    start = position + 1;
    return findIndex(array,saveArray,start,value);
  }else{
    return position;
  }
}


//for 2 matricies of equal dimensions, divides each cell by its corrisponding cell
function matrixCellDivide(matrixA, matrixB){
  var retval = matrixA.map(function (value, index, matrix) {
    return value/(matrixB.subset(math.index(index[0],index[1])));
  });
  return retval;
}

function matrixBoolean(matrix,inputValue,fun,trueValue=1,falseValue=0){
  var retval = matrix.map(function (value, index, m) {
    if(fun(value,inputValue)==true){
      return trueValue;
    }else{
      return falseValue;
    }
  });
  return retval;
}

function minMatrix(matrixA,matrixB){
  var retval = matrixA.map(function (value, index, m) {
    var B = math.subset(matrixB,math.index(index[0],index[1]));
    if(B>value){
      return value;
    }else{
      return B;
    }
  });
  return retval;
}

function minMatrixInternal(matrix){
  var nullList=[];
  for(var i = 0;i<matrix.size()[1];i++){
    nullList.push(null);
  }
  var M = math.matrix([nullList]);
  var I = math.matrix(math.clone([nullList]));
  matrix.forEach(function (value, index, m) {
    var target = math.subset(M,math.index(0,index[1]));
    if(target==null){
      M.subset(math.index(0,index[1]),value);
      I.subset(math.index(0,index[1]),index[0]);
    }else if(value<target){
      M.subset(math.index(0,index[1]),value);
      I.subset(math.index(0,index[1]),index[0]);
    }
  });
  return [M,I];
}

function uniqueMatrix(matrix){
  var C = [];
  var ia = [];
  var ic = [];
  matrix.forEach(function (value, index, m) {
    if(!(C.includes(value))){
      C.push(value);
    }
  });
  C=math.matrix([C]);
  C.forEach(function (value, index, m) {
    ia.push(matrix._data[0].indexOf(value));
  });
  ia = math.transpose(math.matrix(ia));
  matrix.forEach(function (value, index, m) {
    ic.push(C._data[0].indexOf(value));
  });
  ic = math.transpose(math.matrix(ic));
  return[C, ia,ic];
}


function L2_distance(matrix){
  // //get matrix
  var result = math.zeros(matrix.size()[0],matrix.size()[0]);
  var result = result.map(function (value, index, m) {
    var trace1 = math.subset(matrix, math.index(index[0],math.range(0,matrix.size()[1])));
    var trace2 = math.subset(matrix, math.index(index[1],math.range(0,matrix.size()[1])));
    var retVal = math.subtract(trace1,trace2);
    var retVal = retVal.map(function (value, index, m){
      return Math.pow(value,2);
    });
    return math.sqrt(math.sum(retVal,1))._data[0];
  });
  return result;
}

function twoMatrixL2_distance(a,b){
  if(a.size()[0] != b.size()[0]){
    return 'A and B should be of same dimensionality';
  }
  if(a.size()[0] == 1){
    var a = math.resize(a,[2,a.size()[1]],0);
    var b = math.resize(a,[2,a.size()[1]],0);
  }
  var aa = a.map(function (value, index, m) {
    return Math.pow(value,2);
  });
  aa = math.sum(aa,0);
  var bb = b.map(function (value, index, m) {
    return Math.pow(value,2);
  });
  bb = math.sum(bb,0);
  var ab = math.multiply(math.transpose(a),b);
  var op2 = math.zeros(a.size()[1],a.size()[1]);
  op2 = op2.map(function (value, index, m) {
    return math.subset(aa,math.index(index[1]));
  });
  var op1 = math.transpose(op2);
  var op3 = math.multiply(ab,2);
  return math.sqrt(math.subtract(math.add(op1,op2),op3));
}

function covariance(matrix){
  var mean = math.mean(matrix,1);
  var matrixT = math.transpose(matrix);
  var meanT = math.mean(matrixT,1);
  var N = matrix.size()[0];
  var result = math.multiply(math.multiply(matrixT,matrix),Math.pow(N,-1));
  return result;
}
function vectorCovariance(a,b){
  var retVal = 0;
  var meanA = math.mean(a);
  var meanB = math.mean(b);
  a.forEach(function (value, index, m) {
    retVal=retVal+(value-meanA)*(math.subset(b,math.index(index[0],0))-meanB);
  });
  return retVal/(a.size()[0]);
}
