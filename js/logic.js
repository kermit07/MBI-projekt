class Model {
	constructor() {
		this.obs = [];
		this.states = [];
		this.initiation = {};
		this.statesTranscription = {};
		this.events = [];
		this.obsProb = {};
	}

	getData() {
		return {
			o: this.obs,
			q: this.states,
			pi: this.initiation,
			a: this.statesTranscription,
			b: this.obsProb
		}
	}

	refreshModel() {
		this.refreshStates();
		this.refreshEvents();
		this.refreshObs();
		this.refreshStateTranscriptionTable();
		this.refreshObsPropTable();
		this.refreshInitTable();
    }

	stateElement(ix, name) {
		var span = $("<span></span>").text(name);
		var button = $("<button>x</button>").addClass("rem-item");
		button.click(() => this.removeState(ix));
		var div = $("<div></div>").addClass("item").append(span).append(button);
		return div;
	}

	eventElement(ix, name) {
		var span = $("<span></span>").text(name);
		var button = $("<button>x</button>").addClass("rem-item");
		button.click(() => this.removeEvent(ix));
		var button2 = $("<button>&#43;</button>").addClass("add-item");
		button2.click(() => this.addObs(name));
		var div = $("<div></div>").addClass("item").append(span).append(button).append(button2);
		return div;
	}

	obsElement(ix, name) {
		var span = $("<span></span>").text(name);
		var button = $("<button>x</button>").addClass("rem-item");
		button.click(() => this.removeObs(ix));
		var div = $("<div></div>").addClass("item").append(span).append(button);
		return div;
	}

	removeState(ix) {
		delete this.statesTranscription[this.states[ix]]
		delete this.obsProb[this.states[ix]]
		delete this.initiation[this.states[ix]];
		this.states.splice(ix, 1);
		this.refreshStates();
		this.refreshInitTable();
		this.refreshStateTranscriptionTable();
		this.refreshObsPropTable();
	}

	addState(value) {
		if ($.inArray(value, this.states) != -1) {
			$("#addStateAlert").css('display', 'inline-block');
			setTimeout(() => $("#addStateAlert").hide(), 2000);
			return;
		}
		this.states.push(value);
		this.initiation[value] = 0;
		this.statesTranscription[value] = {};
		for (var x in this.states) {
			this.statesTranscription[value][this.states[x]] = 0;
			this.statesTranscription[this.states[x]][value] = 0;
		}
		this.obsProb[value] = {};
		for (var x in this.events)
			this.obsProb[value][this.events[x]] = 0;
		this.refreshStates();
		this.refreshInitTable();
		this.refreshStateTranscriptionTable();
		this.refreshObsPropTable();
	}

	refreshStates() {
		$("#stateList").empty();
		for (var x in this.states)
			$("#stateList").append(this.stateElement(x, this.states[x]));
		this.states.length > 0 ? $("#initGroup").show() : $("#initGroup").hide();
		this.states.length > 0 ? $("#transcriptionGroup").show() : $("#transcriptionGroup").hide();
	}

	removeEvent(ix) {
		for (var i = this.obs.length-1; i>=0; i--) {
			if (this.obs[i] == this.events[ix])
				this.obs.splice(i, 1);
		}
		for (var x in this.states) {
			delete this.obsProb[this.states[x]][this.events[ix]];
		}
		this.events.splice(ix, 1);
		this.refreshEvents();
		this.refreshObs();
		this.refreshObsPropTable();
	}

	addEvent(value) {
		if ($.inArray(value, this.events) != -1) {
			$("#addEventAlert").css('display', 'inline-block');
			setTimeout(() => $("#addEventAlert").hide(), 2000);
			return;
		}
		this.events.push(value);
		this.refreshEvents();
		for (var x in this.states)
			this.obsProb[this.states[x]][value] = 0;
		this.refreshObsPropTable();
	}

	refreshEvents() {
		$("#eventList").empty();
		for (var x in this.events) 
			$("#eventList").append(this.eventElement(x, this.events[x]));
		this.events.length > 0 ? $("#obsGroup").show() : $("#obsGroup").hide();
		this.events.length > 0 ? $("#obsProbGroup").show() : $("#obsProbGroup").hide();
	}

	removeObs(ix) {
		this.obs.splice(ix, 1);
		this.refreshObs();
	}

	addObs(value) {
		this.obs.push(value);
		this.refreshObs();
	}

	refreshObs() {
		$("#obsList").empty();
		for (var x in this.obs)
			$("#obsList").append(this.obsElement(x, this.obs[x]));
		if (this.obs.length == 0)
			$("#obsList").append("<span>Aby dodać obserwację kliknij &#43; na liście możliwych zdarzeń</span>");
	}

	refreshInitTable() {
		var table = $('<table></table>').addClass('table table-sm');
		var thead = $('<thead></thead>');
		var theadRow = $('<tr></tr>');
		for (var s in this.states) {
		    var row = $('<th></th>').attr("scope", "col").text(this.states[s]);
		    theadRow.append(row);
		}
		thead.append(theadRow);
		var tbody = $('<tbody></tbody>');
		var row = $('<tr></tr>');
		for (var x in this.states) {
			var input = $('<input id="init_' + x + '" type="number" step="0.1">').addClass("form-control prob-input");
			input.val(this.initiation[this.states[x]]);
	    	var record = $('<td></td>').append(input);
			row.append(record);
		}
		tbody.append(row);
		table.append(thead);
		table.append(tbody);
		$('#initTable').empty();
		$('#initTable').append(table);
	}

	refreshStateTranscriptionTable() {
		var table = $('<table></table>').addClass('table table-sm');
		var thead = $('<thead></thead>');
		var theadRow = $('<tr></tr>');
		theadRow.append($('<th></th>').attr("scope", "col"));
		for (var s in this.states) {
		    var row = $('<th></th>').attr("scope", "col").text(this.states[s]);
		    theadRow.append(row);
		}
		thead.append(theadRow);
		var tbody = $('<tbody></tbody>');
		for (var r in this.states) {
			var row = $('<tr></tr>');
			row.append($('<th></th>').attr("scope", "row").text(this.states[r]));
			for (var c in this.states) {
				var input = $('<input id="stateTrans_' + r + '_' + c + '" type="number" step="0.1">').addClass("form-control prob-input");
				input.val(this.statesTranscription[this.states[r]][this.states[c]]);
		    	var record = $('<td></td>').append(input);
				row.append(record);
			}
			tbody.append(row);
		}
		table.append(thead);
		table.append(tbody);
		$('#stateTranscriptionTable').empty();
		$('#stateTranscriptionTable').append(table);
	}

	refreshObsPropTable() {
		var table = $('<table></table>').addClass('table table-sm');
		var thead = $('<thead></thead>');
		var theadRow = $('<tr></tr>');
		theadRow.append($('<th></th>').attr("scope", "col"));
		for (var x in this.events) {
		    var row = $('<th></th>').attr("scope", "col").text(this.events[x]);
		    theadRow.append(row);
		}
		thead.append(theadRow);
		var tbody = $('<tbody></tbody>');
		for (var r in this.states) {
			var row = $('<tr></tr>');
			row.append($('<th></th>').attr("scope", "row").text(this.states[r]));
			for (var c in this.events) {
				var input = $('<input id="obsProb_' + r + '_' + c + '" type="number" step="0.1">').addClass("form-control prob-input");
				input.val(this.obsProb[this.states[r]][this.events[c]]);
		    	var record = $('<td></td>').append(input);
				row.append(record);
			}
			tbody.append(row);
		}
		table.append(thead);
		table.append(tbody);
		$('#obsProbTable').empty();
		$('#obsProbTable').append(table);
	}

	highlightElement(x) {
		x.addClass("highlight");
	}

	removeAllHighlights() {
		$("#initTable").find("input").removeClass("highlight");
		$("#stateTranscriptionTable").find("input").removeClass("highlight");
		$("#obsProbTable").find("input").removeClass("highlight");
		$("#outputTable").find("input").removeClass("highlight");
	}

	checkData() {
        $("#obsProbTable table tbody").find('tr').each(function (rowNumber, row) {
            var state = model.states[rowNumber];
            $(this).find('td').each(function(colNumber, col){
                var value = $(this).find('input').val();
                model.obsProb[state][model.events[colNumber]] = value;
            });
        });

        $("#initTable table tbody").find('td').each(function (rowNumber, row) {
            model.initiation[model.states[rowNumber]] = $(this).find('input').val();
        });

        $("#stateTranscriptionTable table tbody").find('tr').each(function (rowNumber, row) {
            var state = model.states[rowNumber];
            $(this).find('td').each(function(colNumber, col){
                var value = $(this).find('input').val();
                model.statesTranscription[state][model.states[colNumber]] = value;
            });
        });
    }

	loadModel1() {
		this.states = ["Healthy", "Fever"];
		this.initiation = {};
		this.initiation[this.states[0]] = 0.6;
		this.initiation[this.states[1]] = 0.4;
		this.statesTranscription = {};
		this.statesTranscription[this.states[0]] = {};
		this.statesTranscription[this.states[0]][this.states[0]] = 0.7;
		this.statesTranscription[this.states[0]][this.states[1]] = 0.3;
		this.statesTranscription[this.states[1]] = {};
		this.statesTranscription[this.states[1]][this.states[0]] = 0.4;
		this.statesTranscription[this.states[1]][this.states[1]] = 0.6;
		this.events = ['normal', 'cold', 'dizzy'];
		this.obsProb = {};
		this.obsProb[this.states[0]] = {};
		this.obsProb[this.states[0]][this.events[0]] = 0.5;
		this.obsProb[this.states[0]][this.events[1]] = 0.4;
		this.obsProb[this.states[0]][this.events[2]] = 0.1;
		this.obsProb[this.states[1]] = {};
		this.obsProb[this.states[1]][this.events[0]] = 0.1;
		this.obsProb[this.states[1]][this.events[1]] = 0.3;
		this.obsProb[this.states[1]][this.events[2]] = 0.6;
		this.obs = ['normal', 'cold', 'dizzy', 'cold', 'dizzy'];
	}

	loadModel2() {
		this.states = ['hot', 'cold'];
		this.initiation = {};
		this.initiation[this.states[0]] = 0.6;
		this.initiation[this.states[1]] = 0.4;
		this.statesTranscription = {};
		this.statesTranscription[this.states[0]] = {};
		this.statesTranscription[this.states[0]][this.states[0]] = 0.7;
		this.statesTranscription[this.states[0]][this.states[1]] = 0.3;
		this.statesTranscription[this.states[1]] = {};
		this.statesTranscription[this.states[1]][this.states[0]] = 0.4;
		this.statesTranscription[this.states[1]][this.states[1]] = 0.6;
		this.events = ['small', 'medium', 'large'];
		this.obsProb = {};
		this.obsProb[this.states[0]] = {};
		this.obsProb[this.states[0]][this.events[0]] = 0.1;
		this.obsProb[this.states[0]][this.events[1]] = 0.4;
		this.obsProb[this.states[0]][this.events[2]] = 0.5;
		this.obsProb[this.states[1]] = {};
		this.obsProb[this.states[1]][this.events[0]] = 0.7;
		this.obsProb[this.states[1]][this.events[1]] = 0.2;
		this.obsProb[this.states[1]][this.events[2]] = 0.1;
		this.obs = ['small', 'medium', 'small', 'large'];
	}

	loadModel3() {
		this.states = ['a+', 'c+', 'g+', 't+', 'a-', 'c-', 'g-', 't-'];
		this.initiation = {};
		this.initiation[this.states[0]] = 0.125;
		this.initiation[this.states[1]] = 0.125;
		this.initiation[this.states[2]] = 0.125;
		this.initiation[this.states[3]] = 0.125;
		this.initiation[this.states[4]] = 0.125;
		this.initiation[this.states[5]] = 0.125;
		this.initiation[this.states[6]] = 0.125;
		this.initiation[this.states[7]] = 0.125;
		this.statesTranscription = {};
		this.statesTranscription[this.states[0]] = {};
		this.statesTranscription[this.states[0]][this.states[0]] = 0.17;
		this.statesTranscription[this.states[0]][this.states[1]] = 0.257;
		this.statesTranscription[this.states[0]][this.states[2]] = 0.409;
		this.statesTranscription[this.states[0]][this.states[3]] = 0.114;
		this.statesTranscription[this.states[0]][this.states[4]] = 0.009;
		this.statesTranscription[this.states[0]][this.states[5]] = 0.014;
		this.statesTranscription[this.states[0]][this.states[6]] = 0.021;
		this.statesTranscription[this.states[0]][this.states[7]] = 0.006;
		this.statesTranscription[this.states[1]] = {};
		this.statesTranscription[this.states[1]][this.states[0]] = 0.162;
		this.statesTranscription[this.states[1]][this.states[1]] = 0.351;
		this.statesTranscription[this.states[1]][this.states[2]] = 0.257;
		this.statesTranscription[this.states[1]][this.states[3]] = 0.18;
		this.statesTranscription[this.states[1]][this.states[4]] = 0.009;
		this.statesTranscription[this.states[1]][this.states[5]] = 0.018;
		this.statesTranscription[this.states[1]][this.states[6]] = 0.014;
		this.statesTranscription[this.states[1]][this.states[7]] = 0.009;
		this.statesTranscription[this.states[2]] = {};
		this.statesTranscription[this.states[2]][this.states[0]] = 0.152;
		this.statesTranscription[this.states[2]][this.states[1]] = 0.323;
		this.statesTranscription[this.states[2]][this.states[2]] = 0.352;
		this.statesTranscription[this.states[2]][this.states[3]] = 0.123;
		this.statesTranscription[this.states[2]][this.states[4]] = 0.008;
		this.statesTranscription[this.states[2]][this.states[5]] = 0.017;
		this.statesTranscription[this.states[2]][this.states[6]] = 0.019;
		this.statesTranscription[this.states[2]][this.states[7]] = 0.006;
		this.statesTranscription[this.states[3]] = {};
		this.statesTranscription[this.states[3]][this.states[0]] = 0.076;
		this.statesTranscription[this.states[3]][this.states[1]] = 0.343;
		this.statesTranscription[this.states[3]][this.states[2]] = 0.361;
		this.statesTranscription[this.states[3]][this.states[3]] = 0.17;
		this.statesTranscription[this.states[3]][this.states[4]] = 0.004;
		this.statesTranscription[this.states[3]][this.states[5]] = 0.018;
		this.statesTranscription[this.states[3]][this.states[6]] = 0.019;
		this.statesTranscription[this.states[3]][this.states[7]] = 0.009;
		this.statesTranscription[this.states[4]] = {};
		this.statesTranscription[this.states[4]][this.states[0]] = 0.03;
		this.statesTranscription[this.states[4]][this.states[1]] = 0.02;
		this.statesTranscription[this.states[4]][this.states[2]] = 0.029;
		this.statesTranscription[this.states[4]][this.states[3]] = 0.021;
		this.statesTranscription[this.states[4]][this.states[4]] = 0.27;
		this.statesTranscription[this.states[4]][this.states[5]] = 0.18;
		this.statesTranscription[this.states[4]][this.states[6]] = 0.261;
		this.statesTranscription[this.states[4]][this.states[7]] = 0.189;
		this.statesTranscription[this.states[5]] = {};
		this.statesTranscription[this.states[5]][this.states[0]] = 0.031;
		this.statesTranscription[this.states[5]][this.states[1]] = 0.03;
		this.statesTranscription[this.states[5]][this.states[2]] = 0.008;
		this.statesTranscription[this.states[5]][this.states[3]] = 0.03;
		this.statesTranscription[this.states[5]][this.states[4]] = 0.29;
		this.statesTranscription[this.states[5]][this.states[5]] = 0.27;
		this.statesTranscription[this.states[5]][this.states[6]] = 0.071;
		this.statesTranscription[this.states[5]][this.states[7]] = 0.27;
		this.statesTranscription[this.states[6]] = {};
		this.statesTranscription[this.states[6]][this.states[0]] = 0.025;
		this.statesTranscription[this.states[6]][this.states[1]] = 0.025;
		this.statesTranscription[this.states[6]][this.states[2]] = 0.03;
		this.statesTranscription[this.states[6]][this.states[3]] = 0.02;
		this.statesTranscription[this.states[6]][this.states[4]] = 0.225;
		this.statesTranscription[this.states[6]][this.states[5]] = 0.225;
		this.statesTranscription[this.states[6]][this.states[6]] = 0.27;
		this.statesTranscription[this.states[6]][this.states[7]] = 0.18;
		this.statesTranscription[this.states[7]] = {};
		this.statesTranscription[this.states[7]][this.states[0]] = 0.018;
		this.statesTranscription[this.states[7]][this.states[1]] = 0.024;
		this.statesTranscription[this.states[7]][this.states[2]] = 0.03;
		this.statesTranscription[this.states[7]][this.states[3]] = 0.023;
		this.statesTranscription[this.states[7]][this.states[4]] = 0.162;
		this.statesTranscription[this.states[7]][this.states[5]] = 0.212;
		this.statesTranscription[this.states[7]][this.states[6]] = 0.27;
		this.statesTranscription[this.states[7]][this.states[7]] = 0.261;
		this.events = ['A', 'C', 'G', 'T'];
		this.obsProb = {};
		this.obsProb[this.states[0]] = {};
		this.obsProb[this.states[0]][this.events[0]] = 1;
		this.obsProb[this.states[0]][this.events[1]] = 0;
		this.obsProb[this.states[0]][this.events[2]] = 0;
		this.obsProb[this.states[0]][this.events[3]] = 0;
		this.obsProb[this.states[1]] = {};
		this.obsProb[this.states[1]][this.events[0]] = 0;
		this.obsProb[this.states[1]][this.events[1]] = 1;
		this.obsProb[this.states[1]][this.events[2]] = 0;
		this.obsProb[this.states[1]][this.events[3]] = 0;
		this.obsProb[this.states[2]] = {};
		this.obsProb[this.states[2]][this.events[0]] = 0;
		this.obsProb[this.states[2]][this.events[1]] = 0;
		this.obsProb[this.states[2]][this.events[2]] = 1;
		this.obsProb[this.states[2]][this.events[3]] = 0;
		this.obsProb[this.states[3]] = {};
		this.obsProb[this.states[3]][this.events[0]] = 0;
		this.obsProb[this.states[3]][this.events[1]] = 0;
		this.obsProb[this.states[3]][this.events[2]] = 0;
		this.obsProb[this.states[3]][this.events[3]] = 1;
		this.obsProb[this.states[4]] = {};
		this.obsProb[this.states[4]][this.events[0]] = 1;
		this.obsProb[this.states[4]][this.events[1]] = 0;
		this.obsProb[this.states[4]][this.events[2]] = 0;
		this.obsProb[this.states[4]][this.events[3]] = 0;
		this.obsProb[this.states[5]] = {};
		this.obsProb[this.states[5]][this.events[0]] = 0;
		this.obsProb[this.states[5]][this.events[1]] = 1;
		this.obsProb[this.states[5]][this.events[2]] = 0;
		this.obsProb[this.states[5]][this.events[3]] = 0;
		this.obsProb[this.states[6]] = {};
		this.obsProb[this.states[6]][this.events[0]] = 0;
		this.obsProb[this.states[6]][this.events[1]] = 0;
		this.obsProb[this.states[6]][this.events[2]] = 1;
		this.obsProb[this.states[6]][this.events[3]] = 0;
		this.obsProb[this.states[7]] = {};
		this.obsProb[this.states[7]][this.events[0]] = 0;
		this.obsProb[this.states[7]][this.events[1]] = 0;
		this.obsProb[this.states[7]][this.events[2]] = 0;
		this.obsProb[this.states[7]][this.events[3]] = 1;
		this.obs = ['C', 'G', 'C', 'G'];
	}
}
var model;
var vis;

