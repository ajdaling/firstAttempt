
var BINARY_OPS = ["OR","AND"], //OR before AND
UNARY_OPS = ["NOT"];



/**
 * Recursive descent parser to translate query string
 * into JSON object that can be used to create JQuery QueryBuilder
 * GUI. Also acts as query validator.
 *
 * @param  {String} queryString [Full query string]
 * @return {Object}             [JSON Object in JQuery QB format]
 *
 * Steps:
 * Starting with expr:
 * 1. Does the string have a binary operator?
 * 	1.T.1 -> Record operator
 * 	1.T.2 -> Split string at operator
 * 	1.T.3 -> Parse left clause
 * 	1.T.4 -> Parse right expr
 *
 * 	1.F.1 -> Parse clause
 *
 * 2.
 *
 */


function rdp(queryString){
	errorCheck(queryString);
	var output = {condition: "AND",rules:[]};
	var q = "", testOut, clauses = [];
	console.log("parsing " + queryString);
	q = cleanExpr(queryString);
	// loop over 2ops and split q at op if found
	var wasSplit = false;
	for(var i = 0; i < BINARY_OPS.length; i++){
		var op = BINARY_OPS[i];
		console.log("searching " + q + " for " + op);
		var splitQ = splitRoot(op,q);

		if(splitQ.length > 1){
			console.log("found " + op);
			clauses = splitQ;
			console.log("clauses: " + JSON.stringify(clauses));
			wasSplit = true;
			output.condition = op;
			break;
		} else{
			console.log("didn't find " + op);
		}
	}
	if(!wasSplit){
		console.log("no 2op found");
		output = (parseExpr(q));
	}
	testOut = clauses;
	clauses.forEach(function(clause){
		output.rules.push(parseClause(clause));
	})
	console.log("pre-mod output");
	console.log(JSON.stringify(output));
	output = applyMods(output);
	console.log("post-mod output");
	console.log(JSON.stringify(output));
	return(output);
}

function parseExpr(q,mod){
	if(mod == undefined){mod = "NONE";}
	console.log("parsing expression " + q);
	var output = {condition: "AND",rules:[], mod: mod};
	var clauses = [];

	console.log("parsing " + q);
	q = cleanExpr(q);
	// loop over 2ops and split q at op if found
	var wasSplit = false;
	for(var i = 0; i < BINARY_OPS.length; i++){
		var op = BINARY_OPS[i];
		console.log("searching " + q + " for " + op);
		var splitQ = splitRoot(op,q);

		if(splitQ.length > 1){
			console.log("found " + op);
			clauses = splitQ;
			console.log("clauses: " + JSON.stringify(clauses));
			wasSplit = true;
			output.condition = op;
			break;
		} else{
			console.log("didn't find " + op);
		}
	}
	if(!wasSplit){
		console.log("no 2op found");
		output.rules.push(parseClause(q));
	}
	testOut = clauses;
	clauses.forEach(function(clause){
		output.rules.push(parseClause(clause));
	})
	return(output);
}


function parseClause(q){
	var retObj = {};
	console.log("parsing clause " + q);
	q = cleanExpr(q);

	console.log("checking for 1.unop 2.binop 3.term")
	//check for unary op
	if(hasUnaryOp(q) !== false){
		console.log("1op found in " + q);
		//clause has 1op(expr) so assign mod to keep track
		var unOp = hasUnaryOp(q);
		var mod = unOp;
		if(unOp === "NOT"){
			q = removeNOT(q);
		}
		retObj = parseExpr(q,mod);
	}
	//check if clause contains any binary operators, in which case it is an expr
	else if(hasBinaryOp(q)){
		console.log("2op found in " + q);
		//clause is expr so create condition and rules
		retObj.condition = "AND"; //default, will be changed later if necessary
		retObj.rules = [];
		retObj = (parseExpr(q));
	}
	//clause is just a term so parse term
	else{
		console.log("clause is term " + q);
		retObj = parseTerm(q);
	}
	return(retObj);
}

function parseTerm(q){
	var retObj = {};
	retObj.value = q;
	retObj.id = "mainQuery";
	retObj.operator = "in";
	return(retObj);
}

function applyMods(obj){
	console.log("applying mods");
	console.log(JSON.stringify(obj));

	//check if obj has NOT mod
	if(obj.mod == "NOT"){
		//flip 2op
		obj.condition === "AND" ? obj.condition = "OR" : obj.condition = "AND";
		//recursively call on each sub-object
		obj.rules.forEach(function(rule){
			rule = applyMods(rule);
		});
	}

	return(obj);
}

