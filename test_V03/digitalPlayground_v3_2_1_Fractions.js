/*
   name: string
   body: function(paramArray,resultArray)
   inputsNum: int
   outputsNum: int
   removeInputs: boolean
*/
function Operator(name,body,
                  inputsNum,outputsNum, removeInputs){
   this.name = name;
   this.body = body;
   this.inputsNum = inputsNum;
   this.outputsNum = outputsNum;
   this.removeInputs = removeInputs;
}

    
var Fraction = function(){
    // properties
    var _numerator;
    var _denumerator;
    
    return {
      _set: function(num,den){
        _numerator = num;
        _denumerator = den;
        return this;
      },
      _get: function(){
        return {n: _numerator, d:_denumerator};
      },
	  _clone: function(fraction){
		  return new Fraction()._set( fraction._get().n, fraction._get().d );
	  },  
	  _new: function(fraction){
		var n = Math.floor(Math.random()*10)+1;
		var d = Math.floor(Math.random()*10)+1;
		return new Fraction()._set(n,d);
	  },  
      toString: function(){
        return _numerator + '/' + _denumerator;
      }, 
      
      operators: [
          new Operator('add',function(inputs,outputs){
             var newFraction = new Fraction();
              if (inputs[0]._get().d == inputs[1]._get().d){
                   newFraction._set( 
                    inputs[0]._get().n + inputs[1]._get().n ,
                    inputs[0]._get().d );
              } else {
                  newFraction._set( 
                    inputs[0]._get().n*inputs[1]._get().d + 
                      inputs[1]._get().n*inputs[0]._get().d,
                    inputs[0]._get().d * inputs[1]._get().d );
              }
               outputs.push( newFraction );
            },
           //2,1, true), // DEBUG
           2,1, false), // 2 inputs, 1 output, do not remove inputs
          new Operator('double',function(inputs,outputs){
            if (inputs[0]._get().d % 2 == 0){
                outputs.push( new Fraction()._set( inputs[0]._get().n , inputs[0]._get().d/2 ) );
                return;
            }
            var f = new Fraction()._set( inputs[0]._get().n * 2 , inputs[0]._get().d );
            outputs.push( f );
              /*
            // DEBUG  
              console.log( inputs[0]._get() );
              console.log( outputs[0]._get() );
              */
          },1,1, true),
          new Operator('swap',function(inputs,outputs){
            outputs.push( inputs[1], inputs[0] );
          },2,2, true)          
      ],
      views: [
            function(ctx,w,h){
                ctx.beginPath();
                ctx.strokeStyle="blue";
                ctx.rect(0,0,w,h);
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.fillStyle="black";
                ctx.fillText( _numerator ,w/4,h/3);
                ctx.fillText( _denumerator ,w/4,h*4/5);
                ctx.closePath();

                ctx.beginPath();
                ctx.strokeStyle="blue";
                ctx.moveTo(w/4-2,h/2);
                ctx.lineTo(w*3/4+2,h/2);
                ctx.stroke();
                ctx.closePath();
            },
            function(ctx,w,h){
                ctx.beginPath();
                ctx.strokeStyle="blue";
                ctx.rect(0,0,w,h);
                ctx.stroke();
                ctx.closePath();

                // n must be <= than d
                ctx.beginPath();
                ctx.fillStyle="green";
                ctx.fillRect(0,0, (_numerator/_denumerator) * w,h/2);
                ctx.fillStyle="red";
                ctx.fillRect(0,h/2, w,h/2);
                ctx.closePath();   
            }
      ]
    };
}

	
// global declaration to be used in the engine
var ADT = new Fraction();

