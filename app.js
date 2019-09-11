// this is the starter js file.. Module pattern

var budgetController = (function(){
    var x = 23;
    var addTwoNumbers = function (y){
        return x + y;
    }
    return {
         publicTest: function(b){
            console.log(addTwoNumbers(b));
         }
    }
})();