function applyNOT(obj){

}


//utility functions
function removeNOT(q){
	console.log("removing NOT");
	q = removeDoubleWhiteSpace(q); //eliminate whitespace if any
	q = q.replace(/^NOT/,'');
	console.log("returning " + q);
	return(q);
}
function hasUnaryOp(q){
	var ret = false;
	console.log("searching" + q + " for unary op");
	for(var i = 0; i < UNARY_OPS.length; i++){
		var op = UNARY_OPS[i];
		if(q.indexOf(op) !== -1){
			console.log("found unary op");
			has1Op = true;
			ret = op;
			break;
		}
	}
	if(ret == false){
		console.log("no 1op found");
	} else{
		console.log("1op is: " + ret);
	}
	return(ret);
}
function hasBinaryOp(q){
	console.log("searching " + q + " for 2op");
	var has2Op = false;
	for(var i = 0; i < BINARY_OPS.length; i++){
		var op = BINARY_OPS[i];
		if(q.indexOf(op) !== -1){
			has2Op = true;
			console.log("found 2op " + op);
			break;
		}
	}
	if(!has2Op){console.log("no 2op found")}
	return(has2Op);
}
function errorCheck(q){
	var countOpeningBrackets = (q.match(/\(/g) || []).length;
	console.log("( : " + countOpeningBrackets);
	var countClosingBrackets = (q.match(/\)/g) || []).length;
	console.log(") : " + countClosingBrackets);
	if(countOpeningBrackets !== countClosingBrackets){
		alert("error, parentheses don't match");
	}
}

function cleanExpr(q){
	console.log("cleaning expr " + q);
	q = removeDoubleWhiteSpace(q);
	while(containsOuterBrackets(q)){
		console.log("inside loop - " + q);
		q = removeOuterBrackets(q);
		q = removeDoubleWhiteSpace(q);
		console.log("after loop - " + q);
	}
	console.log("returning " + q);
	return(q);
}

// Returns boolean true when string contains brackets '(' or ')', at any
// position within the string
// Ex: (b AND c)  -> true
// Ex: b AND c    -> false
function containsBrackets(str) {
  return !!~str.search(/\(|\)/);
}
// Removes double whitespace in a string
// In: a b  c\nd\te
// Out: a b c d e
function removeDoubleWhiteSpace(phrase) {
  return phrase.replace(/[\s]+/g, ' ');
}

function containsOuterBrackets(phrase){
	console.log("checking " + phrase + " for outer brackets");
	// If the first character is a bracket
	var ret = false;
	phrase = phrase.trim();
	console.log("phrase length is: " + phrase.length);
	if (phrase.charAt(0) === '(') {
		// Now we'll see if the closing bracket to the first character is the last
	  	// character. If so, set ret to true.
	  	// We'll check that by incrementing the counter with every opening bracket,
		  // and decrement it with each closing bracket.
		  // When the counter hits 0. We are at the end bracket.
		  var counter = 0;
		  for (var i = 0; i < phrase.length; i++) {
			  if (phrase.charAt(i) === '('){
				  counter++;
				  console.log("found ( " + counter);// Increment the counter at each '('
			  } else if (phrase.charAt(i) === ')'){
				  counter--;
				  console.log("found ) " + counter);// Decrement the counter at each ')'
			  }

			  // If the counter is at 0, we are at the closing bracket.
			  if (counter === 0) {
				  console.log("closing bracket reached " + i);
				  // If we are not at the end of the sentence, Return false and break
				  if (i !== phrase.length - 1) {
					  console.log("not at end of phrase " + i);
					  ret = false;
					  break;
				  }
				  // If we are at the end, return the true
				  else {
					  console.log("at end of phrase " + i);
					  ret = true;
					  break;
				  }
			  }
		  }
	  }
	  return ret;
  }
