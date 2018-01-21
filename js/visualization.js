class Visualization {
    constructor(result, obs) {
        this.result = result;
        this.step = 0;
        this.obs = obs;
        this.states = Object.keys(result[0]);
        this.maxes = [];
        this.maxStates = [];

        this.clearAll();
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

                var value = this.result[i][this.states[state]].prob;
                var record = $('<td></td>').attr('id', state+'_'+i).text(value);
                row.append(record);
            }
            tbody.append(row);
        }

        table.append(thead);
        table.append(tbody);
        $('#outputTable').empty();
        $('#outputTable').append(table);
    }

    showPath() {
        for (var col = this.result.length - 1; col >= 0 ; col--) {
            var max = Number.MIN_SAFE_INTEGER;
            for (var state in this.states) {
                var stateName = this.states[state];
                var currentValue = this.result[col][stateName].prob;
                if (currentValue > max) {
                    max = currentValue;
                    var maxId = state+'_'+col;
                    var maxState = this.states[state];
                }
            }
            this.maxes.push(maxId);
            this.maxStates.unshift(maxState);
        }

        var table = $('#outputTable');
        for (var id in this.maxes) {
            document.getElementById(this.maxes[id]).classList.add('path');
            this.maxes.push()
        }
    }

    showResult() {
        $('#resultSpan').text('Wynik: ' + this.maxStates.join());
    }
}

































