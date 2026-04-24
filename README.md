# 🚢 ImportTrack — Guía de instalación paso a paso

## ¿Qué necesitás?
- Una cuenta gratuita en [supabase.com](https://supabase.com)
- Una cuenta gratuita en [vercel.com](https://vercel.com)
- Una cuenta en [github.com](https://github.com)
- Node.js instalado en tu PC (para probar local, opcional)

---

## PASO 1 — Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) → **New project**
2. Ponele un nombre (ej: `importtrack`) y una contraseña a la base de datos
3. Esperá que se cree (1-2 min)
4. Andá a **SQL Editor** → **New query**
5. Copiá y pegá todo el contenido de `supabase_setup.sql` y hacé clic en **Run**
6. Andá a **Settings → API** y copiá:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## PASO 2 — Subir el código a GitHub

1. Creá un repositorio nuevo en GitHub (puede ser privado)
2. Subí todos estos archivos al repositorio
3. Podés hacerlo arrastrando la carpeta o con git:
   ```bash
   git init
   git add .
   git commit -m "ImportTrack inicial"
   git remote add origin https://github.com/TUUSUARIO/importtrack.git
   git push -u origin main
   ```

---

## PASO 3 — Deploy en Vercel

1. Entrá a [vercel.com](https://vercel.com) → **Add New Project**
2. Conectá tu cuenta de GitHub y seleccioná el repo `importtrack`
3. En **Environment Variables** agregá:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://XXXX.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
   ```
4. Hacé clic en **Deploy** — en 2 minutos tenés la app online
5. Vercel te da una URL tipo: `https://importtrack-tuusuario.vercel.app`

---

## PASO 4 — Crear tu cuenta MAESTRO

1. Entrá a tu app en la URL de Vercel
2. Hacé clic en el formulario de login y usá cualquier email/contraseña que quieras
   *(en realidad: la primera vez vas a tener que registrarte — si Supabase no muestra un botón de registro, andá a Supabase → Authentication → Users → Invite user)*
3. Una vez creada la cuenta, andá a **Supabase → SQL Editor** y ejecutá:
   ```sql
   UPDATE public.profiles SET role = 'maestro' WHERE email = 'tu@email.com';
   ```
4. Cerrá sesión y volvé a entrar — ya sos Maestro 🎉

---

## PASO 5 — Crear usuarios desde la app

1. Entrá con tu cuenta Maestro
2. Hacé clic en **⚙️ Usuarios** (arriba a la derecha)
3. Desde ahí podés:
   - Crear nuevos usuarios (Admin o Empleado)
   - Cambiar roles
   - Borrar usuarios

---

## Roles y permisos

| Rol | Ver importaciones | Cambiar estado | Crear/borrar | Gestionar usuarios |
|-----|:-:|:-:|:-:|:-:|
| **Maestro** | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ❌ |
| **Empleado** | ✅ | ❌ | ❌ | ❌ |

---

## Para probar en tu PC (opcional)

```bash
# 1. Instalá dependencias
npm install

# 2. Creá el archivo de variables
cp .env.local.example .env.local
# Editá .env.local con tus claves de Supabase

# 3. Corré la app
npm run dev
# Abrí http://localhost:3000
```

---

## Estructura del proyecto

```
importtrack/
├── app/
│   ├── login/page.tsx        ← Pantalla de login
│   ├── dashboard/page.tsx    ← Vista principal con tarjetas animadas
│   └── maestro/page.tsx      ← Gestión de usuarios (solo Maestro)
├── components/
│   └── StageIcon.tsx         ← Íconos SVG animados de cada estado
├── lib/
│   ├── supabase.ts           ← Cliente Supabase
│   └── types.ts              ← Tipos de datos
├── supabase_setup.sql        ← Script SQL para crear las tablas
└── .env.local.example        ← Variables de entorno necesarias
```

---

## ¿Problemas?

- **"relation profiles does not exist"** → Ejecutá el SQL de nuevo en Supabase
- **"Invalid login credentials"** → Verificá que el email esté confirmado en Supabase → Authentication → Users
- **La app se ve en blanco** → Verificá las variables de entorno en Vercel

---

*Desarrollado para seguimiento de importaciones China → Argentina 🇨🇳 → 🇦🇷*   
