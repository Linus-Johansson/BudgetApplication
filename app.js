// Module pattern


//BUDGET CONTROLLER
var budgetController = (function(){
 // some code
})();




// UI-CONTROLLER
var UIController = (function(){
    //some code
})();


// GLOBAL-APP-CONTROLLER
var controller = (function(budgetCtrl,UICtrl){

    var ctrlAddItem = function (){
        // 1.get input data from fields
        
        // 2.add item to budget controller
        
        // 3.add new item to UI 
        
        // 4.calc budget
        
        // 5.display budget in UI
    }

    document.querySelector(".add__btn").addEventListener("click",ctrlAddItem);
    
    // Global event, from anywhere in the doucment.
    document.addEventListener("keypress",function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        } 
       
    });
    
})(budgetController,UIController);
