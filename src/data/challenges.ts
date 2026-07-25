export interface Challenge {
  id: number;
  title: string;
  category: string;
  description: string;
  initialCode: string;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "1. Tu primer programa",
    category: "Fundamentos",
    description: "En Python, puedes mostrar mensajes en la pantalla usando la función `print()`. Modifica el código de abajo para que imprima tu nombre en lugar de '¡Hola Mundo!'.",
    initialCode: 'print("¡Hola Mundo!")'
  },
  {
    id: 2,
    title: "2. Variables e Entrada de Datos",
    category: "Fundamentos",
    description: "Usa la función `input()` para pedirle al usuario su nombre y luego imprímelo usando un mensaje personalizado con f-strings (`print(f'Hola {nombre}')`).",
    initialCode: '# Pide el nombre al usuario e imprímelo\nnombre = input("¿Cuál es tu nombre? ")\nprint(f"¡Hola, {nombre}!")'
  },
  {
    id: 3,
    title: "3. Funciones y Operaciones",
    category: "Funciones",
    description: "Crea una función llamada `suma` que pida dos números mediante `input()`, los sume y retorne el resultado.",
    initialCode: 'def suma():\n    num1 = int(input("Ingresa un número: "))\n    num2 = int(input("Ingresa otro número: "))\n    resultado = num1 + num2\n    print(f"Su suma es: {resultado}")\n    return resultado\n\nsuma()'
  },
  {
    id: 4,
    title: "4. Estructuras de Control (If/Else)",
    category: "Lógica",
    description: "Pide una edad al usuario. Si la edad es mayor o igual a 18, imprime 'Eres mayor de edad', de lo contrario imprime 'Eres menor de edad'.",
    initialCode: 'edad = int(input("Ingresa tu edad: "))\n\nif edad >= 18:\n    print("Eres mayor de edad")\nelse:\n    print("Eres menor de edad")'
  },
  {
    id: 5,
    title: "5. Buenas Prácticas (SRP)",
    category: "SOLID",
    description: "Aplica el principio de Responsabilidad Única (SRP): Separa la función que solicita los datos de la función que realiza el cálculo.",
    initialCode: 'def obtener_numeros():\n    a = int(input("Número 1: "))\n    b = int(input("Número 2: "))\n    return a, b\n\ndef calcular_suma(a, b):\n    return a + b\n\nn1, n2 = obtener_numeros()\nprint(f"Resultado: {calcular_suma(n1, n2)}")'
  }
];
