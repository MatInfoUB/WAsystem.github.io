// last modified:8/16/2019
// Author:Daniel Delannes-Molka
// Addtional modifications by:----
// Converted code from matlab isomap.m to javascript.
// Originally created by:
// ISOMAP   Computes Isomap embedding using the algorithm of
// %             Tenenbaum, de Silva, and Langford (2000).
function convertToIncremetingArray(range){
  var values = range.split(':');
  var value1 = parseInt(values[0], 10);
  var value2 = parseInt(values[1], 10);
  var retval = [];
  for(var i = 0;i<value2;i++){
    retval[i] = value1+i;
  }
  return retval;
}
function isomap(D, n_fcn, n_size, options){
  //outputs:
  var Y={};
  var R;
  var E;


  var N = D.size()[0];
  if(!(N == D.size()[1])){
    console.log("ERROR : D must be a square matrix");
    return "ERROR : D must be a square matrix";
  }
  if(n_fcn == 'k'){
    var K = n_size;
    if(!(K == Math.round(K))){
      console.log("ERROR : Number of neighbors for k method must be an integer");
      return "ERROR : Number of neighbors for k method must be an integer";
    }
  }else if(n_fcn == 'epsilon'){
    var epsilon = n_size;
  }else{
    console.log("ERROR : Neighborhood function must be either epsilon or k");
    return "ERROR : Neighborhood function must be either epsilon or k";
  }
  if(arguments.length < 3){
    console.log("ERROR : Too few input arguments");
    return "ERROR : Too few input arguments";
  } else if(arguments.length < 4){
      options = {'dims':'0:10','overlay':1,'comp':0,'display':1,'verbose':1};
  }
  var INF = Number.POSITIVE_INFINITY;
  if(typeof(options.dims) === "undefined"){
    options.dims = '0:10';
  }
  if(typeof(options.overlay) === "undefined"){
    options.overlay = 1;
  }
  if(typeof(options.comp) === "undefined"){
    options.comp = 0;
  }
  if(typeof(options.display) === "undefined"){
    options.display = 1;
  }
  if(typeof(options.verbose) === "undefined"){
    options.verbose = 1;
  }
  var dims = convertToIncremetingArray(options.dims);
  var comp = options.comp;
  var overlay = options.overlay;
  var displ = options.display;
  var verbose = options.verbose;

  Y.coords = [];
  R = math.zeros([1, dims.length]);

  // %%%%% Step 1: Construct neighborhood graph %%%%%
  console.log("Constructing neighborhood graph...");
  if(n_fcn == 'k'){
    var sortedD = sortMatrix(D);
    for(var i=0;i<N;i++){
      var range = math.subset(sortedD[1],math.index(math.range(1+K,sortedD[1].size()[1]),i));
      D.subset(math.index(i,range), INF);
    }
  } else if(n_fcn == 'epsilon'){
    D = matrixCellDivide(D,matrixBoolean(D,epsilon,function x(A,B){
      return A<=B;
    }));
    D = D.map(function (value, index, matrix) {
      if(value == INF){
        return INF;
      }else{
        return value;
      }
    });
  }
  var Dt = math.transpose(D);
  D = D.map(function (value, index, matrix) {

    if(math.smaller(value,math.subset(Dt,math.index(index[0],index[1])))==true){
      return value;
    }else{
      return math.subset(Dt,math.index(index[0],index[1]));
    }
  });
  if(overlay == 1){
    // NOTE: ignoring int8 due to unknown relevence
    E = math.subtract(1,matrixBoolean(D,INF,function x(A,B){
      if(A==B){
        return true;
      }else{
        return false;
      }
    }));
  }
  // %%%%% Step 2: Compute shortest paths %%%%%
  console.log("Computing shortest paths...");
  for(var k = 0;k<N;k++){
  //   // // FIXME:
    var row1 = math.subset(D,math.index(k,math.range(0,D.size()[1])));
    var matrixA = math.zeros(D.size()[1],D.size()[1]);
    matrixA = matrixA.map(function (value, index, m) {
      return math.subset(row1, math.index(0,index[0]));
    });
    // var i =repmat(D(:,k),[1 N]);
    var matrixB = math.zeros(D.size()[1],D.size()[1]);
    matrixB = matrixB.map(function (value, index, m) {
      return math.subset(row1, math.index(0,index[1]));
    });
    // var j =repmat(D(k,:),[N 1]);
    var matrixC = math.add(matrixA,matrixB);
    var D = minMatrix(D,matrixC);
     // D = min(D,repmat(D(:,k),[1 N])+repmat(D(k,:),[N 1]));

     if((verbose == 1) & (k%20)==0){
       // FIXME:
        console.log(' Iteration: '+k.toString()+'     Estimated time to completion: '+'not yet implemented');
     }
  }
  console.log("Checking for outliers...");
  var n_connect = math.sum(matrixBoolean(D,INF,function x(A,B){
    if(A==B){
      return false;
    }else{
      return true;
    }
  }),0);

  //addtional testing needed
  var min = minMatrixInternal(matrixBoolean(D,INF,function x(A,B){
    if(A==B){
      return true;
    }else{
      return false;
    }
  }));
  var unique = uniqueMatrix(min[1]);
  var size_comps = math.subset(n_connect,math.index(math.clone(unique[0]._data[0])));
  var sortedSize_Comp = sort1DMatrix(size_comps);
  unique[0] = math.subset(unique[0],math.index(0,math.clone(sortedSize_Comp[1]._data).reverse()));
  if(typeof unique[0] ==="number"){
    unique[0] = math.matrix([[unique[0]]]);
  }
  size_comps = math.subset(size_comps,math.index(math.clone(sortedSize_Comp[1]._data).reverse()));
  var n_comps = unique[0].size()[1];
  if (comp>n_comps){
    comp = 1;
  }
  console.log('  Number of connected components in graph: ' +(n_comps).toString());
  console.log('  Embedding component '+comp.toString()+' with '+
              (math.subset(size_comps,math.index(comp))).toString()+' points.');
  Y.index = []
  Y.removedValues = []
  var opt1 = matrixBoolean(min[1],math.subset(unique[0],math.index(0,comp)),function x(A,B){
    if(A==B){
      return true;
    }else{
      return false;
    }
  })
  var opt2 = opt1.forEach(function (value, index, m) {
    if(value != 0){
      Y.index.push(index[1]);
    }else{
      Y.removedValues.push(index[1]);
    }
  });
  D = math.matrix(D.subset(math.index(Y.index, Y.index)));
  N = Y.index.length;
  // // %%%%% Step 3: Construct low-dimensional embeddings (Classical MDS) %%%%%
  console.log("Constructing low-dimensional embeddings (Classical MDS)...");
  // unknown command
  // opt.disp = 0;

  var Dsquared = D.map(function (value, index, m) {
    return Math.pow(value,2);
  });
  var sumOfD = math.reshape(math.sum(Dsquared,0),[1,Dsquared.size()[0]]);
  var a = math.divide(math.multiply(math.transpose(sumOfD),math.ones(1,N)),N);
  var b = math.divide(math.multiply(math.ones(N,1),sumOfD),N);
  var c = math.divide(math.sum(Dsquared),Math.pow(N,2));
  var values = math.multiply(math.add(math.subtract(math.subtract(Dsquared,b),a),c),-.5);
  var eigs = numeric.eig(values._data);
  var val = math.matrix(eigs.lambda.x);
  var vec = math.matrix(eigs.E.x);
  var processEigs = sort1DMatrix(val);
  val = processEigs[0].subset(math.index(math.range(val.size()[0]-dims.length,val.size()[0])));
  val._data = val._data.sort(function(a, b){return b-a});
  processEigs[1] = processEigs[1].subset(math.index(math.range(processEigs[1].size()[0]-dims.length,processEigs[1].size()[0])));
  processEigs[1]._data = processEigs[1]._data.sort(function(a, b){return a-b});
  vec = math.subset(vec, math.index(math.range(0,vec.size()[0]),processEigs[1]._data));
  var realValues = [];
  val.forEach(function(value, index, matrix){
    if(value>0){
        realValues.push(index[0]);
    }
  });
  var h = math.subset(val, math.index(realValues));
  vec = math.subset(vec, math.index(math.range(0,vec.size()[0]),realValues));
  var sortedh = sort1DMatrix(h);
  sortedh[1]._data = sortedh[1]._data.reverse();
  vec = math.subset(vec,math.index(math.range(0,vec.size()[0]),sortedh[1]._data));
  D = math.reshape(D,[math.pow(N,2),1]);
  var Ydata=[];
  for(var di = 0;di<dims.length;di++){
    if (math.subset(dims,math.index(di))<=N){
      var a = math.subset(vec,math.index(math.range(0,vec.size()[0]), math.subset(dims,math.index(di))));
      var b = math.transpose(math.sqrt(math.subset(val,math.index(di))));
      //NOTE does not check it number is complex
      Ydata[di] = math.transpose(math.multiply(a,b))._data[0];
      Y.coords.push(math.clone(Ydata));
        var r2 = twoMatrixL2_distance(math.matrix(Ydata),math.matrix(Ydata));
        r2 = math.reshape(r2,[math.pow(N,2),1]);
        var sd1 = math.multiply(math.std(r2,0,'uncorrected'),math.std(r2,0,'uncorrected'));
        var sd2 = math.multiply(math.std(r2,0,'uncorrected'),math.std(D,0,'uncorrected'));
        var sd3 = math.multiply(math.std(D,0,'uncorrected'),math.std(D,0,'uncorrected'));
        r2 = math.matrix([[(vectorCovariance(r2,r2))/(sd1),vectorCovariance(r2,D)/(sd2)],[vectorCovariance(r2,D)/(sd2),vectorCovariance(D,D)/(sd3)]]);
        r2 = r2.map(function (value, index, m) {
          return Math.pow(value,2);
        });
        r2 = math.subtract(1,r2);
        R[0][di] = math.subset(r2,math.index(1,0));
        if (verbose == 1){
          console.log('  Isomap on '+ N.toString() +' points with dimensionality '+math.subset(dims,math.index(di)).toString()+'  --> residual variance = '+math.subset(R,math.index(0,di)).toString());
        }
    }
  }
  return {'Y':Y,'R':R,'E':E};
}
