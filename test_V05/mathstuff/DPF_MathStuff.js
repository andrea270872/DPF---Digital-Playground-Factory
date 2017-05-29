// requires: ADT_DEF, Fraction and IntegerNumber to work

var MathStuff = function(){
   ADT_DEF.call(this,'MathStuff');
   
   this._FractionADT = new Fraction();
   this._IntegerNumberADT = new IntegerNumber();
   var self = this;
   
   //this.state = {};
   
   this.toString = function(){
        return 'MathStuff';
   };

   this.operators['newFrac'] = 
        new Operator('newFrac',function(inputs,outputs){
            self._FractionADT.operators['new'].body(inputs,outputs);
          },
         [],1, false);

   this.operators['newInt'] = 
        new Operator('newInt',function(inputs,outputs){
            self._IntegerNumberADT.operators['new'].body(inputs,outputs);
            outputs[0].state.value =  ~~(Math.random()*20)-10 ;
          },
         [],1, false);
   this.operators['Fr+Int'] = 
         new Operator('Fr+Int',function(inputs,outputs){

               var tmp = [];
               self._FractionADT.operators['new'].body([],tmp);
               var intAsFraction = tmp[0];
                  intAsFraction.state.numerator = inputs[1].state.value;
                  intAsFraction.state.denumerator = 1;
      
               console.log( inputs , intAsFraction);      
      
               self._FractionADT.operators['add'].body(
                     [inputs[0],intAsFraction],
                     outputs);
            },
      [this._FractionADT.type,this._IntegerNumberADT.type],1, false); // 2 inputs, 1 output, do not remove inputs
   
   
//   this.operators['succ'] = 
//        new Operator('succ',function(inputs,outputs){
//            var newInt = new IntegerNumber();
//            newInt.state.value = inputs[0].state.value +1 ;
//            outputs.push( newInt );
//          },[this.type],1, true);
//   
//   this.operators['add'] = 
//          new Operator('add',function(inputs,outputs){
//             var newInt = new IntegerNumber();
//             newInt.state.value = inputs[0].state.value + inputs[1].state.value;
//               outputs.push( newInt );
//             },
//           [this.type,this.type],1, false); // 2 inputs, 1 output, do not remove inputs
}

/*
var MathStuff = function(){
    // properties

    var _FractionADT = new Fraction();
    var _IntegerNumberADT = new IntegerNumber();
    
    return {
      operators: [
         new Operator('newFraction',function(inputs,outputs,inputsCheckOut){
            outputs.push( 
                _FractionADT._new()
            );
          },0,1, false),
         new Operator('newInt',function(inputs,outputs,inputsCheckOut){
            outputs.push( 
                _IntegerNumberADT._new()._set( ~~(Math.random()*20)-10 )
            );
          },0,1, false),
          new Operator('add',function(inputs,outputs,inputsCheckOut){
            inputsCheckOut.push( 
               inputs[0]._getType()=='Fraction',
               inputs[1]._getType()=='IntegerNumber'
            ); // check types of the 2 inputs

            if (inputsCheckOut[0] && inputsCheckOut[1]) {
               var results = [];
               _FractionADT.operators[0].body([inputs[0],_FractionADT._new()._set(inputs[1]._get().v,1)],
                                 results,
                                 []);
               outputs.push( results[0] );
            }
          },
           2,1, false) // 2 inputs, 1 output, do not remove inputs

//          new Operator('+1',function(inputs,outputs,inputsCheckOut){
//            outputs.push( 
//                inputs[0]._set( inputs[0]._get().v +1 )
//            );
//          },1,1, true),
//          new Operator('-1',function(inputs,outputs,inputsCheckOut){
//            outputs.push(
//                inputs[0]._set( inputs[0]._get().v -1 )
//            );
//          },1,1, true)          
      ]
    };
}

//// export to the engine
//var ADT_export = Math;
*/