
// TO DO Perhaps insert this variable inside the prototype of PeaPlant...
var images = {};
images['peaPlant'] = new Image();
images['peaPlant'].onload = function(){
    images['peaPlant'].loaded = true;
};
images['peaPlant'].src = "MendelPeas/peaPlant.png";

images['peaPlantWhite'] = new Image();
images['peaPlantWhite'].onload = function(){
    images['peaPlantWhite'].loaded = true;
};
images['peaPlantWhite'].src = "MendelPeas/peaPlantWhite.png";

var PeaPlant = function(){
   ADT_DEF.call(this,'PeaPlant');
   
   // flower color:
   // - Purple, white
   // pod color: 
   // - Green, yellow
   // stem length:
   // - Tall, dwarf
   this.state = {
     dna: 0 // a string like "PPGyTT"
   };   
   
   // optional
   this.clone = function(otherPlant){
      var p = new PeaPlant();
      p.state = {
         dna: otherPlant.state.dna
      };
      return p;
   }   
   
   this.toString= function(){
      return this.state.dna;
   };
   
   this.operators['new'] = 
      new Operator('new',function(inputs,outputs){
         var newDNA = '';
         newDNA += ((Math.random()<0.5)?'P':'w');
         newDNA += ((Math.random()<0.5)?'P':'w');
         newDNA += ((Math.random()<0.5)?'G':'y');
         newDNA += ((Math.random()<0.5)?'G':'y');
         newDNA += ((Math.random()<0.5)?'T':'d');
         newDNA += ((Math.random()<0.5)?'T':'d');
         
         var p = new PeaPlant();
         p.state.dna = newDNA;
         outputs.push( p );
      },[],1, false);
   
   this.operators['cross'] = 
      new Operator('cross',function(inputs,outputs){
         var childDNA = '';
         //childDNA = inputs[0]._get().dna;

         //				console.log( inputs[0]._get().dna );
         //				console.log( inputs[1]._get().dna );

         var fatherFlowerColor = inputs[0].state.dna.charAt( ~~(Math.random()*2) );
         var motherFlowerColor = inputs[1].state.dna.charAt( ~~(Math.random()*2) );
         childDNA += fatherFlowerColor + motherFlowerColor;

         var fatherPodColor = inputs[0].state.dna.charAt( ~~(Math.random()*2)+2 );
         var motherPodColor = inputs[1].state.dna.charAt( ~~(Math.random()*2)+2 );
         childDNA += fatherPodColor + motherPodColor;

         var fatherStemLength = inputs[0].state.dna.charAt( ~~(Math.random()*2)+4 );
         var motherStemLength = inputs[1].state.dna.charAt( ~~(Math.random()*2)+4 );
         childDNA += fatherStemLength + motherStemLength;
         
         var p = new PeaPlant();
         p.state.dna = childDNA;
         outputs.push( p );
      },
      [this.type,this.type],1, false);

   this.operators['pureStrain'] = 
      new Operator('pureStrain',function(inputs,outputs){
         var newDNA = '';
         var t = '';
         t = ((Math.random()<0.5)?'P':'w');
         newDNA += t+t;
         t = ((Math.random()<0.5)?'G':'y');
         newDNA += t+t;
         t = ((Math.random()<0.5)?'T':'d');
         newDNA += t+t;
         
         var p = new PeaPlant();
         p.state.dna = newDNA;
         outputs.push( p );
      },[],1, true);
      
   
   //this.views = []; // erase default view
   this.views.unshift( function(ctx){ // prepend this view
      var w = 100, h=100;
      ctx.beginPath();

      var isPurple = (this.state.dna.substr(0,2)!='ww');
      var isTall = (this.state.dna.substr(4,2)!='dd');
      var heigth = (isTall? h : h*2/3 );
      var isPodGreen = (this.state.dna.substr(2,2)!='yy');

      if ((images['peaPlant'].loaded) && (images['peaPlantWhite'].loaded)){
         if (isPurple){
            ctx.drawImage(images['peaPlant'],0,h-heigth,w,heigth);
         } else {
            ctx.drawImage(images['peaPlantWhite'],0,h-heigth,w,heigth);
         }
      } else {
         ctx.strokeStyle="green";
         ctx.rect(0,0,w,h);
         ctx.stroke();
      }
      ctx.closePath();

      ctx.beginPath();
      ctx.fillStyle= (isPodGreen? 'green' : 'yellow' );
      ctx.arc(w/6,h*3/4,h/12, 0,2*Math.PI);
      ctx.fill();
      ctx.closePath();      
   });
}