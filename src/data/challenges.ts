export interface Challenge {
  id: number;
  title: string;
  category: string;
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
  }
];
