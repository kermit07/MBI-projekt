class Visualization {
    constructor(result) {
        this.result = result;
        this.step = 0;
        // TODO - wyświetlenie panelu wizualizacji
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
        console.log("STEP " + this.step)
        if (this.step < this.result.length) {
            console.log(this.result[this.step]) // TODO
        } else if(this.step == this.result.length) {
            console.log("wyświetlenie ścieżki na diagramie") // TODO
        } else if(this.step == this.result.length + 1) {
            console.log("wyświetlenie wyniku") // TODO
        } else
            clearInterval(this.loopId);
    }

    clearAll() {
        // TODO
    }
}