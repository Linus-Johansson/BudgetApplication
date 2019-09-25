// Module pattern
// IFFE:
/*
An Immediately Invoked Function Expression is a good way at protecting the scope of your function and the variables within it.
*/

//BUDGET CONTROLLER
var budgetController = (function(){

	// expense object.
var Expense = function(id, desc,value){
        this.id = id;
        this.desc = desc;
        this.value = value;
		this.percentage = -1;
    };
	// every expense obj created will enherit this method.
	Expense.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome)*100);
		}else{
			this.percentage = -1;
		}	
	};
	Expense.prototype.getPercentage = function(){
		return this.percentage;
	}
	
	// income object
    var Income = function(id, desc,value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    };
	
	// app's datastructure.
    var data ={
        allItems: {
            exp: [],
            inc: [],
        },
        totals:{
            exp: 0,
            inc: 0
        },
		budget: 0,
		percentage: -1
    };
	
	// function for adding together all incomes or expenses.
	var calculateTotal = function(type){
		// varible for holding the total sum.
		var sum = 0;
		// select either income or expense array and loop trough each item.
		data.allItems[type].forEach(function(curr){
			// add current item to sum var.
			sum += curr.value; 
		});
		// sets the total for income/expenses.
		data.totals[type] = sum;
	};
	
    return{
		
        addItem: function(type,desc,val){
            
			var newItem, ID;
			
            // create new ID 
            if(data.allItems[type].length >0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
          
            // create new item based on  'inc' or 'exp' type
            if(type === "exp"){
                newItem = new Expense(ID,desc,val);
            }else if(type === "inc"){
                newItem = new Income(ID,desc,val);
            }
            // push it into our datastructure 
            data.allItems[type].push(newItem);
            // return the new item.
            return newItem;

        },
		
		deleteItem: function(type,itemID){
			// id = 3
			var ids, index;
			// loop over all elements in a inc or exp array, and put the just the ids in a new array. 
			ids = data.allItems[type].map(function(curr){
				return curr.id;
			});
			
			//index holds id of the element to be removed
			index = ids.indexOf(itemID)// return index number of the element of the array
			
			if(index !== -1){
				data.allItems[type].splice(index, 1);
			}
		},
		//TODO
		calculateBudget: function(){
		// 1. calculate total income & expenses.
			calculateTotal('exp');
			calculateTotal('inc');
			
		// 2. calculate the budget inc - exp.
			data.budget = data.totals.inc - data.totals.exp;
		// 3. calculate the percentage of inc that we spent.
			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else{
				data.percentage = -1;
			}
			
		},
		
		calculatePercentages: function(){
			data.allItems.exp.forEach(function(curr){
				curr.calcPercentage(data.totals.inc);
			});
				
			
		},
		
		getPercentages: function(){
			var allPercentages;
			allPercentages = data.allItems.exp.map(function(curr){
				return curr.getPercentage();
			});
			return allPercentages;
		},
		
		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},
		
        testing: function(){
           console.log(data);
        }
    }

})();

