export interface QuizQuestion {
  id: number;
  category: string; // "SOLID" | "POO" | "Patrones" | "Python"
  difficulty: 'facil' | 'medio' | 'dificil';
  question: string;
  code?: string; // Fragmento de código opcional en la pregunta
  options: string[];
  correctIndex: number;
  explanation: string; // Explicación de por qué es la respuesta correcta
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ──────────────── Python Básico ────────────────
  {
    id: 1,
    category: "Python",
    difficulty: "facil",
    question: "¿Qué imprime el siguiente código?",
    code: `x = 10
y = 3
print(x // y)`,
    options: ["3.33", "3", "4", "Error"],
    correctIndex: 1,
    explanation: "El operador `//` es la **división entera** (floor division). `10 // 3 = 3` porque descarta el decimal."
  },
  {
    id: 2,
    category: "Python",
    difficulty: "facil",
    question: "¿Cuál es la forma correcta de crear una lista vacía en Python?",
    options: ["list = {}", "list = []", "list = ()", "list = <empty>"],
    correctIndex: 1,
    explanation: "Los **corchetes** `[]` crean una lista. Las llaves `{}` crean un set o diccionario, y los paréntesis `()` crean una tupla."
  },
  {
    id: 3,
    category: "Python",
    difficulty: "medio",
    question: "¿Qué valor tiene `resultado` al final?",
    code: `numeros = [1, 2, 3, 4, 5]
resultado = [n * 2 for n in numeros if n % 2 == 0]`,
    options: ["[2, 4, 6, 8, 10]", "[4, 8]", "[2, 4]", "[1, 3, 5]"],
    correctIndex: 1,
    explanation: "La list comprehension filtra los pares (`if n % 2 == 0` → `2, 4`) y los multiplica por 2 → `[4, 8]`."
  },
  {
    id: 4,
    category: "Python",
    difficulty: "medio",
    question: "¿Cuál es la diferencia entre `is` y `==` en Python?",
    options: [
      "Son exactamente lo mismo",
      "`==` compara valores, `is` compara identidad de objeto en memoria",
      "`is` compara valores, `==` compara tipo de dato",
      "`is` solo funciona con números"
    ],
    correctIndex: 1,
    explanation: "`==` verifica si los **valores** son iguales. `is` verifica si ambas variables apuntan al **mismo objeto en memoria**."
  },

  // ──────────────── Programación Orientada a Objetos ────────────────
  {
    id: 5,
    category: "POO",
    difficulty: "facil",
    question: "¿Para qué sirve el método `__init__` en una clase Python?",
    options: [
      "Para destruir el objeto cuando ya no se necesita",
      "Para inicializar los atributos del objeto al momento de crearlo",
      "Para hacer que la clase sea pública",
      "Para definir métodos de clase"
    ],
    correctIndex: 1,
    explanation: "`__init__` es el **constructor**: se ejecuta automáticamente cuando creas un objeto y sirve para inicializar sus atributos."
  },
  {
    id: 6,
    category: "POO",
    difficulty: "medio",
    question: "¿Cuál de los siguientes principios aplica este código?",
    code: `class Cuenta:
    def __init__(self):
        self.__saldo = 0  # Atributo privado
    
    def depositar(self, monto):
        if monto > 0:
            self.__saldo += monto
    
    def obtener_saldo(self):
        return self.__saldo`,
    options: ["Herencia", "Polimorfismo", "Encapsulamiento", "Abstracción"],
    correctIndex: 2,
    explanation: "El atributo `__saldo` es **privado** (doble guion bajo) y solo se accede a él mediante los métodos `depositar` y `obtener_saldo`. Eso es **Encapsulamiento**."
  },
  {
    id: 7,
    category: "POO",
    difficulty: "medio",
    question: "¿Qué principio de POO permite que `Perro` y `Gato` tengan su propia versión del método `hacer_sonido()`?",
    code: `class Animal:
    def hacer_sonido(self): pass

class Perro(Animal):
    def hacer_sonido(self): return "¡Guau!"

class Gato(Animal):
    def hacer_sonido(self): return "¡Miau!"`,
    options: ["Encapsulamiento", "Herencia + Polimorfismo", "Abstracción pura", "Composición"],
    correctIndex: 1,
    explanation: "**Herencia** permite que `Perro` y `Gato` hereden de `Animal`. **Polimorfismo** permite que cada clase tenga su propia implementación de `hacer_sonido()`."
  },
  {
    id: 8,
    category: "POO",
    difficulty: "dificil",
    question: "¿Qué problema tiene el siguiente diseño de clase?",
    code: `class Usuario:
    def __init__(self, nombre):
        self.nombre = nombre
    
    def guardar_en_db(self):
        # Conecta a la base de datos y guarda
        pass
    
    def enviar_email(self):
        # Envía un correo de bienvenida
        pass
    
    def generar_reporte(self):
        # Genera un PDF con los datos del usuario
        pass`,
    options: [
      "No tiene ningún problema, está bien diseñada",
      "Viola el Principio de Responsabilidad Única (SRP): una clase con demasiadas responsabilidades",
      "Falta el constructor `__init__`",
      "Los métodos deben ser privados"
    ],
    correctIndex: 1,
    explanation: "**SRP (Single Responsibility Principle):** La clase `Usuario` tiene 3 responsabilidades distintas (persistencia, email, reportes). Cada una debería estar en una clase separada para facilitar el mantenimiento."
  },

