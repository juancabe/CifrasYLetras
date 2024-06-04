function printOp(nums, guess, ops, order) {
  let operations = "";
  while(order.length != 0) {
      let x0 = order.shift();
      let x1 = order.shift();
      let op = ops[x0].shift();
      switch(op) {
          case 0:
              operations += nums[x0] + " + " + nums[x1] + " = " + (nums[x0] + nums[x1]) + "\n";
              nums[x0] = nums[x0] + nums[x1];
              break;
          case 1:
              operations += nums[x0] + " - " + nums[x1] + " = " + (nums[x0] - nums[x1]) + "\n";
              nums[x0] = nums[x0] - nums[x1];
              break;
          case 2:
              operations += nums[x0] + " / " + nums[x1] + " = " + (nums[x0] / nums[x1]) + "\n";
              nums[x0] = nums[x0] / nums[x1];
              break;
          case 3:
              operations += nums[x0] + " * " + nums[x1] + " = " + (nums[x0] * nums[x1]) + "\n";
              nums[x0] = nums[x0] * nums[x1];
              break;
      }
      nums.splice(x1, 1);
  }
  return operations;
}

function findOp(nums, guess){
  let ops = [];
  for(let i = 0; i < nums.length; i++){
    ops.push([]);
  }
  let order = [];
  let xd = findOpRec(deepCopyArray(nums), guess, ops, order);
  if(xd != null){
    order = xd[0];
    ops = xd[1];
    return printOp(nums, guess, ops, order);
  } else{
    console.log("Fuck");
    if(findOp(nums, guess-1) != null){
      return true;
    } else{
      findOp(nums, guess+1);
    }
  }
}

function findOpRec(nums, guess, ops, order){

  let saved_nums = deepCopyArray(nums);
  let saved_ops = deepCopyArray(ops);
  let saved_order = deepCopyArray(order); 

  if(nums.length < 1){
      console.log("Error < 1");
  }

  if(nums.length == 1){
      if(guess == nums[0]){
          return [deepCopyArray(order), deepCopyArray(saved_ops)];
      }
      else{
          return null;
      }
  } else if(nums.includes(guess)){
      return [deepCopyArray(order), deepCopyArray(saved_ops)];
  }

  for(let x = 0; x < 4; x++){
      for(let i = 0; i < nums.length; i++){
          for(let j = 0; j < nums.length; j++){
              if((i == j) || (nums[i] < nums[j])){
                  continue;
              }

              switch(x){
                  case 0:
                      nums[i] = nums[i] + nums[j];
                      break;
                  case 1:
                      nums[i] = nums[i] - nums[j];
                      break;
                  case 2:
                      if(nums[j] != 0 && nums[i] % nums[j] == 0){
                          nums[i] = nums[i] / nums[j];
                      } else{
                          continue;
                      }
                      break;
                  case 3:
                      nums[i] = nums[i] * nums[j];
                      break;
              }

              ops[i].push(x);
              order.push(i);
              order.push(j);
              nums.splice(j, 1);

              let xd = findOpRec(nums, guess, ops, order);
              if(xd != null){
                  // console.log("nums: " + nums);
                  // console.log("guess: " + guess);
                  // console.log("ops: " + ops);
                  // console.log("order: " + order);
                  return xd;
              } else{
                  nums.length = 0;
                  ops.length = 0;
                  order.length = 0;

                  nums.push(...saved_nums);
                  order.push(...saved_order);
                  for(let ooo = 0; ooo < saved_ops.length; ooo++){
                      ops.push([]);
                      ops[ops.length-1] = [...saved_ops[ooo]];
                  }
              }
          }
      }
  }
  nums.length = 0;
  ops.length = 0;
  order.length = 0;

  nums.push(...saved_nums);
  order.push(...saved_order);
  for(let ooo = 0; ooo < saved_ops.length; ooo++){
      ops.push([]);
      ops[ops.length-1] = [...saved_ops[ooo]];
  }
  

  return null;
}

function deepCopyArray(arr) {
    return arr.map(item => {
      if (Array.isArray(item)) {
        return deepCopyArray(item);
      } else if (item && typeof item === 'object') {
        return deepCopyObject(item);
      } else {
        return item;
      }
    });
  }
  
  function deepCopyObject(obj) {
    const copy = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key])) {
          copy[key] = deepCopyArray(obj[key]);
        } else if (obj[key] && typeof obj[key] === 'object') {
          copy[key] = deepCopyObject(obj[key]);
        } else {
          copy[key] = obj[key];
        }
      }
    }
    return copy;
  }