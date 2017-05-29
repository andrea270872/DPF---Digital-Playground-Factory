
function playgroundSetup(ADT,OBJECT_HEAP,OP_HEAP,OpBox,Box,SIZE_X,SIZE_Y){
	
	var K = 3;
	for (var i=0;i<ADT.operators.length;i++){
		OP_HEAP.push( new OpBox(SIZE_X*((i%K)*3+2),SIZE_Y*(~~(i/K)*3 + 2),
							SIZE_X,SIZE_Y,
							ADT.operators[i].name, ADT.operators[i].body, 
							ADT.operators[i].inputsNum,ADT.operators[i].outputsNum,
							ADT.operators[i].removeInputs) );
	}
	
	// standard operators

	OP_HEAP.push( new OpBox(0,0,
							SIZE_X,SIZE_Y,
							'new', function(inputs,outputs){
								outputs.push( ADT._new() );
							}, 0,1,false) );

	OP_HEAP.push( new OpBox(0,3*SIZE_Y,
							SIZE_X,SIZE_Y,
							'clone', function(inputs,outputs){
								outputs.push( ADT._clone(inputs[0]) );
							},                        
							1,1,false) );
							
	OP_HEAP.push( new OpBox(0,6*SIZE_Y,
							SIZE_X,SIZE_Y,
							'bin', function(inputs,outputs){},                     
							1,0,true) );							
}