// Removes the bracket at the beginning and end of a string. Only if they both
// exist. Otherwise it returns the original phrase.
// Ex: (a OR b) -> a OR b
// But yet doesn't remove the brackets when the last bracket isn't linked to
// the first bracket.
// Ex: (a OR b) AND (x OR y) -> (a OR b) AND (x OR y)
function removeOuterBrackets(phrase) {
	phrase = phrase.trim();
  // If the first character is a bracket
  if (phrase.charAt(0) === '(') {

    // Now we'll see if the closing bracket to the first character is the last
    // character. If so. Remove the brackets. Otherwise, leave it as it is.
    // We'll check that by incrementing the counter with every opening bracket,
    // and decrement it with each closing bracket.
    // When the counter hits 0. We are at the end bracket.
    var counter = 0;
    for (var i = 0; i < phrase.length; i++) {

      // Increment the counter at each '('
      if (phrase.charAt(i) === '(') counter++;

      // Decrement the counter at each ')'
      else if (phrase.charAt(i) === ')') counter--;

      // If the counter is at 0, we are at the closing bracket.
      if (counter === 0) {

        // If we are not at the end of the sentence, Return the
        // phrase as-is without modifying it
        if (i !== phrase.length - 1) {
          return phrase;
        }

        // If we are at the end, return the phrase without the surrounding brackets.
        else {
          return phrase.substring(1, phrase.length - 1);
        }
      }
    }

  }

  return phrase;
}
// Splits a phrase into multiple strings by a split term. Like the split
// function.
// But then ignores the split terms that occur in between brackets
// Example when splitting on AND:
// In: a AND (b AND c)
// Out: ['a', '(b AND c)']
// We do this by using the built in 'split' function. But as soon as we notice
// our string contains brackets, we create a temporary string, append any
// folling string from the `split` results. And stop doing that when we counted
// as many opening brackets as closing brackets. Then append that string to the
// results as a single string.
function splitRoot(splitTerm, phrase) {
	var termSplit = phrase.split(' ' + splitTerm + ' ');
	console.log(termSplit);
	var result = [];
	//Split into complete sub-expressions
	for(var i = 0; i < termSplit.length; i++) {
		console.log("inside first while " + i);
		 if (containsBrackets(termSplit[i])) {
			 	console.log("????????????");
				var tempNested = [];
				console.log("pushing " + termSplit[i] + " onto nested stack")
				tempNested.push(termSplit[i]);
				console.log("tempNested");
				console.log(tempNested);
				//re-join this term with i+n terms until complete expr is formed
				var completeExpr = false;
				var tempNestedString =  '' + tempNested;
				console.log("looking at " + tempNestedString);
				// When the tempNested contains just as much opening brackets as closing
				// brackets, we can declare it as 'complete'.
				console.log("counting brackets outside loop");
				var countOpeningBrackets = (tempNestedString.match(/\(/g) || []).length;
				var countClosingBrackets = (tempNestedString.match(/\)/g) || []).length;
				if(countOpeningBrackets === countClosingBrackets){
					completeExpr = true;
					console.log("already a complete expr");
					result.push(tempNestedString);
				}
				var j = i+1;
				while(!completeExpr && j < termSplit.length){
					console.log("inside 2nd while loop");
					tempNestedString += " " + splitTerm + " " + termSplit[j];
					console.log("new string is: " + tempNestedString);
					// When the tempNested contains just as much opening brackets as closing
					// brackets, we can declare it as 'complete'.
					var countOpeningBrackets = (tempNestedString.match(/\(/g) || []).length;
					var countClosingBrackets = (tempNestedString.match(/\)/g) || []).length;
					if(countOpeningBrackets === countClosingBrackets){
						completeExpr = true;
						console.log("found complete expr " + tempNestedString);
						result.push(tempNestedString);
						i = j;
						break;
					} else{
						console.log("not complete " + tempNestedString);
						j++;
					}
				}
				console.log("completed second while loop");
			} else{
				console.log("pushing " + termSplit[i] + " onto result");
				result.push(termSplit[i]);
			}
		 }
	return result;
}

//recursive functions
function parseExp(q){
	q.trim();
}

function unparse(q){
	console.log("unparsing");
	console.log(q);
	var recStr = "";
	if(q.condition){
		console.log("unparsing 2op");
		var op = q.condition;
		recStr += "(";
		for(var i = 0; i < q.rules.length; i++){
			if(i===0){
				console.log("adding first term to string");
				recStr += unparse(q.rules[i]);
			}else{
				console.log("adding 2op " + i + "'th term");
				recStr += " " + op + " " + unparse(q.rules[i]);
			}
		}
		recStr += ")";
	} else{
		console.log("just adding term " + q.value);
		recStr = q.value;
	}
	return(recStr);
}