  // ──────────────── Principios SOLID ────────────────
  {
    id: 9,
    category: "SOLID",
    difficulty: "facil",
    question: "¿Qué significa SRP en los principios SOLID?",
    options: [
      "Single Repository Pattern",
      "Single Responsibility Principle (Principio de Responsabilidad Única)",
      "Structured Runtime Program",
      "Simple Refactoring Practice"
    ],
    correctIndex: 1,
    explanation: "**SRP** = Single Responsibility Principle: cada clase o función debe tener **una sola razón para cambiar**, es decir, una única responsabilidad."
  },
  {
    id: 10,
    category: "SOLID",
    difficulty: "medio",
    question: "¿Cuál de estos fragmentos aplica correctamente el Principio de Responsabilidad Única?",
    options: [
      `def procesar_todo():\n    datos = input('Datos: ')\n    resultado = int(datos) * 2\n    print(resultado)`,
      `def obtener_dato(): return input('Dato: ')\ndef calcular(x): return int(x) * 2\ndef mostrar(r): print(r)`,
      "Ambos aplican SRP correctamente",
      "Ninguno aplica SRP"
    ],
    correctIndex: 1,
    explanation: "La segunda opción separa la **entrada**, el **cálculo** y la **salida** en funciones distintas. Cada función tiene una sola responsabilidad → SRP correcto."
  },
  {
    id: 11,
    category: "SOLID",
    difficulty: "medio",
    question: "El principio Open/Closed (OCP) dice que el software debe estar:",
    options: [
      "Abierto para su uso, cerrado para los desarrolladores",
      "Abierto para extensión, cerrado para modificación",
      "Cerrado para extensión, abierto para modificación",
      "Completamente cerrado al público"
    ],
    correctIndex: 1,
    explanation: "**OCP**: Puedes *extender* el comportamiento de una clase (por ejemplo, creando una subclase) sin *modificar* el código original. Así evitas romper funcionalidades existentes."
  },
  {
    id: 12,
    category: "SOLID",
    difficulty: "dificil",
    question: "¿Qué principio SOLID se viola en este código?",
    code: `class Notificador:
    def notificar(self, canal, mensaje):
        if canal == "email":
            # enviar email
            pass
        elif canal == "sms":
            # enviar sms
            pass
        elif canal == "push":
            # enviar notificación push
            pass`,
    options: [
      "Liskov Substitution Principle (LSP)",
      "Dependency Inversion Principle (DIP)",
      "Open/Closed Principle (OCP): hay que modificar la clase al agregar un canal",
      "Interface Segregation Principle (ISP)"
    ],
    correctIndex: 2,
    explanation: "**OCP** se viola porque cada vez que agregas un nuevo canal (ej. 'whatsapp'), debes *modificar* el método `notificar`. La solución: crear una clase abstracta `Canal` y una subclase por cada tipo."
  },
  {
    id: 13,
    category: "SOLID",
    difficulty: "dificil",
    question: "¿Qué principio SOLID aplica el siguiente código?",
    code: `from abc import ABC, abstractmethod

class Repositorio(ABC):
    @abstractmethod
    def guardar(self, dato): pass

class RepositorioMySql(Repositorio):
    def guardar(self, dato):
        print(f"Guardando en MySQL: {dato}")

class RepositorioMongo(Repositorio):
    def guardar(self, dato):
        print(f"Guardando en MongoDB: {dato}")`,
    options: [
      "SRP - Responsabilidad Única",
      "OCP - Open/Closed",
      "DIP - Inversión de Dependencias: depende de abstracciones, no de implementaciones concretas",
      "LSP - Sustitución de Liskov"
    ],
    correctIndex: 2,
    explanation: "**DIP (Dependency Inversion):** La clase abstracta `Repositorio` define el contrato. Las clases de alto nivel dependen de la abstracción, no de `MySQL` o `MongoDB` directamente."
  },

