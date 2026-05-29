# Desarrollo Mobile

Monorepo con los proyectos de la asignatura de Desarrollo Móvil. Reúne tres aplicaciones independientes hechas en **React Native**, cada una pensada para practicar un conjunto distinto de conceptos: persistencia local, navegación con tabs y mock data, e integración completa con un backend en tiempo real.

Cada carpeta es un proyecto autónomo con su propio `package.json`, sus dependencias nativas y sus scripts. No comparten código entre sí.

---

## 📒 Notes

Aplicación de notas / tareas pensada como primer contacto con React Native y persistencia local.

**Stack principal**
- React Native 0.85 + TypeScript
- React Navigation (Stack)
- AsyncStorage para persistir las notas en el dispositivo
- NativeWind (TailwindCSS) para los estilos
- `react-native-vector-icons` para la iconografía

**Qué incluye**
- Pantalla principal con el listado de tareas guardadas (`HomeScreen`).
- Pantalla para crear y editar tareas (`AddEditTaskScreen`).
- Almacenamiento en `AsyncStorage` con IDs generados vía `uuid`.
- Navegación tipo stack entre las dos vistas.

**Cómo correrlo**
```sh
cd Notes
npm install
npm start            # Metro
npm run ios          # o npm run android
```

---

## 🍳 cookbook

Aplicación de recetas que sirve para ejercitar navegación con tabs, context API y trabajo con datos simulados.

**Stack principal**
- React Native 0.84 (JavaScript)
- React Navigation (Bottom Tabs + Native Stack)
- Context API para el estado global de recetas
- Reanimated + Gesture Handler
- NativeWind para los estilos

**Qué incluye**
- Listado de recetas (`RecipeListScreen`).
- Detalle de cada receta (`RecipeDetailScreen`).
- Formulario para agregar nuevas recetas (`AddRecipeScreen`).
- Sección de tips de cocina (`CookingTipsScreen`).
- Datos iniciales servidos desde `src/mockdata`.

**Cómo correrlo**
```sh
cd cookbook
npm install
npm start
npm run ios          # o npm run android
```

---

## 🚖 uberClone

Proyecto final de la asignatura. Es un clon de Uber con dos roles (pasajero y conductor), mapas, geolocalización y backend en tiempo real con Firebase.

**Stack principal**
- React Native 0.85 + TypeScript
- Firebase (Auth + Firestore) para autenticación y datos en vivo
- Redux Toolkit + redux-persist para el estado global
- React Navigation (Native Stack + Bottom Tabs + Material Top Tabs)
- `react-native-maps` y `@react-native-community/geolocation` para mapas y ubicación
- i18next para internacionalización
- Zod para validación de esquemas
- NativeWind para los estilos

**Qué incluye**
- **Flujo de autenticación**: onboarding, login, registro y permisos de ubicación.
- **Pasajero**: tabs de home, historial, billetera y perfil; flujo completo de viaje (búsqueda de destino, selección de vehículo, búsqueda de conductor, llegada, viaje en curso, pago y calificación).
- **Conductor**: tabs propios de home, historial, ganancias y perfil, con su propio flujo de viaje.
- **Tracking en vivo** del conductor sobre el mapa, ETA y tarifas en COP.
- **Backend**: Firestore con reglas de seguridad e índices documentados (`docs/`), y script de seeds (`npm run seed`).

**Cómo correrlo**
```sh
cd uberClone
pnpm install
pnpm start
pnpm ios             # o pnpm android
```

Requiere variables de entorno para Firebase y Google Maps. Ver `docs/features.md` y `docs/firestore-indexes.md` para más contexto del backend.

---

## Estructura del repo

```
.
├── Notes/        # App de notas / tareas
├── cookbook/     # App de recetas
└── uberClone/    # Proyecto final: clon de Uber
```

## Requisitos generales

- Node.js ≥ 22.11
- Entorno de React Native configurado para iOS y/o Android ([guía oficial](https://reactnative.dev/docs/set-up-your-environment))
- CocoaPods para iOS (`bundle install && bundle exec pod install` dentro de cada `ios/`)
