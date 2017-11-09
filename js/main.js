function myMul(a,b) {
	return Math.round(10000000*a*b)/10000000;
}

class Viterbi {

	constructor(showLogs) {
		this.showLogs = showLogs;
	}

	log(text) {
		if(this.showLogs) console.log(text);
	}

	/* 
		O -> sekwencja obserwacji
		Q -> stany procesu Markowa
		Pi -> stany inicjalne
		A -> prawdopodobieństwa przemian stanów: A[q1][q2] - prawdopodobieństwo przemiany stanu q1 na q2
		B -> macierz prawdopodobieństw obserwacji: B[q][o] - prawdopodobieństwo wystąpienia obserwacji o w stanie q
	*/
	go (O, Q, Pi, A, B) {
		this.log("start...");
		var V = [];
		V.push({});
		this.log("____Poczatek - obserwacja: " + O[0])
		this.log("dla kazdego ze stnow Q wstawiamy V[0]")
		for (var q in Q) {
			V[0][Q[q]] = {prob: myMul(Pi[Q[q]], B[Q[q]][O[0]]), prev: null};
			this.log("V[0]["+Q[q]+"]: " + myMul(Pi[Q[q]], B[Q[q]][O[0]]));
		}
		this.log("")
		
		for (var t = 1; t < O.length; t++) {
			this.log("__Krok " + t + " - obserwacja: " + O[t-1] + " -> " + O[t])
			V.push({});
			for (var i in Q) {
				var maxTrProb = Math.max.apply(Math,
								 Q.map((q) => {
								 	return myMul(V[t-1][q].prob, A[q][Q[i]]); }));
				for (var j in Q) {
					if (myMul(V[t-1][Q[j]].prob, A[Q[j]][Q[i]]) == maxTrProb) {
						this.log("_Stan: " + Q[i] + ", maxProb = " + maxTrProb + ", stan poprzedni = " + Q[j])
						V[t][Q[i]] = {prob: myMul(maxTrProb, B[Q[i]][O[t]]), prev: Q[j]};
						this.log("V["+t+"]["+Q[i]+"]: " + myMul(maxTrProb, B[Q[i]][O[t]]));
                     	break;
					}
				}
			}
			this.log("")
		}
		var vl = V.length;
		this.maxProb = Math.max.apply(Math, 
					   Object.keys(V[vl-1]).map((k) => { return V[vl-1][k].prob; }));
		var opt = [];
		var previous = null;
		for (var v in V[vl-1])
			if (V[vl-1][v].prob == this.maxProb) {
				opt.push(v);
	            previous = v;
	            break;
			}

		for (var i = vl-2; i >= 0; i--) {
	        opt.unshift(V[i + 1][previous].prev);
	        previous = V[i + 1][previous].prev;
		}

		this.log(opt);
		return V;
	}

}