  // ──────────────── Patrones de Diseño ────────────────
  {
    id: 14,
    category: "Patrones",
    difficulty: "medio",
    question: "¿Qué patrón de diseño garantiza que una clase solo tenga UNA instancia en toda la aplicación?",
    options: ["Factory Method", "Observer", "Singleton", "Decorator"],
    correctIndex: 2,
    explanation: "**Singleton** asegura que solo exista un objeto de esa clase en memoria. Muy usado para configuraciones globales, conexiones a base de datos, etc."
  },
  {
    id: 15,
    category: "Patrones",
    difficulty: "dificil",
    question: "¿Qué patrón de diseño se aplica en este código?",
    code: `class Figura(ABC):
    @abstractmethod
    def area(self): pass

class Circulo(Figura):
    def area(self): return 3.14 * self.radio ** 2

class Rectangulo(Figura):
    def area(self): return self.largo * self.ancho

# Uso:
for figura in [Circulo(), Rectangulo()]:
    print(figura.area())`,
    options: [
      "Singleton",
      "Observer",
      "Strategy / Template Method (polimorfismo con método abstracto)",
      "Decorator"
    ],
    correctIndex: 2,
    explanation: "Se aplica el patrón **Strategy / Template Method**: la clase base `Figura` define el contrato (`area`), y cada subclase implementa su propia versión. Esto permite intercambiarlas sin cambiar el código cliente."
  },
  {
    id: 16,
    category: "Patrones",
    difficulty: "dificil",
    question: "¿Cuándo deberías usar el patrón Factory Method?",
    options: [
      "Cuando quieres que solo haya una instancia de una clase",
      "Cuando quieres delegar a las subclases la decisión de qué objeto crear",
      "Cuando quieres observar cambios en un objeto",
      "Cuando necesitas agregar funcionalidades sin modificar la clase original"
    ],
    correctIndex: 1,
    explanation: "**Factory Method** delega la creación del objeto a las subclases. Es útil cuando no sabes de antemano qué tipo de objeto necesitas hasta el tiempo de ejecución."
  },
  
  // ──────────────── Programación Estructurada & Básicos ────────────────
  {
    id: 17,
    category: "Python",
    difficulty: "facil",
    question: "¿Cuántas veces se ejecuta el siguiente bucle `while`?",
    code: `contador = 0
while contador < 3:
    print(contador)
    contador += 1`,
    options: ["2", "3", "4", "Infinitas veces"],
    correctIndex: 1,
    explanation: "El bucle se ejecuta para `contador = 0`, `1` y `2`. Son exactamente **3 veces**. Cuando llega a 3, la condición `3 < 3` es falsa y se detiene."
  },
  {
    id: 18,
    category: "Python",
    difficulty: "medio",
    question: "¿Qué genera la función `range(1, 10, 2)` en un bucle for?",
    options: [
      "1, 2, 3, 4, 5, 6, 7, 8, 9",
      "1, 3, 5, 7, 9",
      "2, 4, 6, 8, 10",
      "1, 10, 2"
    ],
    correctIndex: 1,
    explanation: "`range(inicio, fin, paso)` empieza en `1`, termina antes de `10`, dando saltos de `2` en `2`. El resultado es **1, 3, 5, 7, 9**."
  },
  {
    id: 19,
    category: "Python",
    difficulty: "facil",
    question: "¿Cuál es el propósito de la palabra reservada `elif`?",
    options: [
      "Terminar la ejecución de un bucle",
      "Evaluar una condición adicional si el `if` previo fue falso",
      "Declarar una variable global",
      "Definir una función anónima"
    ],
    correctIndex: 1,
    explanation: "`elif` es la abreviatura de 'else if'. Permite **evaluar múltiples condiciones en cadena** sin necesidad de anidar bloques `if/else`."
  },

