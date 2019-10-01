// Module pattern
// IFFE:
/*
An Immediately Invoked Function Expression is a good way at protecting the scope of your function and the variables within it.
The idea then is to return only the parts we need, leaving the other code out of the global scope.
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
	var DOMstrings;
	
    DOMstrings = {
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
		expensePercentageLabel: ".item__percentage",
		budgetMonth: ".budget__title--month"
		
    };
	
	var getBudgetElement = function(nameOfElement){
		
		return document.querySelector(nameOfElement);
	};
	
	var nodeListForEach = function(list,callback){
				for(var i = 0; i < list.length; i++){
					callback(list[i], i);
				}
			};
	
	var formatNumber = function(num, type){
		
			var numSplit,intPart,decimalPart,sign;
			/*
			plus or minus before number.
			exactly 2 decimal points.
			comma seperating the thousands.
			2345,34353 --> +2,345,34			
			*/
			
			num = Math.abs(num);// turns number passed into method to its absolute. 
			num = num.toFixed(2);// makes sure  number has 2 decimals.
			
			numSplit = num.split(".");// splits passed in number into an array with . as delimiter
			intPart = numSplit[0];// number part.
			//checks to see if its a number in the thousands.
			if(intPart.length > 3){// if true..
				intPart = intPart.substr(0,intPart.length - 3) +","+ intPart.substr(intPart.length-3, 3);// puts the comma in the rigth place.
			}
			decimalPart = numSplit[1];// decimal part.
			
			// type === "exp" ? sign ="-" : sign ="+"; --- checks if its either a expense or income, and sets the +/- sign accordingly.
			
			return (type === "exp" ? sign ="-" : "+")+ " "+ intPart+"."+decimalPart;
		};
		
    return{
        getUserInput: function(){
            return {
                type: getBudgetElement(DOMstrings.inputType).value, // will be either inc or exp
                desc: getBudgetElement(DOMstrings.inputDescription).value,
                value:parseFloat(getBudgetElement(DOMstrings.inputValue).value) 
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
				newHtml = newHtml.replace("%value%",formatNumber(obj.value,type));
		    //3. insert html into DOM
				
				document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
				
		},
		
		deleteListItem: function(selectorID){
			var el;
			el = document.getElementById(selectorID);
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
			
			var type,budgetLabel,budgetIncomeLabel,budgetExpenseLabel,budgetPercentageLabel;
			
			obj.budget > 0 ? type = "inc" : type = "exp";
			
			budgetLabel = getBudgetElement(DOMstrings.budgetLabel);
			budgetIncomeLabel = getBudgetElement(DOMstrings.budgetIncomeLabel);
			budgetExpenseLabel = getBudgetElement(DOMstrings.budgetExpenseLabel);
			budgetPercentageLabel = getBudgetElement(DOMstrings.budgetPercentageLabel);
			
			budgetLabel.textContent = formatNumber(obj.budget,type);
			budgetIncomeLabel.textContent = formatNumber(obj.totalInc,"inc");
			budgetExpenseLabel.textContent = formatNumber(obj.totalExp,"exp");
			budgetPercentageLabel.textContent = obj.percentage;
			
			if(obj.percentage > 0 ){
				budgetPercentageLabel.textContent = obj.percentage + '%';
			}else{
				budgetPercentageLabel.textContent = '----';
			}
			
		},
		displayPercentages: function(percentages){
			
			var expenseItemPercentage;
			expenseItemPercentage = document.querySelectorAll(DOMstrings.expensePercentageLabel);
			
			nodeListForEach(expenseItemPercentage,function(curr,index){
				
				if(percentages[index] > 0){
					curr.textContent = percentages[index] + "%";
				}else{
					curr.textContent = "---";
				}
				
			});
		},
		
		displayMonth: function(){
			
			var now,year,month,monthArr,budgetMonthLabel;
			monthArr = ["January","Febuari","March","April","May","June","July","August","September","October","November","December"];
			
			now = new Date();
			year = now.getFullYear();
			month = now.getMonth();

			
			budgetMonthLabel = getBudgetElement(DOMstrings.budgetMonth);// selects element.
			budgetMonthLabel.textContent = monthArr[month] +" "+year;  //  current month & year is displayed in UI.
		},
		
		changeType: function(){
			
			var fields,inputBtn;
			
			 fields = document.querySelectorAll(DOMstrings.inputType + " , " +DOMstrings.inputDescription + " , " + DOMstrings.inputValue);
			 nodeListForEach(fields,function(curr){
				 curr.classList.toggle("red-focus");
			 });
				 
			 inputBtn = getBudgetElement(DOMstrings.addItemBTN);
			 inputBtn.classList.toggle("red");
		},
		
        getDOMstrings:function(){
            return DOMstrings;
        },
		getUIElement: function(name){
			return document.querySelector(name);
		}
    }

})();// END OF UI MODULE..


// GLOBAL-APP-CONTROLLER
var controller = (function(budgetCtrl,UICtrl){
    // get access to DOMstrings declared in UI-Controller.
    var setupEventListners = function(){
        var addBTN, typeBTN,delBTN,DOM;
		DOM = UICtrl.getDOMstrings();// gets object holding all classnames.
		
		addBTN = UICtrl.getUIElement(DOM.addItemBTN);
        addBTN.addEventListener("click",ctrlAddItem);
		
		typeBTN = UICtrl.getUIElement(DOM.inputType);
		typeBTN.addEventListener("change",UICtrl.changeType);
		
        // Global event, from anywhere in the doucment.
        document.addEventListener("keypress",function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            } 
        });
		delBTN = UICtrl.getUIElement(DOM.itemContainer);
		delBTN.addEventListener("click",ctrlDeleteItem);
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
		UICtrl.displayPercentages(percentages);
		
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
			UICtrl.displayMonth();
            setupEventListners();
            
        }
    }
   
})(budgetController,UIController);

// initalizes the eventlistners.
controller.init();
