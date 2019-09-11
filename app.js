// this is the starter js file.. Module pattern

var budgetController = (function(){
    var x = 23;
    var addTwoNumbers = function (y){
        return x + y;
    }
    return {
         publicTest: function(b){
           return addTwoNumbers(b);
         }
    }
})();





var UIController = (function(){
    //some code
})();



var controller = (function(budgetCtrl,UICtrl){
    var z = budgetCtrl.publicTest(5)
    return{
        anotherPublicTest: function(){
            console.log(z);
        }
    }
})(budgetController,UIController);
