export interface Challenge {
  id: number;
  title: string;
  category: string;
  type?: 'lesson' | 'project';
  lesson: string;      // Markdown: teoría + ejemplo de código
  instructions: string; // El enunciado claro del reto
  initialCode: string; // Código inicial/plantilla en el editor
}

export const CHALLENGES: Challenge[] = [
  // ─────────────────────────────────────────────
  // MÓDULO 1: Fundamentos
  // ─────────────────────────────────────────────
  {
    id: 1,
    title: "1. Tu primer programa",
    category: "Fundamentos",
    lesson: `## ¿Qué es \`print()\`?

La función \`print()\` es la más básica de Python. Sirve para **mostrar mensajes en la pantalla**.

\`\`\`python
# Ejemplo básico
print("¡Hola Mundo!")

# Puedes imprimir cualquier texto entre comillas
print("Bienvenido a Python")
print("Esto es un programa")
\`\`\`

> 💡 **Nota:** El texto que quieras mostrar siempre debe ir entre comillas (\`"\`) o apóstrofes (\`'\`).`,
    instructions: `**Tu reto:** Modifica el código de abajo para que imprima **tu nombre** en lugar de \`¡Hola Mundo!\`.`,
    initialCode: 'print("¡Hola Mundo!")'
  },
  {
    id: 2,
    title: "2. Variables y Entrada de Datos",
    category: "Fundamentos",
    lesson: `## Variables e \`input()\`

Una **variable** es como una caja donde guardas información para usarla después.

\`\`\`python
# Ejemplo: guardar un texto en una variable
ciudad = "Madrid"
print(ciudad)  # Imprime: Madrid
\`\`\`

La función \`input()\` le **pide datos al usuario** mientras el programa corre.

\`\`\`python
# Ejemplo: pedir el nombre al usuario
nombre = input("¿Cuál es tu nombre? ")
print("Hola,", nombre)
\`\`\`

Los **f-strings** son la forma más limpia de combinar texto y variables:

\`\`\`python
edad = 22
print(f"Tengo {edad} años")  # Imprime: Tengo 22 años
\`\`\``,
    instructions: `**Tu reto:** Usa \`input()\` para pedir el nombre del usuario y luego imprímelo con un saludo usando un f-string. Por ejemplo: \`¡Hola, David!\``,
    initialCode: '# Pide el nombre al usuario e imprímelo\nnombre = input("¿Cuál es tu nombre? ")\nprint(f"¡Hola, {nombre}!")'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 2: Control de Flujo
  // ─────────────────────────────────────────────
  {
    id: 3,
    title: "3. Condicionales (If/Else)",
    category: "Control de Flujo",
    lesson: `## Condicionales: If / Else

Los condicionales permiten que tu programa **tome decisiones** según una condición.

\`\`\`python
# Ejemplo: verificar si un número es positivo
numero = 10

if numero > 0:
    print("El número es positivo")
else:
    print("El número no es positivo")
\`\`\`

También puedes encadenar condiciones con \`elif\`:

\`\`\`python
nota = 75

if nota >= 90:
    print("Excelente")
elif nota >= 60:
    print("Aprobado")
else:
    print("Reprobado")
\`\`\`

> ⚠️ La indentación (4 espacios) es **obligatoria** en Python. Sin ella, el programa falla.`,
    instructions: `**Tu reto:** Pide la edad al usuario con \`input()\`. Si la edad es mayor o igual a 18, imprime \`"Eres mayor de edad"\`. De lo contrario, imprime \`"Eres menor de edad"\`.`,
    initialCode: 'edad = int(input("Ingresa tu edad: "))\n\nif edad >= 18:\n    print("Eres mayor de edad")\nelse:\n    print("Eres menor de edad")'
  },
  {
    id: 4,
    title: "4. Bucle For y Listas",
    category: "Control de Flujo",
    lesson: `## Listas y el Bucle \`for\`

Una **lista** almacena múltiples valores en una sola variable:

\`\`\`python
colores = ["rojo", "verde", "azul"]
print(colores[0])  # Imprime: rojo (índice empieza en 0)
\`\`\`

El **bucle for** itera (recorre) cada elemento de la lista:

\`\`\`python
numeros = [1, 2, 3, 4, 5]

for numero in numeros:
    print(numero)
# Imprime: 1, 2, 3, 4, 5 (uno por línea)
\`\`\`

Métodos útiles de los strings:

\`\`\`python
palabra = "python"
print(palabra.upper())   # PYTHON
print(palabra.capitalize()) # Python
\`\`\``,
    instructions: `**Tu reto:** Crea una lista con al menos 4 frutas. Usa un bucle \`for\` para imprimir cada fruta en **mayúsculas** usando el método \`.upper()\`.`,
    initialCode: 'frutas = ["manzana", "banana", "cereza", "uva"]\n\nfor fruta in frutas:\n    print(fruta.upper())'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 3: Funciones y Estructuras
  // ─────────────────────────────────────────────
  {
    id: 5,
    title: "5. Funciones",
    category: "Funciones",
    lesson: `## ¿Qué es una función?

Una **función** es un bloque de código reutilizable. Lo defines una vez y lo usas muchas veces.

\`\`\`python
# Ejemplo: función que saluda
def saludar(nombre):
    print(f"¡Hola, {nombre}!")

saludar("Ana")   # ¡Hola, Ana!
saludar("Pedro") # ¡Hola, Pedro!
\`\`\`

Las funciones pueden **retornar** un valor con \`return\`:

\`\`\`python
def multiplicar(a, b):
    return a * b

resultado = multiplicar(4, 5)
print(resultado)  # 20
\`\`\`

> 💡 **Buena práctica:** Una función debe hacer **una sola cosa** y hacerla bien (Principio de Responsabilidad Única - SRP).`,
    instructions: `**Tu reto:** Crea una función llamada \`suma\` que pida dos números al usuario con \`input()\`, los sume e imprima el resultado. Luego llama a la función.`,
    initialCode: 'def suma():\n    num1 = int(input("Ingresa un número: "))\n    num2 = int(input("Ingresa otro número: "))\n    resultado = num1 + num2\n    print(f"Su suma es: {resultado}")\n    return resultado\n\nsuma()'
  },
  {
    id: 6,
    title: "6. Diccionarios",
    category: "Estructuras de Datos",
    lesson: `## Diccionarios en Python

Un **diccionario** almacena datos en pares **clave: valor**. Es perfecto para representar objetos del mundo real.

\`\`\`python
# Ejemplo: datos de una persona
persona = {
    "nombre": "Carlos",
    "edad": 30,
    "ciudad": "Bogotá"
}

# Acceder a un valor por su clave
print(persona["nombre"])  # Carlos
print(persona["edad"])    # 30
\`\`\`

Puedes agregar, modificar o eliminar entradas:

\`\`\`python
persona["email"] = "carlos@email.com"  # Agregar
persona["edad"] = 31                   # Modificar
del persona["ciudad"]                  # Eliminar
\`\`\``,
    instructions: `**Tu reto:** Crea un diccionario llamado \`usuario\` con las llaves \`"nombre"\`, \`"edad"\` y \`"lenguaje"\`. Luego imprime un mensaje que diga algo como: \`"El usuario David aprende Python."\``,
    initialCode: 'usuario = {\n    "nombre": "David",\n    "edad": 22,\n    "lenguaje": "Python"\n}\n\nprint(f"El usuario {usuario[\'nombre\']} aprende {usuario[\'lenguaje\']}.")'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 4: Programación Orientada a Objetos
  // ─────────────────────────────────────────────
  {
    id: 7,
    title: "7. Clases y Objetos",
    category: "Programación Orientada a Objetos",
    lesson: `## Programación Orientada a Objetos (POO)

Una **clase** es como un molde o plantilla para crear objetos. Por ejemplo, \`Persona\` es una clase; "Ana de 25 años" es un **objeto** de esa clase.

\`\`\`python
class Carro:
    # __init__ se ejecuta al crear un objeto (Constructor)
    def __init__(self, marca, modelo):
        self.marca = marca    # Atributo
        self.modelo = modelo  # Atributo

    # Método: una función dentro de la clase
    def describirse(self):
        print(f"Soy un {self.marca} {self.modelo}")

# Crear objetos (instancias)
mi_carro = Carro("Toyota", "Corolla")
mi_carro.describirse()  # Soy un Toyota Corolla
\`\`\``,
    instructions: `**Tu reto:** Crea una clase \`Persona\` con atributos \`nombre\` y \`edad\`. Agrégale un método \`presentarse()\` que imprima algo como: \`"Hola, soy Ana y tengo 25 años."\`. Crea al menos un objeto y llama al método.`,
    initialCode: 'class Persona:\n    def __init__(self, nombre, edad):\n        self.nombre = nombre\n        self.edad = edad\n        \n    def presentarse(self):\n        print(f"Hola, soy {self.nombre} y tengo {self.edad} años.")\n\np1 = Persona("Ana", 25)\np1.presentarse()'
  },
  {
    id: 8,
    title: "8. Encapsulamiento",
    category: "Programación Orientada a Objetos",
    lesson: `## Encapsulamiento

El **encapsulamiento** es proteger los datos internos de un objeto para que no puedan ser modificados directamente desde fuera. Se logra con atributos **privados** (doble guion bajo \`__\`).

\`\`\`python
class Caja:
    def __init__(self):
        self.__contenido = "secreto"  # Privado

    def ver_contenido(self):  # Getter
        return self.__contenido

    def cambiar_contenido(self, nuevo): # Setter
        if isinstance(nuevo, str):
            self.__contenido = nuevo

mi_caja = Caja()
# Esto daría error: print(mi_caja.__contenido)
print(mi_caja.ver_contenido())  # "secreto"
\`\`\`

> 🔒 La idea es que el acceso a los datos pase siempre por los **métodos que tú controlas**.`,
    instructions: `**Tu reto:** Crea una clase \`Cuenta\` con un atributo privado \`__saldo\` iniciado en 0. Agrega los métodos \`depositar(monto)\` (que valide que el monto sea positivo) y \`obtener_saldo()\`. Pruébala creando un objeto y depositando dinero.`,
    initialCode: 'class Cuenta:\n    def __init__(self):\n        self.__saldo = 0\n        \n    def depositar(self, monto):\n        if monto > 0:\n            self.__saldo += monto\n            \n    def obtener_saldo(self):\n        return self.__saldo\n\nmi_cuenta = Cuenta()\nmi_cuenta.depositar(100)\nprint("Saldo:", mi_cuenta.obtener_saldo())'
  },
  {
    id: 9,
    title: "9. Herencia y Polimorfismo",
    category: "Programación Orientada a Objetos",
    lesson: `## Herencia

La **herencia** permite crear una clase nueva (hija) que hereda atributos y métodos de otra clase (padre), evitando repetir código.

\`\`\`python
class Vehiculo:      # Clase padre
    def mover(self):
        print("El vehículo se mueve")

class Bicicleta(Vehiculo):  # Clase hija
    def mover(self):
        print("La bicicleta pedalea")  # Sobrescribe el método

class Avion(Vehiculo):
    def mover(self):
        print("El avión vuela")

# Polimorfismo: misma interfaz, diferente comportamiento
for v in [Bicicleta(), Avion()]:
    v.mover()
\`\`\`

> **Polimorfismo** significa que objetos distintos pueden responder al mismo método de formas diferentes.`,
    instructions: `**Tu reto:** Crea una clase base \`Animal\` con un método \`hacer_sonido()\`. Luego crea \`Perro\` y \`Gato\` que hereden de \`Animal\` y sobrescriban ese método. Crea una lista con ambos y recórrela imprimiendo el sonido de cada uno.`,
    initialCode: 'class Animal:\n    def hacer_sonido(self):\n        pass\n\nclass Perro(Animal):\n    def hacer_sonido(self):\n        return "¡Guau!"\n\nclass Gato(Animal):\n    def hacer_sonido(self):\n        return "¡Miau!"\n\nmascotas = [Perro(), Gato()]\nfor mascota in mascotas:\n    print(mascota.hacer_sonido())'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 5: Arquitectura
  // ─────────────────────────────────────────────
  {
    id: 10,
    title: "10. Principio SRP (SOLID)",
    category: "Arquitectura",
    lesson: `## Principio de Responsabilidad Única (SRP)

El **SRP** (Single Responsibility Principle) es el primer principio SOLID. Dice que **cada función o clase debe tener una sola razón para cambiar**, es decir, una sola responsabilidad.

❌ **Mal diseño** (una función hace todo):
\`\`\`python
def procesar():
    nombre = input("Nombre: ")
    edad = int(input("Edad: "))
    print(f"{nombre} tiene {edad} años")
\`\`\`

✅ **Buen diseño** (cada función tiene una sola tarea):
\`\`\`python
def obtener_datos():
    nombre = input("Nombre: ")
    edad = int(input("Edad: "))
    return nombre, edad

def mostrar_resultado(nombre, edad):
    print(f"{nombre} tiene {edad} años")

n, e = obtener_datos()
mostrar_resultado(n, e)
\`\`\`

> 💡 Si necesitas cambiar cómo se piden los datos, solo tocas \`obtener_datos()\`. Si cambias el formato de salida, solo tocas \`mostrar_resultado()\`.`,
    instructions: `**Tu reto:** Refactoriza el siguiente código para aplicar SRP. Crea funciones separadas: una que pida los datos (\`obtener_numeros\`) y otra que realice el cálculo (\`calcular_suma\`).`,
    initialCode: 'def obtener_numeros():\n    a = int(input("Número 1: "))\n    b = int(input("Número 2: "))\n    return a, b\n\ndef calcular_suma(a, b):\n    return a + b\n\nn1, n2 = obtener_numeros()\nprint(f"Resultado: {calcular_suma(n1, n2)}")'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 6: Temas Avanzados
  // ─────────────────────────────────────────────
  {
    id: 11,
    title: "11. Manejo de Errores",
    category: "Temas Avanzados",
    lesson: `## Manejo de Errores (Excepciones)

Cuando tu programa intenta hacer algo imposible (como dividir entre cero o abrir un archivo que no existe), Python lanza un **Error** o **Excepción** que detiene el programa.

Para evitar que el programa falle estrepitosamente, usamos \`try\` y \`except\`:

\`\`\`python
try:
    numero = int("hola")  # Esto causará un ValueError
except ValueError:
    print("¡No puedes convertir texto a número!")
except Exception as e:
    print(f"Ocurrió un error inesperado: {e}")
finally:
    print("Esto siempre se ejecuta, haya error o no.")
\`\`\`

> 💡 **Tip:** Nunca dejes un \`except:\` vacío. Siempre es mejor especificar qué tipo de error estás capturando (ej. \`ValueError\`, \`ZeroDivisionError\`).`,
    instructions: `**Tu reto:** Crea una función llamada \`dividir_seguro(a, b)\` que intente devolver el resultado de \`a / b\`. Si \`b\` es cero, debe capturar el \`ZeroDivisionError\` e imprimir \`"Error: No se puede dividir entre cero"\`. Devuelve \`None\` en ese caso.`,
    initialCode: 'def dividir_seguro(a, b):\n    # TODO: Usa try/except para manejar la división por cero\n    pass\n\nprint(dividir_seguro(10, 2))  # 5.0\nprint(dividir_seguro(10, 0))  # Error: No se puede dividir entre cero\n'
  },
  {
    id: 12,
    title: "12. Módulos y Librerías",
    category: "Temas Avanzados",
    lesson: `## Módulos y Librerías

Python tiene un enorme ecosistema de código ya escrito por otras personas. Un **módulo** es simplemente un archivo con código Python.

Para usar módulos integrados (que vienen con Python), usamos la palabra clave \`import\`.

\`\`\`python
import math
import random

# Usando el módulo math
print(math.pi)        # 3.14159...
print(math.sqrt(16))  # 4.0

# Usando el módulo random
numero_azar = random.randint(1, 10) # Número entre 1 y 10
print(f"Salió el: {numero_azar}")
\`\`\`

Puedes importar partes específicas para no escribir el nombre del módulo todo el tiempo:
\`\`\`python
from datetime import datetime
print(datetime.now())
\`\`\``,
    instructions: `**Tu reto:** Importa el módulo \`math\` y el módulo \`random\`. Luego, genera un número aleatorio entre 1 y 100, y calcula su raíz cuadrada usando \`math.sqrt()\`. Imprime el resultado.`,
    initialCode: '# TODO: Importa los módulos necesarios\n\n# TODO: Genera un número aleatorio entre 1 y 100\nnumero = 0\n\n# TODO: Calcula su raíz cuadrada e imprímela\n'
  },
  {
    id: 13,
    title: "13. Programación Funcional",
    category: "Temas Avanzados",
    lesson: `## Programación Funcional Básica

Python soporta características de programación funcional como \`map\`, \`filter\` y funciones \`lambda\` (anónimas).

**Funciones Lambda:**
Son funciones pequeñas y anónimas que se escriben en una sola línea.
\`\`\`python
duplicar = lambda x: x * 2
print(duplicar(5))  # 10
\`\`\`

**Map:** Aplica una función a cada elemento de una lista.
\`\`\`python
numeros = [1, 2, 3, 4]
cuadrados = list(map(lambda x: x**2, numeros))
# [1, 4, 9, 16]
\`\`\`

**Filter:** Filtra una lista conservando solo los que cumplen una condición.
\`\`\`python
pares = list(filter(lambda x: x % 2 == 0, numeros))
# [2, 4]
\`\`\``,
    instructions: `**Tu reto:** Dada la lista \`precios = [15, 50, 120, 80, 200]\`, usa \`filter\` y una \`lambda\` para obtener una lista solo con los precios **mayores a 100**. Imprime la nueva lista.`,
    initialCode: 'precios = [15, 50, 120, 80, 200]\n\n# TODO: Usa filter y lambda para obtener precios mayores a 100\nprecios_altos = []\n\nprint(precios_altos)\n'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 7: Proyecto Final
  // ─────────────────────────────────────────────
  {
    id: 14,
    title: "14. Proyecto: Sistema Bancario",
    category: "Proyectos Finales",
    lesson: `## Proyecto Final: Integra todo lo aprendido

En este proyecto aplicarás todo lo que sabes:
- **Clases** para modelar una cuenta bancaria.
- **Encapsulamiento** para proteger el saldo.
- **SRP** para separar responsabilidades.
- **Manejo de Errores** (Opcional) para las validaciones.

### Tu clase debe poder:
1. **Depositar** dinero (validando que el monto sea positivo).
2. **Retirar** dinero (verificando que haya saldo suficiente).
3. **Mostrar el historial** de transacciones.

### Ejemplo de uso esperado:
\`\`\`python
cuenta = CuentaBancaria("David")
cuenta.depositar(500)
cuenta.retirar(200)
cuenta.retirar(1000)  # Debería indicar saldo insuficiente
cuenta.mostrar_historial()
\`\`\`

> 🤖 **Consejo:** Ejecuta tu código primero para ver los errores en la consola, y luego usa **"Revisión IA"** para que la IA te explique exactamente qué falló y cómo mejorar tu diseño.`,
    instructions: `**Tu reto:** Implementa los métodos \`depositar(monto)\`, \`retirar(monto)\` y \`mostrar_historial()\` en la clase \`CuentaBancaria\`. Cada operación debe quedar registrada en el historial.`,
    initialCode: 'class CuentaBancaria:\n    def __init__(self, titular, saldo_inicial=0):\n        self.titular = titular\n        self.__saldo = saldo_inicial\n        self.historial = []\n\n    def depositar(self, monto):\n        # TODO: Implementar validación y agregar al historial\n        pass\n        \n    def retirar(self, monto):\n        # TODO: Verificar si hay saldo suficiente y descontar\n        pass\n\n    def mostrar_historial(self):\n        # TODO: Imprimir cada transacción del historial\n        pass\n\n# Prueba tu código aquí:\ncuenta = CuentaBancaria("David")\ncuenta.depositar(500)\ncuenta.retirar(200)\ncuenta.retirar(1000)\ncuenta.mostrar_historial()'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 7: Tipos de Datos
  // ─────────────────────────────────────────────
  {
    id: 15,
    title: "15. Enteros y Flotantes",
    category: "Tipos de Datos",
    lesson: `## Tipos Numéricos: \`int\` y \`float\`

Python tiene dos tipos principales para números:

- **\`int\`** → números enteros: \`5\`, \`-3\`, \`1000000\`
- **\`float\`** → números con decimales: \`3.14\`, \`-0.5\`, \`1.0\`

\`\`\`python
edad = 25           # int
precio = 9.99       # float
temperatura = -4.5  # float negativo

# Operaciones aritméticas
print(10 + 3)    # 13   (suma)
print(10 - 3)    # 7    (resta)
print(10 * 3)    # 30   (multiplicación)
print(10 / 3)    # 3.33 (división → siempre float)
print(10 // 3)   # 3    (división entera)
print(10 % 3)    # 1    (módulo / resto)
print(2 ** 8)    # 256  (potencia)
\`\`\`

### Conversión de tipos
\`\`\`python
x = int(3.9)    # 3  (trunca, no redondea)
y = float(5)    # 5.0
z = round(3.567, 2)  # 3.57 (redondea a 2 decimales)
\`\`\`

> 💡 Usa \`type(variable)\` para saber el tipo de cualquier valor.`,
    instructions: `**Tu reto:** Crea una calculadora de IMC (Índice de Masa Corporal). Pide el peso en kg y la altura en metros, calcula el IMC con la fórmula \`imc = peso / (altura ** 2)\`, redondéalo a 2 decimales e imprímelo.`,
    initialCode: '# Calculadora de IMC\npeso = float(input("Peso en kg: "))\naltura = float(input("Altura en metros: "))\n\n# TODO: Calcula el IMC y redondéalo a 2 decimales\nimc = 0\n\nprint(f"Tu IMC es: {imc}")\n'
  },
  {
    id: 16,
    title: "16. Strings y Texto",
    category: "Tipos de Datos",
    lesson: `## Cadenas de Texto (\`str\`)

Los strings son secuencias de caracteres encerradas en comillas.

\`\`\`python
nombre = "Python"
saludo = 'Hola'
multilinea = """Este es
un texto
de varias líneas"""
\`\`\`

### Métodos útiles de strings
\`\`\`python
texto = "  Hola Mundo  "

print(texto.upper())       # "  HOLA MUNDO  "
print(texto.lower())       # "  hola mundo  "
print(texto.strip())       # "Hola Mundo" (quita espacios)
print(texto.replace("Hola", "Adiós"))  # "  Adiós Mundo  "
print(len(texto))          # 14 (largo del string)
print("Mundo" in texto)    # True (busca subcadena)
\`\`\`

### Slicing (cortes)
\`\`\`python
s = "Python"
print(s[0])      # "P"   (primer carácter)
print(s[-1])     # "n"   (último carácter)
print(s[0:3])    # "Pyt" (del índice 0 al 2)
print(s[::-1])   # "nohtyP" (invertido)
\`\`\`

### F-strings (la forma moderna)
\`\`\`python
nombre = "David"
edad = 22
print(f"Me llamo {nombre} y tengo {edad} años.")
\`\`\``,
    instructions: `**Tu reto:** Dada la variable \`frase = "la programacion es increible"\`, imprímela: 1) en mayúsculas, 2) con la primera letra de cada palabra en mayúscula (\`title()\`), 3) invertida (de atrás hacia adelante), y 4) cuántas letras 'a' contiene.`,
    initialCode: 'frase = "la programacion es increible"\n\n# 1. En mayúsculas\n\n# 2. Primera letra de cada palabra en mayúscula\n\n# 3. Invertida\n\n# 4. Cuántas letras "a" contiene\n'
  },
  {
    id: 17,
    title: "17. Booleanos y Comparaciones",
    category: "Tipos de Datos",
    lesson: `## Booleanos (\`bool\`) y Operadores Lógicos

Un booleano solo puede ser \`True\` o \`False\`.

\`\`\`python
es_mayor = True
tiene_cuenta = False
\`\`\`

### Operadores de comparación
\`\`\`python
5 > 3    # True
5 < 3    # False
5 == 5   # True  (igual)
5 != 3   # True  (diferente)
5 >= 5   # True
5 <= 4   # False
\`\`\`

### Operadores lógicos
\`\`\`python
# and → ambas deben ser True
print(True and True)   # True
print(True and False)  # False

# or → al menos una debe ser True
print(True or False)   # True
print(False or False)  # False

# not → invierte el valor
print(not True)   # False
print(not False)  # True
\`\`\`

### Ejemplo práctico
\`\`\`python
edad = 20
tiene_carnet = True

puede_manejar = edad >= 18 and tiene_carnet
print(f"¿Puede manejar? {puede_manejar}")  # True
\`\`\``,
    instructions: `**Tu reto:** Crea una función \`validar_contrasena(pwd)\` que retorne \`True\` si la contraseña cumple: 1) tiene al menos 8 caracteres, 2) contiene al menos un número (usa \`any(c.isdigit() for c in pwd)\`). Si cumple ambas, imprime "Contraseña válida", si no "Contraseña débil".`,
    initialCode: 'def validar_contrasena(pwd):\n    # TODO: Verificar largo >= 8 y que contenga al menos un dígito\n    pass\n\nprint(validar_contrasena("abc123"))    # Contraseña débil (menos de 8 caracteres)\nprint(validar_contrasena("python123")) # Contraseña válida\nprint(validar_contrasena("sinNumeros"))# Contraseña débil (no tiene número)\n'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 8: Bucles Avanzados
  // ─────────────────────────────────────────────
  {
    id: 18,
    title: "18. While y While True",
    category: "Bucles Avanzados",
    lesson: `## El bucle \`while\` y \`while True\`

El bucle \`while\` repite un bloque **mientras** una condición sea verdadera.

\`\`\`python
contador = 0
while contador < 5:
    print(f"Vuelta número {contador}")
    contador += 1
\`\`\`

### \`while True\` — bucle infinito controlado
Útil para menús interactivos. Se usa \`break\` para salir.

\`\`\`python
while True:
    opcion = input("Elige (1=Jugar, 2=Salir): ")
    if opcion == "1":
        print("¡Jugando!")
    elif opcion == "2":
        print("¡Hasta luego!")
        break  # Sale del bucle
    else:
        print("Opción inválida, intenta de nuevo.")
\`\`\`

### \`break\` y \`continue\`
\`\`\`python
for i in range(10):
    if i == 3:
        continue  # Salta este valor, sigue el bucle
    if i == 7:
        break     # Sale del bucle completamente
    print(i)
# Imprime: 0, 1, 2, 4, 5, 6
\`\`\``,
    instructions: `**Tu reto:** Crea un juego de "adivina el número". Genera un número aleatorio entre 1 y 10 usando \`random.randint(1, 10)\`. Usa \`while True\` para pedir adivinanzas. Cada intento indica si el número es mayor o menor. Cuando adivine, muestra cuántos intentos tardó y sale del bucle.`,
    initialCode: 'import random\n\nnumero_secreto = random.randint(1, 10)\nintentos = 0\n\n# TODO: Implementar el juego con while True\n# - Pedir un número al usuario\n# - Incrementar intentos\n# - Indicar si es mayor, menor o correcto\n# - Salir con break cuando adivine\n'
  },
  {
    id: 19,
    title: "19. Match / Case (Switch)",
    category: "Bucles Avanzados",
    lesson: `## \`match / case\` — el "switch" de Python

Desde Python 3.10, existe \`match/case\` para manejar múltiples casos de forma limpia. Es como un \`if/elif\` más legible.

\`\`\`python
dia = "lunes"

match dia:
    case "lunes" | "martes" | "miércoles" | "jueves" | "viernes":
        print("Es día laborable 💼")
    case "sábado" | "domingo":
        print("¡Es fin de semana! 🎉")
    case _:
        print("Día no reconocido")
\`\`\`

> \`case _:\` es el caso por defecto (como \`else\`).

### Match con valores numéricos
\`\`\`python
codigo_http = 404

match codigo_http:
    case 200:
        print("OK - Éxito")
    case 301 | 302:
        print("Redirección")
    case 404:
        print("No encontrado")
    case 500:
        print("Error interno del servidor")
    case _:
        print(f"Código desconocido: {codigo_http}")
\`\`\``,
    instructions: `**Tu reto:** Crea una función \`clasificar_nota(nota)\` que use \`match/case\` para clasificar: 10 = "Excelente", 9 = "Muy Bueno", 7 o 8 = "Bueno", 5 o 6 = "Suficiente", cualquier otro valor = "Reprobado". Pruébala con varias notas.`,
    initialCode: 'def clasificar_nota(nota):\n    match nota:\n        # TODO: Completar los casos\n        case _:\n            return "Reprobado"\n\nprint(clasificar_nota(10))  # Excelente\nprint(clasificar_nota(8))   # Bueno\nprint(clasificar_nota(5))   # Suficiente\nprint(clasificar_nota(3))   # Reprobado\n'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 9: Listas Avanzadas
  // ─────────────────────────────────────────────
  {
    id: 20,
    title: "20. Listas y Métodos",
    category: "Listas y Colecciones",
    lesson: `## Listas — La colección más usada en Python

Una lista es una secuencia **ordenada y mutable** de elementos.

\`\`\`python
frutas = ["manzana", "pera", "uva"]
numeros = [1, 2, 3, 4, 5]
mixta = [1, "hola", True, 3.14]  # Puede mezclar tipos
\`\`\`

### Acceso y modificación
\`\`\`python
frutas[0]       # "manzana" (primer elemento)
frutas[-1]      # "uva" (último elemento)
frutas[1:3]     # ["pera", "uva"] (slice)
frutas[0] = "melón"  # Modifica el elemento
\`\`\`

### Métodos esenciales
\`\`\`python
frutas.append("mango")    # Agrega al final
frutas.insert(1, "kiwi")  # Inserta en posición
frutas.remove("pera")     # Elimina por valor
frutas.pop()              # Elimina y retorna el último
frutas.sort()             # Ordena (modifica la lista)
frutas.reverse()          # Invierte
len(frutas)               # Largo de la lista
"uva" in frutas           # True/False
\`\`\`

### List Comprehension (forma pythónica)
\`\`\`python
numeros = [1, 2, 3, 4, 5, 6]
pares = [n for n in numeros if n % 2 == 0]
# [2, 4, 6]

cuadrados = [n**2 for n in range(1, 6)]
# [1, 4, 9, 16, 25]
\`\`\``,
    instructions: `**Tu reto:** Dada la lista \`notas = [7, 4, 9, 6, 10, 3, 8, 5]\`, debes: 1) Ordenarla de mayor a menor, 2) Calcular el promedio, 3) Filtrar solo las notas aprobadas (>= 6) usando list comprehension, 4) Imprimir cuántos aprobaron y cuántos reprobaron.`,
    initialCode: 'notas = [7, 4, 9, 6, 10, 3, 8, 5]\n\n# 1. Ordenar de mayor a menor\n\n# 2. Calcular el promedio\n\n# 3. Filtrar aprobados (>= 6) con list comprehension\n\n# 4. Imprimir cuántos aprobaron y reprobaron\n'
  },
  {
    id: 21,
    title: "21. Tuplas y Sets",
    category: "Listas y Colecciones",
    lesson: `## Tuplas y Conjuntos (Sets)

### Tuplas — listas inmutables
Las tuplas son como listas, pero **no se pueden modificar** una vez creadas. Son más rápidas y se usan para datos fijos.

\`\`\`python
coordenadas = (10.5, -74.3)  # Latitud, Longitud
colores_rgb = (255, 128, 0)

# Acceso igual que lista
print(coordenadas[0])   # 10.5

# Desempaquetado (muy útil)
lat, lon = coordenadas
print(f"Lat: {lat}, Lon: {lon}")

# Las funciones pueden retornar múltiples valores como tupla
def min_max(lista):
    return min(lista), max(lista)

minimo, maximo = min_max([3, 1, 4, 1, 5])
\`\`\`

### Sets (Conjuntos) — sin duplicados
\`\`\`python
letras = {"a", "b", "c", "a", "b"}
print(letras)  # {"a", "b", "c"} — elimina duplicados

# Operaciones de conjuntos
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}
print(A & B)   # {3, 4}      → Intersección
print(A | B)   # {1,2,3,4,5,6} → Unión
print(A - B)   # {1, 2}      → Diferencia
\`\`\``,
    instructions: `**Tu reto:** Tienes dos listas de estudiantes: \`grupo_A = ["Ana", "Luis", "Pedro", "María"]\` y \`grupo_B = ["Luis", "María", "Sofía", "Carlos"]\`. Conviértelas a sets y encuentra: 1) Estudiantes en ambos grupos, 2) Estudiantes solo en el grupo A, 3) Todos los estudiantes sin repetir.`,
    initialCode: 'grupo_A = ["Ana", "Luis", "Pedro", "María"]\ngrupo_B = ["Luis", "María", "Sofía", "Carlos"]\n\n# Convierte a sets\nset_A = set(grupo_A)\nset_B = set(grupo_B)\n\n# 1. Estudiantes en AMBOS grupos (intersección)\n\n# 2. Estudiantes SOLO en grupo A (diferencia)\n\n# 3. TODOS los estudiantes sin repetir (unión)\n'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 10: Diccionarios Avanzados
  // ─────────────────────────────────────────────
  {
    id: 22,
    title: "22. Diccionarios Avanzados",
    category: "Listas y Colecciones",
    lesson: `## Diccionarios — Almacenamiento clave:valor

Los diccionarios almacenan información en pares **clave: valor**. Son perfectos para representar objetos del mundo real.

\`\`\`python
producto = {
    "nombre": "Laptop",
    "precio": 899.99,
    "stock": 15,
    "activo": True
}
\`\`\`

### Acceso y modificación
\`\`\`python
print(producto["nombre"])   # "Laptop"
print(producto.get("marca", "Sin marca"))  # Valor por defecto

producto["precio"] = 799.99     # Modificar
producto["marca"] = "HP"        # Agregar nueva clave
del producto["activo"]          # Eliminar clave
\`\`\`

### Iterar sobre diccionarios
\`\`\`python
for clave, valor in producto.items():
    print(f"{clave}: {valor}")

# Solo claves
for clave in producto.keys():
    print(clave)

# Solo valores
for valor in producto.values():
    print(valor)
\`\`\`

### Dict Comprehension
\`\`\`python
precios = {"manzana": 1.2, "pera": 0.8, "uva": 2.5}
# Subir todos los precios un 10%
nuevos_precios = {k: round(v * 1.1, 2) for k, v in precios.items()}
\`\`\``,
    instructions: `**Tu reto:** Tienes una lista de ventas: \`ventas = [("manzana", 5), ("pera", 3), ("manzana", 2), ("uva", 7), ("pera", 1)]\`. Agrupa las ventas por producto en un diccionario donde la clave sea el producto y el valor sea el total vendido. Luego imprime el producto más vendido.`,
    initialCode: 'ventas = [("manzana", 5), ("pera", 3), ("manzana", 2), ("uva", 7), ("pera", 1)]\n\n# TODO: Crear un diccionario con totales por producto\ntotales = {}\n\nfor producto, cantidad in ventas:\n    # Si el producto ya existe, suma; si no, inicializa en 0\n    pass\n\n# TODO: Imprimir el producto más vendido usando max()\n'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 11: Manejo de Excepciones
  // ─────────────────────────────────────────────
  {
    id: 23,
    title: "23. Try / Except Avanzado",
    category: "Manejo de Errores",
    lesson: `## Excepciones Avanzadas con \`try/except\`

Ya conoces el básico, ahora vamos a fondo. Python tiene muchos tipos de error específicos:

| Excepción | Cuándo ocurre |
|-----------|--------------|
| \`ValueError\` | Tipo incorrecto (ej: \`int("abc")\`) |
| \`ZeroDivisionError\` | División por cero |
| \`IndexError\` | Índice fuera de rango en lista |
| \`KeyError\` | Clave inexistente en diccionario |
| \`FileNotFoundError\` | Archivo no encontrado |
| \`TypeError\` | Operación con tipo incorrecto |

\`\`\`python
def convertir_a_entero(valor):
    try:
        resultado = int(valor)
        return resultado
    except ValueError:
        print(f"Error: '{valor}' no es un número válido")
        return None
    except TypeError:
        print("Error: el tipo de dato no es convertible")
        return None
    else:
        # Se ejecuta SOLO si no hubo excepción
        print("Conversión exitosa")
    finally:
        # Siempre se ejecuta (para limpiar recursos)
        print("Proceso finalizado")
\`\`\`

### Crear tus propias excepciones
\`\`\`python
class SaldoInsuficienteError(Exception):
    def __init__(self, saldo, monto):
        super().__init__(f"Saldo {saldo} insuficiente para retirar {monto}")

# Lanzar una excepción propia
raise SaldoInsuficienteError(100, 200)
\`\`\``,
    instructions: `**Tu reto:** Crea una función \`convertir_lista(datos)\` que reciba una lista con valores mixtos (ej: \`["1", "dos", "3", None, "4.5"]\`) e intente convertir cada elemento a número. Si falla, lo omite. Retorna una lista solo con los números convertidos correctamente.`,
    initialCode: 'def convertir_lista(datos):\n    resultado = []\n    for item in datos:\n        try:\n            # TODO: Intentar convertir a float y agregar al resultado\n            pass\n        except (ValueError, TypeError):\n            # TODO: Ignorar los que no se puedan convertir\n            pass\n    return resultado\n\ndatos = ["1", "dos", "3", None, "4.5", "hola", "10"]\nprint(convertir_lista(datos))  # [1.0, 3.0, 4.5, 10.0]\n'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 12: Ficheros
  // ─────────────────────────────────────────────
  {
    id: 24,
    title: "24. Lectura y Escritura de Ficheros",
    category: "Ficheros",
    lesson: `## Manejo de Ficheros en Python

Python puede leer y escribir archivos de texto fácilmente.

### Escribir un archivo
\`\`\`python
# El modo "w" crea o sobreescribe el archivo
with open("datos.txt", "w", encoding="utf-8") as archivo:
    archivo.write("Primera línea\\n")
    archivo.write("Segunda línea\\n")
    
# También puedes usar writelines:
lineas = ["Ana\\n", "Luis\\n", "Pedro\\n"]
with open("nombres.txt", "w") as f:
    f.writelines(lineas)
\`\`\`

### Leer un archivo
\`\`\`python
# Leer todo el contenido
with open("datos.txt", "r", encoding="utf-8") as archivo:
    contenido = archivo.read()
    print(contenido)

# Leer línea por línea (más eficiente para archivos grandes)
with open("datos.txt", "r") as archivo:
    for linea in archivo:
        print(linea.strip())  # strip() quita el \\n
        
# Leer todas las líneas como lista
with open("datos.txt", "r") as archivo:
    lineas = archivo.readlines()
\`\`\`

### Modos de apertura
| Modo | Descripción |
|------|-------------|
| \`"r"\` | Solo lectura (por defecto) |
| \`"w"\` | Escritura (crea o sobreescribe) |
| \`"a"\` | Agrega al final (append) |
| \`"r+"\` | Lectura y escritura |

> 💡 Siempre usa \`with open(...)\` — cierra el archivo automáticamente aunque haya un error.`,
    instructions: `**Tu reto:** Simula un registro de estudiantes. 1) Crea una lista con 5 nombres de estudiantes. 2) Escríbelos en un archivo llamado \`"estudiantes.txt"\`, uno por línea. 3) Lee el archivo y muestra cada nombre numerado (ej: "1. Ana"). 4) Muestra cuántos estudiantes hay en total.`,
    initialCode: '# Registro de estudiantes\nestudiantes = ["Ana García", "Luis Pérez", "María López", "Carlos Ruiz", "Sofía Torres"]\n\n# 1. Escribir en archivo\nwith open("estudiantes.txt", "w", encoding="utf-8") as f:\n    # TODO: Escribir cada estudiante en una línea\n    pass\n\n# 2. Leer y mostrar numerados\nprint("=== Lista de Estudiantes ===")\nwith open("estudiantes.txt", "r", encoding="utf-8") as f:\n    # TODO: Leer e imprimir cada línea numerada\n    pass\n\n# 3. Contar estudiantes\nprint(f"\\nTotal: {len(estudiantes)} estudiantes")\n'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 13: Proyectos POO
  // ─────────────────────────────────────────────
  {
    id: 25,
    type: 'project',
    title: "🏛️ Proyecto: Sistema de Biblioteca",
    category: "Proyectos POO",
    lesson: `## Proyecto Final: Sistema de Gestión de Préstamos

Este proyecto integra todos los conceptos de POO: **clases abstractas, herencia, polimorfismo, encapsulamiento y el patrón Factory Method**.

### Arquitectura del sistema
\`\`\`
Usuario (clase abstracta)
├── Estudiante (hereda de Usuario)
│   └── dias_prestamo() → 7 días
└── Docente (hereda de Usuario)
    └── dias_prestamo() → 15 días

UsuarioFactory
└── crear_usuario(tipo, nombre) → instancia correcta

Prestamo
└── Almacena usuario + título del libro

Sistema
└── registrar_prestamo(tipo, nombre, libro)
└── mostrar_prestamos()
\`\`\`

### Conceptos aplicados
- **Abstracción**: \`Usuario\` es abstracta con \`@abstractmethod\`
- **Herencia**: \`Estudiante\` y \`Docente\` implementan el método abstracto
- **Factory Method**: \`UsuarioFactory\` centraliza la creación de objetos
- **Encapsulamiento**: usa \`@property\` para el nombre
- **SRP**: cada clase tiene una sola responsabilidad

> 🤖 Cuando termines, usa **"Revisión IA"** para que la IA evalúe si aplicaste correctamente todos los principios.`,
    instructions: `**Enunciado:** Una biblioteca universitaria necesita un sistema para registrar préstamos de libros. Implementa el sistema con los siguientes requerimientos:

1. **Clase abstracta \`Usuario\`** con atributo \`nombre\` (encapsulado con \`@property\`) y método abstracto \`dias_prestamo()\`.
2. **Clases \`Estudiante\` y \`Docente\`** que hereden de \`Usuario\` e implementen \`dias_prestamo()\` retornando 7 y 15 días respectivamente.
3. **Clase \`UsuarioFactory\`** con método estático \`crear_usuario(tipo, nombre)\` que retorne la instancia correcta.
4. **Clase \`Prestamo\`** que almacene un usuario y el título del libro, con método \`info()\` que muestre los datos del préstamo.
5. **Clase \`Sistema\`** con lista de préstamos, método \`registrar(tipo, nombre, libro)\` y \`mostrar_todos()\`.`,
    initialCode: 'from abc import ABC, abstractmethod\n\n# ─── CLASE ABSTRACTA ───────────────────────\nclass Usuario(ABC):\n    def __init__(self, nombre):\n        self.__nombre = nombre  # Encapsulado\n\n    @property\n    def nombre(self):\n        return self.__nombre\n\n    @abstractmethod\n    def dias_prestamo(self):\n        pass  # Las subclases deben implementar esto\n\n# ─── SUBCLASES ─────────────────────────────\nclass Estudiante(Usuario):\n    def dias_prestamo(self):\n        # TODO: Retornar 7\n        pass\n\nclass Docente(Usuario):\n    def dias_prestamo(self):\n        # TODO: Retornar 15\n        pass\n\n# ─── FACTORY METHOD ────────────────────────\nclass UsuarioFactory:\n    @staticmethod\n    def crear_usuario(tipo, nombre):\n        # TODO: Retornar Estudiante o Docente según "tipo"\n        pass\n\n# ─── PRÉSTAMO ──────────────────────────────\nclass Prestamo:\n    def __init__(self, usuario, libro):\n        self.usuario = usuario\n        self.libro = libro\n\n    def info(self):\n        # TODO: Imprimir nombre, libro y días de préstamo\n        pass\n\n# ─── SISTEMA ───────────────────────────────\nclass Sistema:\n    def __init__(self):\n        self.prestamos = []\n\n    def registrar(self, tipo, nombre, libro):\n        # TODO: Usar UsuarioFactory para crear usuario y registrar préstamo\n        pass\n\n    def mostrar_todos(self):\n        # TODO: Mostrar todos los préstamos registrados\n        pass\n\n# ─── PRUEBA ────────────────────────────────\nsistema = Sistema()\nsistema.registrar("estudiante", "Ana García", "Python Crash Course")\nsistema.registrar("docente", "Dr. Pérez", "Clean Code")\nsistema.registrar("estudiante", "Luis Ruiz", "Automate the Boring Stuff")\nsistema.mostrar_todos()\n'
  },
  {
    id: 26,
    type: 'project',
    title: "🛒 Proyecto: Sistema de Inventario",
    category: "Proyectos POO",
    lesson: `## Proyecto: Sistema de Inventario con Observer

Este proyecto aplica el **Patrón Observer** + encapsulamiento avanzado + manejo de excepciones.

### Patrón Observer
Permite que múltiples objetos (observadores) sean notificados automáticamente cuando un objeto cambia de estado.

\`\`\`
Inventario (Subject)
├── agregar_observer(observer)
├── notificar_observers()
└── actualizar_stock(producto, cantidad)

AlertaStockBajo (Observer)
└── actualizar(producto, stock) → alerta si stock < 5

ReporteVentas (Observer)
└── actualizar(producto, stock) → registra el movimiento
\`\`\`

### Conceptos aplicados
- **Patrón Observer**: desacoplamiento entre lógica y notificaciones
- **Encapsulamiento**: stock privado con validaciones
- **Excepciones propias**: \`StockInsuficienteError\`
- **Diccionarios**: gestión del inventario
- **OCP (Open/Closed)**: agregar observers sin modificar \`Inventario\`

> 🤖 Usa **"Revisión IA"** para evaluar si el Observer está correctamente implementado.`,
    instructions: `**Enunciado:** Una tienda necesita un sistema de inventario inteligente. Implementa:

1. **Excepción personalizada** \`StockInsuficienteError\`.
2. **Clase abstracta \`Observer\`** con método abstracto \`actualizar(producto, stock)\`.
3. **Clase \`AlertaStockBajo\`** que implemente Observer: imprime alerta si stock < 5.
4. **Clase \`ReporteVentas\`** que implemente Observer: registra cada cambio en una lista.
5. **Clase \`Inventario\`** (Subject) con diccionario de productos, lista de observers, y métodos: \`agregar_observer\`, \`notificar_observers\`, \`agregar_stock(producto, cantidad)\`, \`vender(producto, cantidad)\` (lanza excepción si no hay stock).`,
    initialCode: 'from abc import ABC, abstractmethod\n\n# ─── EXCEPCIÓN PROPIA ──────────────────────\nclass StockInsuficienteError(Exception):\n    def __init__(self, producto, disponible, solicitado):\n        super().__init__(\n            f"Stock insuficiente para {producto}: disponible={disponible}, solicitado={solicitado}"\n        )\n\n# ─── OBSERVER ABSTRACTO ────────────────────\nclass Observer(ABC):\n    @abstractmethod\n    def actualizar(self, producto, stock):\n        pass\n\n# ─── OBSERVADORES CONCRETOS ────────────────\nclass AlertaStockBajo(Observer):\n    def actualizar(self, producto, stock):\n        # TODO: Si stock < 5, imprimir alerta\n        pass\n\nclass ReporteVentas(Observer):\n    def __init__(self):\n        self.registros = []\n\n    def actualizar(self, producto, stock):\n        # TODO: Agregar registro a self.registros\n        pass\n\n    def mostrar_reporte(self):\n        # TODO: Imprimir todos los registros\n        pass\n\n# ─── INVENTARIO (SUBJECT) ──────────────────\nclass Inventario:\n    def __init__(self):\n        self.__productos = {}  # {nombre: stock}\n        self.__observers = []\n\n    def agregar_observer(self, observer):\n        self.__observers.append(observer)\n\n    def notificar_observers(self, producto, stock):\n        for obs in self.__observers:\n            obs.actualizar(producto, stock)\n\n    def agregar_stock(self, producto, cantidad):\n        # TODO: Agregar stock y notificar\n        pass\n\n    def vender(self, producto, cantidad):\n        # TODO: Validar stock, descontar y notificar. Lanzar StockInsuficienteError si no alcanza\n        pass\n\n# ─── PRUEBA ────────────────────────────────\nalerta = AlertaStockBajo()\nreporte = ReporteVentas()\n\ninventario = Inventario()\ninventario.agregar_observer(alerta)\ninventario.agregar_observer(reporte)\n\ninventario.agregar_stock("Laptop", 10)\ninventario.vender("Laptop", 7)   # Queda 3 → debe alertar\ntry:\n    inventario.vender("Laptop", 5) # No hay suficiente → excepción\nexcept StockInsuficienteError as e:\n    print(f"Error: {e}")\n\nreporte.mostrar_reporte()\n'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 14: Programación Estructurada
  // ─────────────────────────────────────────────
  {
    id: 27,
    title: "27. Pseudocódigo y Diagramas de Flujo",
    category: "Programación Estructurada",
    lesson: `## Programación Estructurada

La **programación estructurada** es un paradigma que organiza el código en tres estructuras de control básicas:

| Estructura | Descripción | Ejemplo Python |
|-----------|-------------|----------------|
| **Secuencia** | Instrucciones en orden | \`a = 1; b = 2; c = a + b\` |
| **Selección** | Decisiones (if/else) | \`if nota >= 6: print("Aprobado")\` |
| **Iteración** | Repetición (bucles) | \`for i in range(10): ...\` |

### Pseudocódigo
El pseudocódigo es una descripción informal de un algoritmo usando lenguaje humano + estructura de código.

\`\`\`
INICIO
  LEER numero
  SI numero > 0 ENTONCES
    ESCRIBIR "Es positivo"
  SINO SI numero < 0 ENTONCES
    ESCRIBIR "Es negativo"
  SINO
    ESCRIBIR "Es cero"
  FIN_SI
FIN
\`\`\`

### Traducción a Python
\`\`\`python
numero = int(input("Ingresa un número: "))

if numero > 0:
    print("Es positivo")
elif numero < 0:
    print("Es negativo")
else:
    print("Es cero")
\`\`\`

### Diagrama de Flujo (símbolos principales)
- **Óvalo** → Inicio / Fin
- **Rectángulo** → Proceso / Instrucción
- **Rombo** → Decisión (sí/no)
- **Paralelogramo** → Entrada / Salida
- **Flechas** → Flujo de ejecución`,
    instructions: `**Tu reto:** Traduce el siguiente pseudocódigo a Python:

\`\`\`
INICIO
  LEER lista de 5 números
  suma ← 0
  PARA cada numero EN lista HACER
    suma ← suma + numero
  FIN_PARA
  promedio ← suma / 5
  SI promedio >= 7 ENTONCES
    ESCRIBIR "Aprobado con", promedio
  SINO
    ESCRIBIR "Reprobado con", promedio
  FIN_SI
FIN
\`\`\``,
    initialCode: '# TODO: Traduce el pseudocódigo a Python\n# 1. Pide 5 números al usuario (usa un bucle for y append)\n# 2. Calcula la suma y el promedio\n# 3. Determina si el promedio es >= 7 (Aprobado) o no (Reprobado)\n\nnumeros = []\nfor i in range(5):\n    n = float(input(f"Número {i+1}: "))\n    # TODO: Agregar n a la lista\n    pass\n\n# TODO: Calcular suma y promedio\n\n# TODO: Imprimir resultado\n'
  },
  {
    id: 28,
    title: "28. Diseño Modular y Funciones",
    category: "Programación Estructurada",
    lesson: `## Diseño Modular

El **diseño modular** divide un programa en partes más pequeñas e independientes llamadas **módulos** (funciones). Cada módulo hace una sola cosa bien.

### Principios del Diseño Modular
1. **Cohesión alta**: cada función tiene una responsabilidad clara
2. **Acoplamiento bajo**: las funciones son independientes entre sí
3. **Reutilización**: escribir una vez, usar muchas veces

\`\`\`python
# ❌ MAL: Todo junto, difícil de mantener
def procesar_notas():
    notas = [float(input(f"Nota {i+1}: ")) for i in range(5)]
    suma = sum(notas)
    promedio = suma / len(notas)
    if promedio >= 6:
        print(f"Aprobado. Promedio: {promedio:.2f}")
    else:
        print(f"Reprobado. Promedio: {promedio:.2f}")
\`\`\`

\`\`\`python
# ✅ BIEN: Modular, cada función hace una sola cosa
def pedir_notas(cantidad):
    """Solicita N notas al usuario y las devuelve como lista."""
    return [float(input(f"Nota {i+1}: ")) for i in range(cantidad)]

def calcular_promedio(notas):
    """Calcula y devuelve el promedio de una lista."""
    return sum(notas) / len(notas)

def clasificar(promedio, minimo=6.0):
    """Devuelve 'Aprobado' o 'Reprobado' según el promedio."""
    return "Aprobado" if promedio >= minimo else "Reprobado"

def mostrar_resultado(promedio, estado):
    """Imprime el resultado formateado."""
    print(f"Estado: {estado} | Promedio: {promedio:.2f}")

# ─── Programa principal ───
notas = pedir_notas(5)
prom = calcular_promedio(notas)
estado = clasificar(prom)
mostrar_resultado(prom, estado)
\`\`\`

> 💡 El código modular es más fácil de **probar**, **depurar** y **reutilizar**.`,
    instructions: `**Tu reto:** Tienes un programa que calcula estadísticas de ventas. Actualmente todo está en una sola función \`analizar_ventas()\`. Refactorízalo en 4 funciones separadas: \`calcular_total(ventas)\`, \`calcular_promedio(ventas)\`, \`encontrar_max_min(ventas)\` y \`mostrar_reporte(total, promedio, maximo, minimo)\`. Llama a cada función desde el programa principal.`,
    initialCode: '# ─── Tu refactorización modular ───────────────\nventas = [1500, 2300, 890, 3100, 1750, 2800, 960]\n\ndef calcular_total(ventas):\n    """Retorna la suma de todas las ventas."""\n    # TODO\n    pass\n\ndef calcular_promedio(ventas):\n    """Retorna el promedio de ventas."""\n    # TODO\n    pass\n\ndef encontrar_max_min(ventas):\n    """Retorna una tupla (maximo, minimo)."""\n    # TODO\n    pass\n\ndef mostrar_reporte(total, promedio, maximo, minimo):\n    """Imprime el reporte de ventas formateado."""\n    print("=== REPORTE DE VENTAS ===")\n    # TODO: Imprimir cada valor\n    pass\n\n# ─── Programa principal ───\ntotal = calcular_total(ventas)\npromedio = calcular_promedio(ventas)\nmaximo, minimo = encontrar_max_min(ventas)\nmostrar_reporte(total, promedio, maximo, minimo)\n'
  },
  {
    id: 29,
    title: "29. Recursión",
    category: "Programación Estructurada",
    lesson: `## Recursión — Funciones que se llaman a sí mismas

Una función **recursiva** se llama a sí misma para resolver un problema dividiéndolo en subproblemas más simples.

Toda función recursiva tiene:
1. **Caso base**: la condición de parada (sin esto hay un bucle infinito)
2. **Caso recursivo**: la llamada a sí misma con un problema más pequeño

\`\`\`python
# Factorial: n! = n × (n-1) × (n-2) × ... × 1
def factorial(n):
    if n == 0 or n == 1:   # Caso base
        return 1
    return n * factorial(n - 1)  # Caso recursivo

print(factorial(5))  # 120 (5×4×3×2×1)
\`\`\`

### Visualizando la recursión de factorial(4):
\`\`\`
factorial(4)
  └─ 4 × factorial(3)
          └─ 3 × factorial(2)
                  └─ 2 × factorial(1)
                          └─ 1  ← caso base
\`\`\`

### Suma de una lista con recursión
\`\`\`python
def suma_lista(lista):
    if not lista:          # Lista vacía → caso base
        return 0
    return lista[0] + suma_lista(lista[1:])  # Primer + resto

print(suma_lista([1, 2, 3, 4, 5]))  # 15
\`\`\`

> ⚠️ Cuidado con la recursión sin caso base — Python tiene un límite de ~1000 niveles antes de lanzar \`RecursionError\`.`,
    instructions: `**Tu reto:** Implementa dos funciones recursivas: 1) \`fibonacci(n)\` que retorna el n-ésimo número de Fibonacci (0,1,1,2,3,5,8,13...). Caso base: fib(0)=0, fib(1)=1. 2) \`potencia(base, exponente)\` que calcule base^exponente sin usar el operador \`**\`. Prueba ambas con varios valores.`,
    initialCode: '# 1. Fibonacci recursivo\ndef fibonacci(n):\n    # Caso base: fib(0) = 0, fib(1) = 1\n    # Caso recursivo: fib(n) = fib(n-1) + fib(n-2)\n    pass\n\n# 2. Potencia recursiva\ndef potencia(base, exponente):\n    # Caso base: cualquier numero^0 = 1\n    # Caso recursivo: base^exp = base * base^(exp-1)\n    pass\n\n# Pruebas\nfor i in range(8):\n    print(f"fib({i}) = {fibonacci(i)}")\n\nprint(potencia(2, 10))  # 1024\nprint(potencia(3, 4))   # 81\n'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 15: Estructuras de Datos
  // ─────────────────────────────────────────────
  {
    id: 30,
    title: "30. Pila (Stack)",
    category: "Estructuras de Datos",
    lesson: `## Pila (Stack) — LIFO: Último en entrar, primero en salir

Una **pila** funciona como una pila de platos: solo puedes agregar o quitar del tope.

**LIFO = Last In, First Out**

\`\`\`
       ┌─────┐  ← tope (último en entrar, primero en salir)
       │  C  │
       │  B  │
       │  A  │  ← base (primero en entrar)
       └─────┘
\`\`\`

### Implementación en Python (con lista)
\`\`\`python
class Pila:
    def __init__(self):
        self._items = []

    def push(self, item):
        """Agrega un elemento al tope."""
        self._items.append(item)

    def pop(self):
        """Elimina y retorna el elemento del tope."""
        if self.esta_vacia():
            raise IndexError("La pila está vacía")
        return self._items.pop()

    def peek(self):
        """Retorna el tope sin eliminar."""
        if self.esta_vacia():
            raise IndexError("La pila está vacía")
        return self._items[-1]

    def esta_vacia(self):
        return len(self._items) == 0

    def tamanio(self):
        return len(self._items)
\`\`\`

### Uso real de las pilas
- **Historial del navegador** (atrás/adelante)
- **Deshacer (Ctrl+Z)** en editores de texto
- **Llamadas de función** (call stack del programa)
- **Validar paréntesis** en código

### Validar paréntesis con pila
\`\`\`python
def parentesis_validos(expresion):
    pila = []
    for char in expresion:
        if char in "([{":
            pila.append(char)
        elif char in ")]}":
            if not pila:
                return False
            pila.pop()
    return len(pila) == 0

print(parentesis_validos("(a + b) * (c - d)"))  # True
print(parentesis_validos("((a + b)"))            # False
\`\`\``,
    instructions: `**Tu reto:** Implementa la clase \`Pila\` con los métodos \`push\`, \`pop\`, \`peek\`, \`esta_vacia\` y \`tamanio\`. Luego, usando tu \`Pila\`, implementa la función \`invertir_string(texto)\` que retorne el texto al revés usando push/pop (sin usar \`[::-1]\`).`,
    initialCode: 'class Pila:\n    def __init__(self):\n        self._items = []\n\n    def push(self, item):\n        # TODO: Agregar item al tope\n        pass\n\n    def pop(self):\n        # TODO: Eliminar y retornar el tope. Lanzar IndexError si está vacía\n        pass\n\n    def peek(self):\n        # TODO: Retornar el tope sin eliminar\n        pass\n\n    def esta_vacia(self):\n        # TODO: Retornar True si no hay elementos\n        pass\n\n    def tamanio(self):\n        return len(self._items)\n\n\ndef invertir_string(texto):\n    """Invierte un texto usando una Pila."""\n    pila = Pila()\n    # TODO: 1) Hacer push de cada carácter\n    # TODO: 2) Hacer pop de cada carácter para reconstruir el string invertido\n    pass\n\n\nprint(invertir_string("Python"))  # nohtyP\nprint(invertir_string("Hola"))    # aloH\n\n# Prueba la pila directamente\np = Pila()\np.push(1); p.push(2); p.push(3)\nprint(p.pop())     # 3\nprint(p.peek())    # 2\nprint(p.tamanio()) # 2\n'
  },
  {
    id: 31,
    title: "31. Cola (Queue)",
    category: "Estructuras de Datos",
    lesson: `## Cola (Queue) — FIFO: Primero en entrar, primero en salir

Una **cola** funciona como la fila del banco: el primero que llega es el primero en ser atendido.

**FIFO = First In, First Out**

\`\`\`
 entra →  [ A | B | C | D ]  → sale
  (rear)                       (front)
\`\`\`

### Implementación eficiente con \`deque\`
\`\`\`python
from collections import deque

class Cola:
    def __init__(self):
        self._items = deque()

    def enqueue(self, item):
        """Agrega al final de la cola."""
        self._items.append(item)

    def dequeue(self):
        """Elimina y retorna el frente de la cola."""
        if self.esta_vacia():
            raise IndexError("La cola está vacía")
        return self._items.popleft()  # O(1) con deque

    def frente(self):
        """Retorna el frente sin eliminar."""
        return self._items[0]

    def esta_vacia(self):
        return len(self._items) == 0

    def tamanio(self):
        return len(self._items)
\`\`\`

### Diferencia entre Pila y Cola

| | Pila (Stack) | Cola (Queue) |
|---|---|---|
| Orden | LIFO | FIFO |
| Agregar | \`push\` (tope) | \`enqueue\` (final) |
| Eliminar | \`pop\` (tope) | \`dequeue\` (frente) |
| Uso real | Deshacer, call stack | Impresoras, colas de espera, BFS |

### Uso real de las colas
- **Colas de impresión**: primer trabajo enviado = primero impreso
- **Atención al cliente**: turnos del banco
- **Algoritmo BFS** (búsqueda en anchura en grafos)`,
    instructions: `**Tu reto:** Implementa la clase \`Cola\` usando \`collections.deque\`. Luego simula un sistema de atención al cliente: agrega 5 clientes a la cola con \`enqueue\`, luego los atiende uno por uno con \`dequeue\` imprimiendo "Atendiendo a: [nombre]". Al final muestra cuántos clientes quedan.`,
    initialCode: 'from collections import deque\n\nclass Cola:\n    def __init__(self):\n        self._items = deque()\n\n    def enqueue(self, item):\n        # TODO: Agregar al final\n        pass\n\n    def dequeue(self):\n        # TODO: Eliminar y retornar el frente. Lanzar IndexError si vacía\n        pass\n\n    def frente(self):\n        # TODO: Retornar el primero sin eliminar\n        pass\n\n    def esta_vacia(self):\n        return len(self._items) == 0\n\n    def tamanio(self):\n        return len(self._items)\n\n\n# ─── Sistema de atención ───────────────────\ncola_clientes = Cola()\nclientes = ["Ana", "Luis", "Pedro", "María", "Carlos"]\n\n# TODO: Agregar todos los clientes a la cola\n\nprint(f"Clientes en espera: {cola_clientes.tamanio()}")\nprint("=== Atendiendo clientes ===")\n\n# TODO: Atender a los primeros 3 clientes con dequeue\n\nprint(f"Clientes restantes: {cola_clientes.tamanio()}")\n'
  },
  {
    id: 32,
    title: "32. Lista Enlazada",
    category: "Estructuras de Datos",
    lesson: `## Lista Enlazada (Linked List)

Una **lista enlazada** es una estructura donde cada elemento (nodo) contiene un dato y una referencia al siguiente nodo.

\`\`\`
[datos=1 | sig→] → [datos=2 | sig→] → [datos=3 | sig=None]
     ↑
   cabeza (head)
\`\`\`

### Comparación con listas de Python

| Operación | Lista Python | Lista Enlazada |
|-----------|-------------|----------------|
| Acceso por índice | O(1) | O(n) |
| Insertar al inicio | O(n) | O(1) |
| Insertar al final | O(1) amortizado | O(n) |
| Eliminar elemento | O(n) | O(n) |
| Memoria | Contigua | Fragmentada |

### Implementación
\`\`\`python
class Nodo:
    def __init__(self, dato):
        self.dato = dato
        self.siguiente = None  # Apunta al próximo nodo

class ListaEnlazada:
    def __init__(self):
        self.cabeza = None  # Primer nodo

    def agregar_inicio(self, dato):
        nuevo = Nodo(dato)
        nuevo.siguiente = self.cabeza
        self.cabeza = nuevo

    def agregar_final(self, dato):
        nuevo = Nodo(dato)
        if not self.cabeza:
            self.cabeza = nuevo
            return
        actual = self.cabeza
        while actual.siguiente:
            actual = actual.siguiente
        actual.siguiente = nuevo

    def mostrar(self):
        actual = self.cabeza
        elementos = []
        while actual:
            elementos.append(str(actual.dato))
            actual = actual.siguiente
        print(" → ".join(elementos))
\`\`\``,
    instructions: `**Tu reto:** Implementa la \`ListaEnlazada\` con los métodos \`agregar_inicio\`, \`agregar_final\`, \`eliminar(dato)\` (elimina el primer nodo con ese dato) y \`buscar(dato)\` (retorna True si existe). Prueba agregando números, buscando uno y eliminando otro.`,
    initialCode: 'class Nodo:\n    def __init__(self, dato):\n        self.dato = dato\n        self.siguiente = None\n\n\nclass ListaEnlazada:\n    def __init__(self):\n        self.cabeza = None\n\n    def agregar_inicio(self, dato):\n        # TODO: Crear nodo y ponerlo como nueva cabeza\n        pass\n\n    def agregar_final(self, dato):\n        # TODO: Recorrer hasta el final y agregar ahí\n        pass\n\n    def eliminar(self, dato):\n        # TODO: Buscar el nodo con ese dato y eliminarlo\n        # Considera el caso donde es la cabeza\n        pass\n\n    def buscar(self, dato):\n        # TODO: Recorrer y retornar True si encuentra el dato\n        pass\n\n    def mostrar(self):\n        actual = self.cabeza\n        elementos = []\n        while actual:\n            elementos.append(str(actual.dato))\n            actual = actual.siguiente\n        print(" → ".join(elementos) if elementos else "Lista vacía")\n\n\n# Pruebas\nlista = ListaEnlazada()\nlista.agregar_final(10)\nlista.agregar_final(20)\nlista.agregar_final(30)\nlista.agregar_inicio(5)\nlista.mostrar()         # 5 → 10 → 20 → 30\nprint(lista.buscar(20)) # True\nprint(lista.buscar(99)) # False\nlista.eliminar(10)\nlista.mostrar()         # 5 → 20 → 30\n'
  },
  {
    id: 33,
    title: "33. Árbol Binario de Búsqueda",
    category: "Estructuras de Datos",
    lesson: `## Árbol Binario de Búsqueda (BST)

Un **árbol binario de búsqueda** organiza datos de forma jerárquica:
- El hijo **izquierdo** siempre tiene un valor **menor** que el padre.
- El hijo **derecho** siempre tiene un valor **mayor** que el padre.

\`\`\`
           50
          /  \\
        30    70
       /  \\  /  \\
      20  40 60  80
\`\`\`

### Propiedades
- **Búsqueda**: O(log n) promedio — muy eficiente
- **Inserción**: O(log n) promedio
- **Recorrido en orden** (izq → raíz → der): devuelve los datos ordenados

\`\`\`python
class NodoArbol:
    def __init__(self, valor):
        self.valor = valor
        self.izquierdo = None
        self.derecho = None

class ArbolBST:
    def __init__(self):
        self.raiz = None

    def insertar(self, valor):
        self.raiz = self._insertar(self.raiz, valor)

    def _insertar(self, nodo, valor):
        if nodo is None:
            return NodoArbol(valor)
        if valor < nodo.valor:
            nodo.izquierdo = self._insertar(nodo.izquierdo, valor)
        elif valor > nodo.valor:
            nodo.derecho = self._insertar(nodo.derecho, valor)
        return nodo

    def buscar(self, valor):
        return self._buscar(self.raiz, valor)

    def _buscar(self, nodo, valor):
        if nodo is None:
            return False
        if valor == nodo.valor:
            return True
        if valor < nodo.valor:
            return self._buscar(nodo.izquierdo, valor)
        return self._buscar(nodo.derecho, valor)

    def en_orden(self, nodo=None, resultado=None):
        if resultado is None:
            resultado = []
            nodo = self.raiz
        if nodo:
            self.en_orden(nodo.izquierdo, resultado)
            resultado.append(nodo.valor)
            self.en_orden(nodo.derecho, resultado)
        return resultado
\`\`\`

> 💡 El recorrido **en orden** de un BST devuelve los elementos ordenados de menor a mayor.`,
    instructions: `**Tu reto:** Implementa la clase \`ArbolBST\` con los métodos \`insertar\`, \`buscar\` (True/False) y \`en_orden\` (lista ordenada). Inserta los valores \`[50, 30, 70, 20, 40, 60, 80]\` y verifica: 1) que el recorrido en orden retorna la lista ordenada, 2) que \`buscar(40)\` retorna True y \`buscar(99)\` retorna False.`,
    initialCode: 'class NodoArbol:\n    def __init__(self, valor):\n        self.valor = valor\n        self.izquierdo = None\n        self.derecho = None\n\n\nclass ArbolBST:\n    def __init__(self):\n        self.raiz = None\n\n    def insertar(self, valor):\n        self.raiz = self._insertar(self.raiz, valor)\n\n    def _insertar(self, nodo, valor):\n        # TODO: Si nodo es None, crear nuevo NodoArbol\n        # Si valor < nodo.valor, insertar a la izquierda\n        # Si valor > nodo.valor, insertar a la derecha\n        # Retornar nodo\n        pass\n\n    def buscar(self, valor):\n        return self._buscar(self.raiz, valor)\n\n    def _buscar(self, nodo, valor):\n        # TODO: Si nodo es None → False\n        # Si valor == nodo.valor → True\n        # Si valor < nodo.valor → buscar izquierda\n        # Si valor > nodo.valor → buscar derecha\n        pass\n\n    def en_orden(self, nodo=None, resultado=None):\n        if resultado is None:\n            resultado = []\n            nodo = self.raiz\n        # TODO: Recorrer izquierda, agregar raíz, recorrer derecha\n        return resultado\n\n\n# Prueba\narbol = ArbolBST()\nvalores = [50, 30, 70, 20, 40, 60, 80]\nfor v in valores:\n    arbol.insertar(v)\n\nprint(arbol.en_orden())    # [20, 30, 40, 50, 60, 70, 80]\nprint(arbol.buscar(40))    # True\nprint(arbol.buscar(99))    # False\n'
  },
  {
    id: 34,
    title: "34. Búsqueda y Ordenamiento",
    category: "Estructuras de Datos",
    lesson: `## Algoritmos de Búsqueda y Ordenamiento

### Búsqueda Lineal — O(n)
Recorre todos los elementos uno por uno hasta encontrar el objetivo.
\`\`\`python
def busqueda_lineal(lista, objetivo):
    for i, elemento in enumerate(lista):
        if elemento == objetivo:
            return i   # Retorna el índice
    return -1          # No encontrado
\`\`\`

### Búsqueda Binaria — O(log n)
Solo funciona en listas **ordenadas**. Divide la búsqueda a la mitad en cada paso.
\`\`\`python
def busqueda_binaria(lista, objetivo):
    izq, der = 0, len(lista) - 1
    while izq <= der:
        medio = (izq + der) // 2
        if lista[medio] == objetivo:
            return medio
        elif lista[medio] < objetivo:
            izq = medio + 1
        else:
            der = medio - 1
    return -1
\`\`\`

### Ordenamiento Burbuja (Bubble Sort) — O(n²)
Compara pares adyacentes e intercambia si están en el orden incorrecto.
\`\`\`python
def burbuja(lista):
    n = len(lista)
    for i in range(n):
        for j in range(0, n - i - 1):
            if lista[j] > lista[j + 1]:
                lista[j], lista[j + 1] = lista[j + 1], lista[j]
    return lista
\`\`\`

### Comparación de algoritmos de ordenamiento

| Algoritmo | Mejor | Promedio | Peor | Estable |
|-----------|-------|----------|------|---------|
| Burbuja | O(n) | O(n²) | O(n²) | Sí |
| Selección | O(n²) | O(n²) | O(n²) | No |
| Inserción | O(n) | O(n²) | O(n²) | Sí |
| QuickSort | O(n log n) | O(n log n) | O(n²) | No |
| MergeSort | O(n log n) | O(n log n) | O(n log n) | Sí |

> 💡 Python usa **Timsort** internamente (combinación de MergeSort e Inserción), que es O(n log n) en el peor caso.`,
    instructions: `**Tu reto:** Implementa las 3 funciones: 1) \`busqueda_binaria(lista, objetivo)\`, 2) \`burbuja(lista)\` que ordene de menor a mayor, 3) \`contar_pasos_burbuja(lista)\` que retorne cuántas comparaciones hace el burbuja. Compara visualmente cuántos pasos hace burbuja en una lista ordenada vs. desordenada.`,
    initialCode: 'def busqueda_binaria(lista, objetivo):\n    """Retorna el índice del objetivo o -1 si no existe."""\n    izq, der = 0, len(lista) - 1\n    # TODO: Implementar búsqueda binaria\n    pass\n\n\ndef burbuja(lista):\n    """Ordena la lista de menor a mayor usando burbuja. Retorna la lista."""\n    lista = lista.copy()  # No modificar la original\n    n = len(lista)\n    # TODO: Implementar bubble sort\n    return lista\n\n\ndef contar_pasos_burbuja(lista):\n    """Retorna cuántas comparaciones hace el algoritmo burbuja."""\n    pasos = 0\n    n = len(lista)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            pasos += 1\n            if lista[j] > lista[j + 1]:\n                lista[j], lista[j + 1] = lista[j + 1], lista[j]\n    return pasos\n\n\n# Pruebas\nlista_ord = [1, 3, 5, 7, 9, 11, 13, 15]\nlista_des = [8, 3, 1, 5, 9, 2, 7, 4]\n\nprint(busqueda_binaria(lista_ord, 7))   # 3\nprint(busqueda_binaria(lista_ord, 6))   # -1\nprint(burbuja(lista_des))               # [1,2,3,4,5,7,8,9]\n\nprint(f"Pasos en lista ordenada:    {contar_pasos_burbuja(lista_ord.copy())}")\nprint(f"Pasos en lista desordenada: {contar_pasos_burbuja(lista_des.copy())}")\n'
  },

  // ─────────────────────────────────────────────
  // MÓDULO 16: JavaScript Moderno (ES6+)
  // ─────────────────────────────────────────────
  {
    id: 35,
    title: "35. Fundamentos JS y ES6+",
    category: "JavaScript Moderno",
    lesson: `## JavaScript ES6+

JavaScript es el lenguaje de la web. Con ES6 (2015) y versiones posteriores, introdujo muchas mejoras.

### 1. Variables: let y const
En lugar de \`var\`, usamos \`let\` (valores que cambian) y \`const\` (valores fijos).
\`\`\`javascript
const PI = 3.1416;
let edad = 20;
edad = 21; // Permitido
// PI = 3; // Error!
\`\`\`

### 2. Arrow Functions (Funciones flecha)
Sintaxis más corta y manejo diferente del \`this\`.
\`\`\`javascript
// Tradicional
function sumar(a, b) {
  return a + b;
}

// Arrow function
const sumar = (a, b) => a + b;
\`\`\`

### 3. Template Literals (Strings interpolados)
Usa backticks (\\\`) para insertar variables fácilmente, igual que las f-strings en Python.
\`\`\`javascript
const nombre = "Ana";
console.log(\`Hola \${nombre}, tienes \${edad} años.\`);
\`\`\`

### 4. Desestructuración
Extraer datos de arreglos o objetos fácilmente.
\`\`\`javascript
const usuario = { nombre: "Carlos", rol: "Admin" };
const { nombre, rol } = usuario;

const numeros = [1, 2, 3];
const [primero, segundo] = numeros;
\`\`\``,
    instructions: `**Tu reto:** 
1. Crea una \`const\` llamada \`producto\` que sea un objeto con \`nombre\`, \`precio\` y \`categoria\`.
2. Usa **desestructuración** para extraer el \`nombre\` y el \`precio\`.
3. Crea una **Arrow Function** llamada \`calcularImpuesto\` que reciba un precio y retorne el precio + 21%.
4. Imprime el resultado usando **Template Literals**.`,
    initialCode: '// TODO: 1. Crear el objeto producto\n\n\n// TODO: 2. Desestructurar nombre y precio\n\n\n// TODO: 3. Crear Arrow Function calcularImpuesto\n\n\n// TODO: 4. Imprimir con Template Literals\n// Ejemplo esperado: "El producto Laptop cuesta con impuesto: $1210"\n'
  },
  {
    id: 36,
    title: "36. Array Methods (Map, Filter, Reduce)",
    category: "JavaScript Moderno",
    lesson: `## Métodos Funcionales de Arrays

JavaScript tiene métodos muy potentes para transformar listas, similares a la programación funcional en Python.

### 1. \`map()\` — Transformar cada elemento
Crea un **nuevo arreglo** aplicando una función a cada elemento.
\`\`\`javascript
const numeros = [1, 2, 3, 4];
const dobles = numeros.map(num => num * 2);
// [2, 4, 6, 8]
\`\`\`

### 2. \`filter()\` — Filtrar elementos
Crea un **nuevo arreglo** solo con los elementos que pasen una condición (retornan true).
\`\`\`javascript
const edades = [15, 22, 17, 30];
const mayores = edades.filter(edad => edad >= 18);
// [22, 30]
\`\`\`

### 3. \`reduce()\` — Reducir a un solo valor
Acumula todos los valores en un único resultado.
\`\`\`javascript
const gastos = [10, 20, 30];
const total = gastos.reduce((acumulador, actual) => acumulador + actual, 0);
// 60
\`\`\`

> 💡 Puedes **encadenar** estos métodos: \`numeros.filter(...).map(...)\``,
    instructions: `**Tu reto:** Tienes una lista de objetos \`usuarios\`.
1. Usa \`filter\` para obtener solo los usuarios "activos".
2. Usa \`map\` para obtener un arreglo solo con los nombres de esos usuarios activos.
3. Usa \`reduce\` para calcular el promedio de edad de TODOS los usuarios.`,
    initialCode: 'const usuarios = [\n  { nombre: "Ana", edad: 25, activo: true },\n  { nombre: "Luis", edad: 32, activo: false },\n  { nombre: "Pedro", edad: 19, activo: true },\n  { nombre: "María", edad: 40, activo: false }\n];\n\n// TODO: 1. Filtrar activos\nconst activos = [];\nconsole.log("Activos:", activos);\n\n// TODO: 2. Mapear a nombres de los activos\nconst nombresActivos = [];\nconsole.log("Nombres activos:", nombresActivos);\n\n// TODO: 3. Calcular promedio de edad de todos con reduce\nconst promedioEdad = 0;\nconsole.log("Promedio de edad:", promedioEdad);\n'
  },
  {
    id: 37,
    title: "37. Promesas y Asincronía",
    category: "JavaScript Moderno",
    lesson: `## Asincronía: Promises

JavaScript es de **un solo hilo** (single-threaded). Para no bloquear la página mientras espera (ej. descargar un archivo, pedir datos a una API), usa **asincronía**.

Una **Promesa** es un objeto que representa la terminación (o fracaso) eventual de una operación asíncrona.

Tiene 3 estados:
1. **Pending** (Pendiente)
2. **Fulfilled** (Resuelta / Éxito) → Se captura con \`.then()\`
3. **Rejected** (Rechazada / Error) → Se captura con \`.catch()\`

\`\`\`javascript
const pedirPizza = new Promise((resolve, reject) => {
  console.log("Cocinando...");
  setTimeout(() => {
    const seQuemo = false;
    if (seQuemo) {
      reject("La pizza se quemó 😭");
    } else {
      resolve("🍕 ¡Pizza lista!");
    }
  }, 2000); // Espera 2 segundos
});

pedirPizza
  .then(mensaje => console.log(mensaje))
  .catch(error => console.error(error));
\`\`\``,
    instructions: `**Tu reto:**
1. Crea una función \`verificarStock(producto)\` que retorne una **Promesa**.
2. Dentro, usa \`setTimeout\` (1 segundo).
3. Si el producto es "Laptop", resuelve la promesa con "Stock disponible".
4. Si es cualquier otro, rechaza con "Stock agotado".
5. Llama a la función pasándole "Laptop" usando \`.then\` y \`.catch\`.`,
    initialCode: 'function verificarStock(producto) {\n  // TODO: Retornar una nueva Promise con setTimeout de 1000ms\n}\n\n// TODO: Llamar a verificarStock("Laptop") y manejar then/catch\n\n// TODO: Llamar a verificarStock("Mouse") y manejar then/catch\n'
  },
  {
    id: 38,
    title: "38. Async / Await y Fetch API",
    category: "JavaScript Moderno",
    lesson: `## Async / Await y APIs

Aunque \`.then()\` y \`.catch()\` funcionan, ES8 introdujo \`async/await\` para leer el código asíncrono como si fuera síncrono.

\`\`\`javascript
// Con Promesas tradicionales:
function obtenerDatos() {
  fetch('https://api.ejemplo.com/datos')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

// Con Async / Await (más limpio):
async function obtenerDatos() {
  try {
    const res = await fetch('https://api.ejemplo.com/datos');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
\`\`\`

### Reglas del Async/Await:
1. \`await\` **solo** se puede usar dentro de una función marcada como \`async\`.
2. Siempre usa \`try/catch\` para manejar los errores (el equivalente a \`.catch()\`).`,
    instructions: `**Tu reto:**
1. Escribe una función \`async\` llamada \`obtenerPokemon(nombre)\`.
2. Usa \`await fetch(...)\` apuntando a la PokeAPI: \`https://pokeapi.co/api/v2/pokemon/\${nombre}\`.
3. Convierte la respuesta a JSON con \`await res.json()\`.
4. Imprime el nombre y el peso (\`data.name\` y \`data.weight\`).
5. Maneja los errores con try/catch (ej. si el pokemon no existe).
6. Llama a tu función con "pikachu" y luego con "pokemonfalso".`,
    initialCode: 'async function obtenerPokemon(nombre) {\n  // TODO: try/catch\n  // TODO: fetch a la PokeAPI\n  // TODO: Convertir a json e imprimir nombre y peso\n}\n\nobtenerPokemon("pikachu");\nobtenerPokemon("pokemonfalso");\n'
  }
];



