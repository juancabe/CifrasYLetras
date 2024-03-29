import re
from itertools import combinations

def generar_combinaciones(elementos):
    todas_combinaciones = []
    for r in range(1, len(elementos) + 1):
        combinaciones_de_r_elementos = list(combinations(elementos, r))
        todas_combinaciones.extend(combinaciones_de_r_elementos)
    return todas_combinaciones

class Letra:
    def __init__(self, letra, cantidad):
        self.letra = letra
        self.cantidad = cantidad
    def getLookahead(self):
        if(self.cantidad > 1):
            return f"(?=(?:.*{self.letra})" + "{" + str(self.cantidad) + "})"
        else:
            return f"(?=.*{self.letra})"
        

filename = "palabras_no_acentos.txt"


with open(filename, encoding="utf8") as file:
    # lines = file.readlines()
    data = file.read()
    print("Leidas todas la palabras del español correctamente")
    # close file
    file.close()

# Pedimos al usuario que nos introduzca las 9 letras
    
letras_user = input("Introduce las 9 letras: ")
letras_user = letras_user.lower()
lista_letras_user = list(letras_user)

# Teniendo 9 lookaheads, existen 511 combinaciones de lookaheads

todas_combinaciones = generar_combinaciones(lista_letras_user)
print(f"Total de combinaciones: {len(todas_combinaciones)}")

# Tendremos por lo tanto 511 regex

regexes = []

for combinacion in todas_combinaciones:
    regex = "^"
    elemento_visitado = []
    for elemento in combinacion:
        # Si el elemento se repite
        if combinacion.count(elemento) > 1:
            if elemento not in elemento_visitado:
                regex += Letra(elemento, combinacion.count(elemento)).getLookahead()
                elemento_visitado.append(elemento)
        else:
            regex += Letra(elemento, 1).getLookahead()
    regex += "[a-z]{" + str(len(combinacion)) + "}$"
    regexes.append(regex)
    

# Invertimos el orden de colocacion de las regex, para que las palabras mas largas se busquen primero
regexes.reverse()

# Comprobamos cuantas palabras cumplen con cada regex
palabras_restantes = []
for regex in regexes:
    # Si el regex contiene un numero inferior a 4 en el antepenultimo caracter, no lo comprobamos
    # En Cifras y Letras, no se permiten palabras de menos de 4 letras

    if regex[-3] < "4" and regex[-4] == "{":
        break
            
    palabras = re.findall(regex, data, re.MULTILINE)
    if palabras:
        for palabra in palabras:
            if palabra not in palabras_restantes:
                palabras_restantes.append(palabra)
                print(palabra)

print(f"Posibles palabras:{len(palabras_restantes)}")
            
        

