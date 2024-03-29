function combinations(arr, r) {
    const result = [];
    const helper = (currentIndex, currentCombination) => {
        if (currentCombination.length === r) {
            result.push(currentCombination);
            return;
        }
        if (currentIndex === arr.length) return;
        helper(currentIndex + 1, currentCombination.concat(arr[currentIndex]));
        helper(currentIndex + 1, currentCombination);
    };
    helper(0, []);
    return result;
}

function generarCombinaciones(elementos) {
    let todasCombinaciones = [];
    for (let r = 1; r <= elementos.length; r++) {
        let combinacionesDeRElementos = combinations(elementos, r);
        combinacionesDeRElementos.forEach(combination => {
            todasCombinaciones.push(combination);
        });
    }
    return todasCombinaciones;
}


class Letra {
    constructor(letra, cantidad) {
        this.letra = letra;
        this.cantidad = cantidad;
    }
    getLookahead() {
        if (this.cantidad > 1) {
            return `(?=(?:.*${this.letra}){${this.cantidad}})`;
        } else {
            return `(?=.*${this.letra})`;
        }
    }
}

function buscarPalabrasEnConsola(letrasInput, callback) {
    const filename = "palabras_no_acentos.txt";

    fetch(filename)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo ${filename}: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            let listaLetrasUser = letrasInput.split('');

            let todasCombinaciones = generarCombinaciones(listaLetrasUser);

            let regexes = [];

            todasCombinaciones.forEach(combinacion => {
                let regex = "^";
                let elementoVisitado = [];
                combinacion.forEach(elemento => {
                    if (combinacion.filter(el => el === elemento).length > 1) {
                        if (!elementoVisitado.includes(elemento)) {
                            regex += new Letra(elemento, combinacion.filter(el => el === elemento).length).getLookahead();
                            elementoVisitado.push(elemento);
                        }
                    } else {
                        regex += new Letra(elemento, 1).getLookahead();
                    }
                });
                regex += `[a-z]{${combinacion.length}}$`;
                regexes.push(regex);
            });

            regexes.reverse();

            let palabrasRestantes = [];
            regexes.forEach(regex => {
                if (regex[regex.length - 3] < "4" && regex[regex.length - 4] === "{") {
                    return;
                }
                let palabras = data.match(new RegExp(regex, "gm"));
                if (palabras) {
                    palabras.forEach(palabra => {
                        if (!palabrasRestantes.includes(palabra)) {
                            palabrasRestantes.push(palabra);
                            callback(palabra);
                        }
                    });
                }
            });
        })
        .catch(error => {
            console.error(error);
        });
}
