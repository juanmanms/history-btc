# CalcuCrypto

CalcuCrypto es una aplicación web que te permite calcular y rastrear tus transacciones de Bitcoin, mostrando el beneficio total y el porcentaje de ganancia basado en el precio actual de Bitcoin.

## Características

- **Autenticación**: Regístrate e inicia sesión para guardar y gestionar tus transacciones.
- **Transacciones**: Añade, visualiza y elimina tus transacciones de Bitcoin.
- **Cálculo de Beneficios**: Calcula el beneficio total y el porcentaje de ganancia basado en el precio actual de Bitcoin.
- **Actualización en Tiempo Real**: El precio de Bitcoin se actualiza automáticamente cada minuto.

## Tecnologías Utilizadas

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **TypeScript**: Un superconjunto de JavaScript que añade tipos estáticos.
- **Supabase**: Plataforma de backend como servicio que proporciona autenticación y base de datos.
- **Tailwind CSS**: Framework de CSS para un diseño rápido y eficiente.
- **Vite**: Herramienta de construcción rápida para proyectos de frontend.

## Instalación

1. Clona el repositorio:

   ```sh
   git clone https://github.com/juanmanms/history-btc.git
   cd history-btc

   npm install

   ```

2. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

   ```env
   VITE_SUPABASE_URL=https://<supabase-url>.supabase.co
   VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
   ```

3. Inicia la aplicación:
   ```sh
    npm run dev
   ```

## Capturas de Pantalla

![CalcuCrypto Screenshot](https://firebasestorage.googleapis.com/v0/b/botigas-7c71f.appspot.com/o/juanmanms.com%2Fscreenshtos%2FcalcuCrypto.png?alt=media&token=9d47a7d1-e870-4bd4-af00-b3ef68df8bbd)
.
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── src
│ ├── App.tsx
│ ├── index.css
│ ├── main.tsx
│ ├── supabase.ts
│ └── vite-env.d.ts
├── supabase
│ └── migrations
│ └── 20250219072019_emerald_sunset.sql
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
