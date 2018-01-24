class Visualization {
    constructor(result, obs, model) {
        this.result = result;
        this.step = 0;
        this.obs = obs;
        this.states = Object.keys(result[0]);
        this.maxes = [];
        this.maxStates = [];
        this.model = model;

        this.clearAll();
    }

    reset() {
        this.step = 0;
        this.clearAll()
    }

    go() {
        if(this.step > this.result.length + 1) {
            this.clearAll()
            this.step = 0;
        }
        this.nextStep();
        this.loopId = setInterval(() => { this.nextStep(); }, 1000);
    }

    stop() {
        clearInterval(this.loopId);
    }

    nextStep() {
        this.showActualStep();
        this.step++;
    }

    showActualStep() {
        if (this.step < this.result.length) {
            this.refreshOutputTable(this.result);
        } else if(this.step == this.result.length) {
            this.showPath();
        } else if(this.step == this.result.length + 1) {
            this.showResult();
        } else
            clearInterval(this.loopId);
    }

    clearAll() {
        $('#outputTable').empty();
        $('#resultSpan').text('');
        this.maxes = [];
        this.maxStates = [];
    }

    refreshOutputTable() {

        var idPairsToHighlight
        var table = $('<table></table>').addClass('table table-sm');
        var thead = $('<thead></thead>');
        var theadRow = $('<tr></tr>');
        theadRow.append($('<th></th>').attr("scope", "col"));

        for (var i = 0 ; i <= this.step ; i++) {
            var row = $('<th></th>').attr("scope", "col").text(this.obs[i]);
            theadRow.append(row);
        }
        thead.append(theadRow);
        var tbody = $('<tbody></tbody>');
        for (var state in this.states) {
            var row = $('<tr></tr>');
            row.append($('<td></td>').attr("scope", "row").text(this.states[state]));

            for (var i = 0 ; i <= this.step ; i++) {
                var res = this.result[i][this.states[state]];
                var value = res.prob;
                var record = $('<td></td>').attr('id', state + '_' + i);
                var input = $('<input id="result_' + this.states[state] + '_' + i + '" disabled>').addClass("form-control prob-input");
                input.val(value.toFixed(4));

                record.on('click', {
                    comment: res.comment,
                    elements: res.elements,
                    prevI: res.prevI,
                    prevState: res.prevState
                }, this.onRecord);
                record.append(input);
                record.addClass('tooltipster');
                record.attr('title', res.operation);
                row.append(record);
            }
            tbody.append(row);
        }

        table.append(thead);
        table.append(tbody);
        $('#outputTable').empty();
        $('#outputTable').append(table);

        $('.tooltipster').tooltipster();
    }

    onRecord (event) {
        model.removeAllHighlights();
        for (var i = 0; i < event.data.elements.length; i++) {
            model.highlightElement(event.data.elements[i]);
        }
        if (event.data.prevState != "" && event.data.prevI >= 0) {
            model.highlightElement($("#outputTable").find("input[id='result_" + event.data.prevState + "_" + event.data.prevI + "']"));
        }
        console.log(event.data.elements)
    }

    showPath() {
        for (var col = this.result.length - 1; col >= 0 ; col--) {
            var max = Number.MIN_SAFE_INTEGER;
            for (var state in this.states) {
                var stateName = this.states[state];
                var currentValue = this.result[col][stateName].prob;
                if (currentValue > max) {
                    max = currentValue;
                    var maxId = state + '_' + col;
                    var maxState = this.states[state];
                }
            }
            this.maxes.push(maxId);
            this.maxStates.unshift(maxState);
        }

        var table = $('#outputTable');
        for (var id in this.maxes) {
            $("#outputTable").find("td[id='" + this.maxes[id] + "']").addClass('path');
            this.maxes.push()
        }
    }

    showResult() {
        $('#resultSpan').text('Wynik: ' + this.maxStates.join());
    }
}





























