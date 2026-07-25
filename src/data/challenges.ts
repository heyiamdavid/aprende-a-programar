export interface Challenge {
  id: number;
  title: string;
  category: string;
  description: string;
  initialCode: string;
}

export const CHALLENGES: Challenge[] = [
  // --- MÓDULO 1: Fundamentos ---
  {
    id: 1,
    title: "1. Tu primer programa",
    category: "Fundamentos",
    description: "En Python, puedes mostrar mensajes en la pantalla usando la función `print()`. Modifica el código de abajo para que imprima tu nombre en lugar de '¡Hola Mundo!'.",
    initialCode: 'print("¡Hola Mundo!")'
  },
  {
    id: 2,
    title: "2. Variables y Entrada de Datos",
    category: "Fundamentos",
    description: "Usa la función `input()` para pedirle al usuario su nombre y luego imprímelo usando un mensaje personalizado con f-strings (`print(f'Hola {nombre}')`).",
    initialCode: '# Pide el nombre al usuario e imprímelo\nnombre = input("¿Cuál es tu nombre? ")\nprint(f"¡Hola, {nombre}!")'
  },
  // --- MÓDULO 2: Control de Flujo ---
  {
    id: 3,
    title: "3. Estructuras de Control (If/Else)",
    category: "Control de Flujo",
    description: "Pide una edad al usuario. Si la edad es mayor o igual a 18, imprime 'Eres mayor de edad', de lo contrario imprime 'Eres menor de edad'.",
    initialCode: 'edad = int(input("Ingresa tu edad: "))\n\nif edad >= 18:\n    print("Eres mayor de edad")\nelse:\n    print("Eres menor de edad")'
  },
  {
    id: 4,
    title: "4. Bucle For y Listas",
    category: "Control de Flujo",
    description: "Crea una lista de frutas y usa un bucle `for` para imprimir cada fruta en mayúsculas usando `.upper()`.",
    initialCode: 'frutas = ["manzana", "banana", "cereza", "uva"]\n\nfor fruta in frutas:\n    print(fruta.upper())'
  },
  // --- MÓDULO 3: Funciones y Estructuras ---
  {
    id: 5,
    title: "5. Funciones y Operaciones",
    category: "Funciones",
    description: "Crea una función llamada `suma` que pida dos números mediante `input()`, los sume y retorne el resultado.",
    initialCode: 'def suma():\n    num1 = int(input("Ingresa un número: "))\n    num2 = int(input("Ingresa otro número: "))\n    resultado = num1 + num2\n    print(f"Su suma es: {resultado}")\n    return resultado\n\nsuma()'
  },
  {
    id: 6,
    title: "6. Diccionarios en Python",
    category: "Estructuras de Datos",
    description: "Crea un diccionario de un usuario con llaves 'nombre', 'edad' y 'lenguaje'. Imprime un mensaje usando los datos del diccionario.",
    initialCode: 'usuario = {\n    "nombre": "David",\n    "edad": 22,\n    "lenguaje": "Python"\n}\n\nprint(f"El usuario {usuario[\'nombre\']} aprende {usuario[\'lenguaje\']}.")'
  },
  // --- MÓDULO 4: Programación Orientada a Objetos (POO) ---
  {
    id: 7,
    title: "7. Introducción a Clases y POO",
    category: "Programación Orientada a Objetos",
    description: "Crea una clase `Persona` con un método `presentarse()` que imprima el nombre y la edad de la persona.",
    initialCode: 'class Persona:\n    def __init__(self, nombre, edad):\n        self.nombre = nombre\n        self.edad = edad\n        \n    def presentarse(self):\n        print(f"Hola, soy {self.nombre} y tengo {self.edad} años.")\n\np1 = Persona("Ana", 25)\np1.presentarse()'
  },
  {
    id: 8,
    title: "8. Encapsulamiento",
    category: "Programación Orientada a Objetos",
    description: "Crea una clase `Cuenta` con un atributo privado `__saldo`. Agrega métodos `depositar(monto)` y `obtener_saldo()` para interactuar con el saldo de forma segura.",
    initialCode: 'class Cuenta:\n    def __init__(self):\n        self.__saldo = 0\n        \n    def depositar(self, monto):\n        if monto > 0:\n            self.__saldo += monto\n            \n    def obtener_saldo(self):\n        return self.__saldo\n\nmi_cuenta = Cuenta()\nmi_cuenta.depositar(100)\nprint("Saldo:", mi_cuenta.obtener_saldo())'
  },
  {
    id: 9,
    title: "9. Herencia y Polimorfismo",
    category: "Programación Orientada a Objetos",
    description: "Crea una clase base `Animal` con un método `hacer_sonido()`. Luego crea dos clases hijas: `Perro` y `Gato`, cada una sobrescribiendo el método `hacer_sonido()`.",
    initialCode: 'class Animal:\n    def hacer_sonido(self):\n        pass\n\nclass Perro(Animal):\n    def hacer_sonido(self):\n        return "¡Guau!"\n\nclass Gato(Animal):\n    def hacer_sonido(self):\n        return "¡Miau!"\n\nmascotas = [Perro(), Gato()]\nfor mascota in mascotas:\n    print(mascota.hacer_sonido())'
  },
  // --- MÓDULO 5: Arquitectura y Proyectos ---
  {
    id: 10,
    title: "10. Buenas Prácticas (SRP)",
    category: "Arquitectura",
    description: "Aplica el principio de Responsabilidad Única (SRP): Separa la función que solicita los datos de la función que realiza el cálculo.",
    initialCode: 'def obtener_numeros():\n    a = int(input("Número 1: "))\n    b = int(input("Número 2: "))\n    return a, b\n\ndef calcular_suma(a, b):\n    return a + b\n\nn1, n2 = obtener_numeros()\nprint(f"Resultado: {calcular_suma(n1, n2)}")'
  },
  {
    id: 11,
    title: "11. Proyecto Final: Sistema Bancario",
    category: "Proyectos Finales",
    description: "Desarrolla un sistema bancario usando POO. Debes crear una clase `CuentaBancaria` que valide depósitos, permita retiros (verificando que haya saldo suficiente) y mantenga un historial de transacciones. Intenta provocar un error para ver cómo la IA te ayuda a depurarlo.",
    initialCode: 'class CuentaBancaria:\n    def __init__(self, titular, saldo_inicial=0):\n        self.titular = titular\n        self.__saldo = saldo_inicial\n        self.historial = []\n\n    def depositar(self, monto):\n        # TODO: Implementar validación y agregar al historial\n        pass\n        \n    def retirar(self, monto):\n        # TODO: Verificar si hay saldo suficiente y descontar\n        pass\n\n# Prueba tu código aquí:\ncuenta = CuentaBancaria("David")\ncuenta.depositar(500)\ncuenta.retirar(200)\ncuenta.retirar(1000) # Debería mostrar un mensaje de error'
  }
];
