-- Script para crear las tablas base del proyecto en Supabase

-- 1. Tabla para almacenar los perfiles de usuario (sincronizado con Clerk de ser necesario)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Usamos TEXT porque Clerk genera IDs tipo 'user_2xyz...'
  email TEXT NOT NULL,
  first_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla para almacenar los retos/desafíos de programación
CREATE TABLE IF NOT EXISTS public.challenges (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  initial_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla para almacenar el progreso de cada usuario en cada reto
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id INTEGER REFERENCES public.challenges(id) ON DELETE CASCADE,
  saved_code TEXT, -- El último código que el usuario escribió
  completed BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, challenge_id) -- Un usuario solo puede tener un registro de progreso por reto
);

-- Configurar Políticas de Seguridad RLS (Row Level Security)
-- (Como usas Clerk, la verificación de RLS requeriría una configuración avanzada con JWT.
-- Por simplicidad inicial, dejaremos que cualquiera autenticado pueda leer/escribir su propio código,
-- o puedes gestionarlo a través de un backend/API route).

-- Insertar algunos retos de prueba
INSERT INTO public.challenges (title, description, initial_code) VALUES
('1. Tu primer programa', 'Aprende a usar la función print() para mostrar texto. Modifica el código para imprimir tu nombre.', 'print("¡Hola Mundo!")'),
('2. Variables simples', 'Crea una variable llamada "edad", asígnale tu edad e imprímela.', '# Escribe tu código aquí\n')
ON CONFLICT DO NOTHING;