  // ──────────────── POO Avanzada ────────────────
  {
    id: 20,
    category: "POO",
    difficulty: "medio",
    question: "¿Para qué sirve la función `super()` en POO?",
    options: [
      "Para hacer que una clase sea pública",
      "Para acelerar la ejecución del código",
      "Para llamar a métodos (usualmente el constructor) de la clase padre",
      "Para crear variables estáticas"
    ],
    correctIndex: 2,
    explanation: "`super()` devuelve un objeto proxy que delega las llamadas a métodos a una **clase padre** (o hermana), permitiendo reutilizar su comportamiento sin reescribirlo."
  },
  {
    id: 21,
    category: "POO",
    difficulty: "dificil",
    question: "¿Qué es un método estático (`@staticmethod`)?",
    options: [
      "Un método que solo puede ser llamado una vez",
      "Un método que no recibe la instancia (`self`) ni la clase (`cls`) como primer argumento",
      "Un método privado",
      "Un método que no retorna nada"
    ],
    correctIndex: 1,
    explanation: "Un `@staticmethod` actúa como una función normal pero pertenece al espacio de nombres de la clase. **No modifica ni accede** al estado del objeto ni de la clase, porque no recibe `self` ni `cls`."
  },
  {
    id: 22,
    category: "POO",
    difficulty: "medio",
    question: "En Python, ¿qué significa que un lenguaje soporte Herencia Múltiple?",
    options: [
      "Que puedes instanciar un objeto múltiples veces",
      "Que un bucle puede heredar variables de otro bucle",
      "Que una subclase puede heredar de múltiples clases padre al mismo tiempo",
      "Que todos los objetos heredan de 'Object' por defecto"
    ],
    correctIndex: 2,
    explanation: "**Herencia Múltiple** significa que una clase puede tener más de una clase base. Por ejemplo: `class Hija(Padre1, Padre2): pass`."
  },

  // ──────────────── SOLID y Patrones (Avanzados) ────────────────
  {
    id: 23,
    category: "SOLID",
    difficulty: "medio",
    question: "¿Qué principio sugiere que no debes forzar a un cliente a depender de interfaces que no utiliza?",
    options: [
      "Principio de Inversión de Dependencias (DIP)",
      "Principio de Abierto/Cerrado (OCP)",
      "Principio de Segregación de Interfaces (ISP)",
      "Principio de Responsabilidad Única (SRP)"
    ],
    correctIndex: 2,
    explanation: "**ISP (Interface Segregation Principle):** Es mejor tener muchas interfaces (o clases abstractas) pequeñas y específicas, en lugar de una interfaz gigante con métodos que algunas clases no van a usar."
  },
  {
    id: 24,
    category: "SOLID",
    difficulty: "dificil",
    question: "¿De qué trata el Principio de Sustitución de Liskov (LSP)?",
    options: [
      "Cualquier objeto de una clase padre debe poder ser sustituido por un objeto de su clase hija sin romper la aplicación",
      "Las clases deben estar cerradas a modificación",
      "Una clase debe tener una sola razón para cambiar",
      "Debes usar inyección de dependencias para sustituir variables"
    ],
    correctIndex: 0,
    explanation: "**LSP:** Si S es subtipo de T, los objetos de tipo T pueden ser sustituidos por objetos de tipo S sin alterar las propiedades del programa. En resumen, **una subclase nunca debe romper el contrato esperado de la clase padre**."
  },
  {
    id: 25,
    category: "Patrones",
    difficulty: "medio",
    question: "El patrón `Observer` es útil para:",
    options: [
      "Asegurar que exista una única instancia global de una clase",
      "Definir una dependencia uno-a-muchos, para que cuando un objeto cambie, notifique a todos sus dependientes",
      "Ocultar la complejidad del sistema bajo una interfaz simplificada",
      "Añadir responsabilidades dinámicamente a un objeto"
    ],
    correctIndex: 1,
    explanation: "**Observer** (Observador) permite que varios objetos 'escuchen' eventos o cambios de estado de un objeto central (sujeto), facilitando la comunicación asíncrona o la actualización de UI."
  },
  {
    id: 26,
    category: "Patrones",
    difficulty: "dificil",
    question: "El patrón `Decorator` se usa para:",
    options: [
      "Decorar la consola con colores",
      "Clonar un objeto existente",
      "Añadir nuevas funcionalidades o comportamientos a un objeto en tiempo de ejecución, envolviéndolo en otro objeto",
      "Instanciar objetos complejos paso a paso"
    ],
    correctIndex: 2,
    explanation: "**Decorator** 'envuelve' el objeto original dentro de otro objeto que añade comportamientos, proporcionando una alternativa flexible a la herencia."
  }
];