init = function() {
	model = new Model();
	model.refreshModel();
	// console.log(model)
}

addState = function(event) {
	if (event.keyCode == 13 && event.srcElement.value.length > 0) {
		model.addState(event.srcElement.value);
		event.srcElement.value = "";
	}
}

addEvent = function(event) {
	if (event.keyCode == 13 && event.srcElement.value.length > 0) {
		model.addEvent(event.srcElement.value);
		event.srcElement.value = "";
	}
}

onLoad = function() {
	// TODO walidacja

    model.checkData();
	var myViterbi = new Viterbi(false);
	var firstSet = model.getData();
	var result = myViterbi.go(firstSet.o, firstSet.q, firstSet.pi, firstSet.a, firstSet.b);
    console.log(result);
	vis = new Visualization(result, model.getData().o, model);

	$("#stateGroup").hide();
	$("#eventsGroup").hide();

	$("#visualizationPanel").show();
	$("#emptyPanel").hide();

}

visReset = function() {
	vis.reset();
}

visNextStep = function() {
	vis.nextStep();
}

visGo = function() {
	vis.go();
}

visStop = function() {
	vis.stop();
}

loadSample1 = function() {
	this.model.loadModel1();
	model.refreshModel();
}

loadSample2 = function() {
	this.model.loadModel2();
	model.refreshModel();
}

loadSample3 = function() {
	this.model.loadModel3();
	model.refreshModel();
}