// UI-CONTROLLER
var UIController = (function(){
    // object containing querySelector strings 
    var DOMstrings = {
		budgetLabel: ".budget__value",
		budgetIncomeLabel: ".budget__income--value",
		budgetExpenseLabel: ".budget__expenses--value",
		budgetPercentageLabel: ".budget__expenses--percentage",
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addItemBTN: ".add__btn",
		incContainer: ".income__list",
		expContainer: ".expenses__list",
		itemContainer: ".container",
		expensePercentageLabel: ".item__percentage"
		
    };
    return{
        getUserInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                desc: document.querySelector(DOMstrings.inputDescription).value,
                value:parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            }
           
        },
		
		addListItem: function(obj,type){
			
			var html,newHtml, element;
			//1. create html string with placeholder text.
			if(type === "inc"){
				element = DOMstrings.incContainer;
				html = "<div class='item clearfix' id='inc-%id%'><div class='item__description'>%description%</div> <div class='right clearfix'><div class='item__value'>%value%</div><div class='item__delete'><button class='item__delete--btn'><i class='ion-ios-close-outline'></i></button></div></div></div>";
			}else if(type === "exp"){
				element = DOMstrings.expContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">45</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			
			// 2. replace placeholdertext with data from obj
				newHtml = html.replace("%id%",obj.id);
				newHtml = newHtml.replace("%description%",obj.desc);
				newHtml = newHtml.replace("%value%",obj.value);
		    //3. insert html into DOM
				
				document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
				
		},
		
		deleteListItem: function(selectorID){
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el)
			
		},
		
		clearFields: function(){
			var fields,fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+DOMstrings.inputValue);
			
			fieldsArr = Array.prototype.slice.call(fields);// tricking the slice method that it gets an array, even though 'querySelectorAll' returns a list.
			
			fieldsArr.forEach(function (current,index,array){
				current.value ="";
			});
			fieldsArr[0].focus();// sets focus back on first item in fieldsArr, I.E desc input field.
			
		},
		// displays the budget in the UI
		displayBudget: function(obj){
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.budgetIncomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.budgetExpenseLabel).textContent = obj.totalExp;
			document.querySelector(DOMstrings.budgetPercentageLabel).textContent = obj.percentage;
			
			if(obj.percentage > 0 ){
				document.querySelector(DOMstrings.budgetPercentageLabel).textContent = obj.percentage + '%';
			}else{
				document.querySelector(DOMstrings.budgetPercentageLabel).textContent = '----';
			}
			
		},
		displayPercentages: function(percentages){
			
			var expenseItemPercentage;
			expenseItemPercentage = document.querySelectorAll(DOMstrings.expensePercentageLabel);
			
			var nodeListForEach = function(list,callback){
				for(var i = 0; i < list.length; i++){
					callback(list[i], i);
				}
			};
			
			nodeListForEach(expenseItemPercentage,function(curr,index){
				
				if(percentages[index] > 0){
					curr.textContent = percentages[index] + "%";
				}else{
					curr.textContent = "---";
				}
				
			});
		},
		
        getDOMstrings:function(){
            return DOMstrings;
        }
    }

})();


// GLOBAL-APP-CONTROLLER
var controller = (function(budgetCtrl,UICtrl){
    // get access to DOMstrings declared in UI-Controller.
    var setupEventListners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.addItemBTN).addEventListener("click",ctrlAddItem);
    
        // Global event, from anywhere in the doucment.
        document.addEventListener("keypress",function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            } 
        });
		
		document.querySelector(DOM.itemContainer).addEventListener("click",ctrlDeleteItem);
    }
	
	var updateBudget = function(){
		var budget;
		// 1.calc budget
		budgetCtrl.calculateBudget();

        // 2. return the budget-object with calculations
		budget = budgetCtrl.getBudget();
        // 3.display budget in UI
		UICtrl.displayBudget(budget);
	}
	
	var updateItemProcentage = function(){
		var percentages;
		// 1. calculate percentages
		budgetCtrl.calculatePercentages();
		// 2. read from budget controller
		 percentages = budgetCtrl.getPercentages();
		// 3. update UI with new percentages
		UICtrl.displayPercentages(percentages)
		//console.log(percentages);
		
	}
	
    var ctrlAddItem = function (){
        var input,newItem;
        // 1.get input data from fields
        input = UICtrl.getUserInput();
        
		if(input.desc != "" && !isNaN(input.value) && input.value > 0){
				// 2.add item to budget controller
				newItem = budgetCtrl.addItem(input.type,input.desc,input.value);
				// 3.add new item to UI 
				UICtrl.addListItem(newItem,input.type);
				// 4. clear the fields
				UICtrl.clearFields();
				// 5. Calculate & update budget
				updateBudget();
				// 6. update item percentages
				updateItemProcentage();
			}else{
				
			}		
    }
	
	var ctrlDeleteItem = function(event){
		
		var itemID,splitID,type,ID;
		// ITEMID holds info that tells if the item is inc or exp.
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		
		if(itemID){
			//format of id: inc-1 , exp-1
			splitID = itemID.split('-');// using split we isolate type and id into their own variables.
			type = splitID[0];
			ID = parseInt(splitID[1]);
			// now everything is set for removing an item from datastructure & UI.
			
			// TODO:
			// 1. delete item from datasctructure
			budgetCtrl.deleteItem(type,ID);
			// 2. delete from UI 
			UICtrl.deleteListItem(itemID);
			// 3. update & show new budget
			updateBudget();
			// 4. update percentages
			updateItemProcentage();
		}
	};

    return{
        init: function(){
            console.log("Application has started.");
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			})
            setupEventListners();
            
        }
    }
   
})(budgetController,UIController);

// initalizes the eventlistners.
controller.init();
