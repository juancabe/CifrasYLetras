// Función para generar todas las combinaciones de elementos de un array
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


let data; // Variable para almacenar el contenido del archivo

// Función para cargar el archivo y guardar su contenido en la variable data
function cargarArchivo() {
    const filename = "./js/palabras_no_acentos.txt"; // Nombre del archivo a cargar

    return fetch(filename)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo ${filename}: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(texto => {
            data = texto; // Guardar el contenido del archivo en la variable data
        })
        .catch(error => {
            console.error(error);
        });
}

// Llamar a la función cargarArchivo una vez, cuando se carga la página
cargarArchivo();

function buscarPalabrasEnConsola(letrasInput) {
    if (!data) {
        console.error("El archivo aún no se ha cargado.");
        return;
    }

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
    
    let palabrasLog = [];
    
    function buscarPalabrasUnaPorUna(regexIndex) {
        if (regexIndex < regexes.length) {
            let regex = regexes[regexIndex];
            let palabras = data.match(new RegExp(regex, "gm"));
            if (regex[regex.length - 3] < "4" && regex[regex.length - 4] === "{") {
                // Si la longitud es menor que 4, pasar a la siguiente iteración sin buscar palabras
                document.getElementById('buscarBtn').disabled = false;
                document.getElementById('letrasInput').disabled = false;
                return;
            }

            if (palabras) {
                palabras.forEach(palabra => {
                    if (!palabrasLog.includes(palabra)) {
                        palabrasLog.push(palabra);
                    } else { // Eliminar palabras duplicadas
                        palabras.splice(palabras.indexOf(palabra), 1);
                    }
                }
                );
                palabrasLog = palabrasLog.concat(palabras);
                palabras.forEach(palabra => {
                    mostrarPalabraEnConsola(palabra);
                });
            }
            setTimeout(() => buscarPalabrasUnaPorUna(regexIndex + 1), 0);
        } else {
            // Activar el botón de búsqueda al finalizar la búsqueda
            document.getElementById('buscarBtn').disabled = false;
            document.getElementById('letrasInput').disabled = false;
        }
    }

    buscarPalabrasUnaPorUna(0); // Comenzar la búsqueda

}
