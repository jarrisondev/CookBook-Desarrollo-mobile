# uberClone — Catálogo de features

Resumen completo de funcionalidades implementadas, organizado para que sirva de checklist durante la presentación.

---

## 1. Stack técnico

- **React Native CLI 0.85.3** (no Expo), TypeScript end-to-end
- **pnpm** como gestor de paquetes con `node-linker=hoisted` para compatibilidad con Metro
- **NativeWind v4 + Tailwind** para estilos
- **React Navigation v7** (Native Stack + Bottom Tabs)
- **Redux Toolkit** + **redux-persist** + AsyncStorage
- **i18next + react-i18next** (español por defecto, inglés disponible)
- **Firebase 10.14.1 (Web SDK)** usando imports directos `@firebase/*` con resolver de Metro custom
- **Zod v4** para validación de schemas + Firestore data converters
- **react-native-maps** (Google Maps en Android, Apple Maps en iOS)
- **react-native-reanimated v4** + worklets
- **@react-native-community/geolocation** para ubicación en vivo

### APIs de Google Maps Platform
- Maps SDK for Android
- Places API (New) — autocomplete + place details con session tokens
- Directions API — ruta + distancia + ETA
- Distance Matrix API
- Geocoding API — fallback cuando Place Details no devuelve coordenadas

---

## 2. Autenticación & roles

- Login con email + contraseña (Firebase Auth)
- Registro con selección de rol (rider / driver)
- **Cuentas demo** preconfiguradas: `rider@demo.com` / `driver@demo.com`
- **Auto-fill** de credenciales en Login (toggle visible) para que el jurado entre rápido
- Auth bootstrap: sesión persistente al reabrir la app
- Splash screen + Onboarding (3 pasos)
- Logout desde Settings
- Pantalla "Habilitar ubicación" para pedir permisos antes de entrar al flujo principal

---

## 3. Rider — flujo completo

### Home
- Mapa real centrado en la ubicación del usuario
- Lista de lugares guardados (casa, trabajo, favoritos)
- Lista de recientes (con dedupe automático, máx. 6)
- Tap rápido en un lugar guardado → al selector de vehículo
- Botón "¿A dónde vas?" → Search

### Búsqueda de destino
- Autocomplete real con **Google Places API (New)** + session tokens
- Lugares guardados también aparecen en la lista
- Sugerencias sesgadas por ubicación actual (radio de 30 km)
- Place Details para obtener coordenadas exactas
- **Fallback de Geocoding** si Place Details no devuelve `location`

### Selección de vehículo + tarifa
- 3 categorías: **Económico / XL / Premium**
- Cada una con base, precio por km, precio por minuto y mínimo
- **Cálculo de tarifa dinámico** según distancia + categoría (en COP, redondeado a $50)
- **Ruta completa visible en el mapa ANTES de pedir** (no solo pin)
- Markers de pickup + destino con colores distintos
- Auto-fit del mapa al área visible (considera el alto del bottom sheet)
- Selector de método de pago (efectivo / tarjeta / wallet) ANTES del viaje
- Validación: si elige tarjeta y no tiene tarjeta guardada → alerta

### Esperando conductor → viaje
1. **SearchingDriver** — pantalla de búsqueda con monto y opción de cancelar
2. **RideTracking** — driver asignado, viene en camino
   - Datos del conductor (foto/avatar, nombre, rating, carro, placa)
   - Marker del conductor moviéndose en el mapa (icono de carro)
   - Ruta dinámica desde la posición del driver hasta el pickup
   - ETA y distancia **en vivo** (re-calculado con Directions API)
   - Botones de llamar / mensaje (mock)
   - Cancelar viaje (sólo permitido antes del pickup)
3. **DriverArrived** — el conductor ya llegó (pantalla intermedia)
4. **TripInProgress** — viaje en curso
   - Mapa con zoom cerrado siguiendo al conductor
   - Polyline que se va acortando conforme avanza
   - ETA al destino actualizado en vivo
5. **Payment** — desglose de tarifa, propina, total
6. **Rating** — calificar y comentar (1-5 estrellas)

### Tabs del rider
- **Home** — buscar / pedir
- **Wallet** — saldo, tarjetas guardadas (CRUD), bonus
- **Historial** — viajes pasados desde Firestore (completados + cancelados)
- **Trip detail** — detalle completo de un viaje del historial
- **Perfil** — datos personales, tarjetas, settings

---

## 4. Driver — flujo completo

### Home del conductor
- Mapa con su ubicación
- **Switch online/offline**
- Suscripción en tiempo real a solicitudes pendientes (`status == 'searching'`)
- Balance, ingresos del día, viajes del día, rating
- Pantalla "Buscando solicitudes..." cuando está online

### Solicitud entrante
- Modal con countdown de 15 segundos
- Datos del rider (nombre, rating, foto)
- Origen + destino + km + ETA
- Monto del viaje
- Aceptar / rechazar

### Flujo del viaje activo
1. **IncomingRide** — recibe oferta
2. **DriverPickup** — yendo al rider
   - Mapa con ubicación viva del conductor (watchPosition)
   - Ruta dinámica desde su posición hasta el pickup
   - **Marker estilo carro** (no pin) para sí mismo
   - ETA al pickup en vivo
   - Llamar / mensaje / cancelar
   - Botón "He llegado"
3. **DriverWaiting** — espera al rider (pantalla intermedia entre arrived y start)
4. **DriverInProgress** — viaje en curso
   - **Zoom cerrado** en la ruta restante
   - La cámara se va adaptando conforme avanza
   - Marker del pickup oculto (ya no hace falta)
   - Distancia + ETA al destino en vivo
   - Confirmación especial para pagos en efectivo al finalizar
5. **DriverCompleted** — resumen del viaje con ganancias

### Tabs del conductor
- **Home**
- **Earnings** — ingresos semanales, gráfica, métricas (aceptación, cancelación, viajes activos)
- **Historial** — viajes completados/cancelados desde Firestore
- **Perfil** — datos personales, datos del vehículo, settings

---

## 5. Mapas & ubicación (showcase técnico)

- **Mapa real** con Google Maps SDK (Android) / Apple Maps (iOS)
- API key cargada desde `.env` vía `manifestPlaceholders` (no hardcodeada)
- Permisos de ubicación pedidos al inicio con mensaje custom
- `useLocation` (one-shot) para coords iniciales
- `useLocationTracking` (continuo) con `distanceFilter: 15m`
- **Driver publica ubicación a Firestore** cada que se mueve >15m, con throttle de 2.5s
- **Rider lee la ubicación del driver vía onSnapshot** y la muestra en su mapa
- Polyline decodificado desde Google Directions (algoritmo de polyline encoding)
- Ruta re-fetch cuando el origen cambia >110m (coarseCoords helper)
- ETA / distancia en vivo desde Directions, NO desde valores guardados
- Markers tematizados: pin verde (pickup), pin negro (dropoff), círculo con icono de carro (driver)
- Botón "Mi ubicación" + botón "Ver toda la ruta"
- Auto-fit con padding que considera el bottom sheet
- Modo `tightFit` con padding reducido para los screens in-progress
- `hidePickupMarker` durante el viaje (ya no aporta)

---

## 6. Firestore — sincronización en tiempo real

### Estructura
- `users/{uid}` — perfil + rol + balance + rating
- `users/{uid}/cards/{cardId}` — tarjetas guardadas (subcolección)
- `users/{uid}/places/{placeId}` — lugares guardados/recientes (subcolección)
- `rides/{rideId}` — máquina de estados del viaje

### Estados del ride
`searching → accepted → arrived → inProgress → completed | cancelled`

### Sincronización
- **`onSnapshot`** para todo: ride activo del rider, del driver, requests abiertos, perfil
- Driver y rider ven los cambios del otro **instantáneamente**
- Cuando el rider cancela, al driver le hace popToTop automáticamente
- Cuando el driver acepta, al rider le navega a `RideTracking`
- **Auto-resume del ride activo** al abrir la app (ambos roles): si tenía un viaje en `accepted/arrived/inProgress`, lo manda a la pantalla correspondiente
- Walk-up del navigator tree para que `navigate` desde el tabs llegue al stack correcto

### Validación y tipos
- **Zod schemas** para `User`, `Ride`, `SavedPlace`, `PaymentCard`
- Firestore **data converters** tipados (lee → schema → tipo)
- Errores de parseo logueados con warning, no crashean la app

### Security Rules
- Rider sólo puede crear rides con su propio `riderId` y status `searching`
- Driver sólo puede aceptar rides en `searching` y se asigna como `driverId`
- Sólo el `riderId` puede modificar `status` a `cancelled` antes del pickup
- Sólo el `driverId` asignado puede modificar status de avance (arrived/started/completed) y `driverLocation`
- Subcolecciones de cards/places: sólo el dueño
- Drivers pueden leer rides en `searching` para verlos en su feed

### Índices compuestos
Definidos en `firestore.indexes.json`:
- `status + createdAt` (open requests)
- `driverId + status` (ride activo del driver)
- `riderId + status` (ride activo del rider)
- `riderId + status + createdAt` (historial rider)
- `driverId + status + createdAt` (historial driver)

---

## 7. Pagos

- 3 métodos: **efectivo / tarjeta / wallet (saldo interno)**
- Selección **ANTES** del viaje (no después, decisión de UX)
- CRUD de tarjetas en Wallet (agregar / setear default / borrar)
- Detección de marca de tarjeta (Visa, Mastercard, etc.) según BIN
- Validación de número (Luhn), expiración (MM/YY) y CVV
- Bonus visual ("Promo 15%") en el selector
- Confirmación especial cuando el conductor finaliza un viaje en efectivo

---

## 8. UX y polish

- **Tema minimalista verde** custom (no es el default de Tailwind)
- **Dark mode** (toggle manual o seguir sistema)
- **Bilingüe** (español por defecto, inglés cambiable en settings)
- **COP** como moneda, formato `es-CO`, sin decimales
- Bottom sheet con drag handle
- Shadows custom (`shadows.card`, `shadows.cardLg`)
- Iconos de Lucide React Native
- Componentes reutilizables: `Avatar`, `Button`, `Card`, `Divider`, `IconButton`, `MapView`, `RideMap`, `Select`
- Loading states en botones (spinner inline)
- Error handling con `Alert.alert`, no crashes silenciosos
- Animaciones de navegación nativas

---

## 9. Decisiones de diseño destacables

- **Rider pasivo**: sólo puede cancelar antes del pickup. Todas las transiciones de estado las hace el driver.
- **Pago elegido antes del viaje**: refleja cómo opera Uber realmente y evita fricción al final.
- **Cálculo de tarifa por categoría dinámico**: cada categoría tiene base/perKm/perMinute/min distintos.
- **ETA y km en tiempo real**: NO se usan los valores guardados al crear el ride después de aceptado; se recalculan con Directions API según la posición actual del driver.
- **Hooks compartidos** para evitar duplicación: `useRideSubscription`, `useDriverRideSubscription`, `useActiveRideBootstrap` (×2), `_rideNavigationHelpers`.
- **Coarsening de coordenadas**: para que `routeFrom` no dispare un fetch a Directions cada metro, se redondea a ~110m de precisión.
- **Geocoding fallback**: si Place Details no devuelve coords, se geocodifica el `address` para no quedar sin ruta.
- **Backfill de coords en places guardados**: si un place reciente se guardó sin coords y luego el rider lo elige y se resuelven, se hace update en Firestore.

---

## 10. Configuración / DevOps

- API key de Google Maps en `.env` (gitignored), inyectada vía `manifestPlaceholders` en `build.gradle`
- `env.d.ts` con types para `@env`
- Custom resolver en `metro.config.js` para los imports `@firebase/auth/dist/rn/index.js`
- `pnpm-workspace.yaml` para hoisting controlado
- `firestore.indexes.json` deployable con `firebase deploy --only firestore:indexes`
- `docs/firestore.rules` versionado
- `docs/firestore-indexes.md` con instrucciones manuales
- `.claude/` ignorado en git

---

## 11. Posibles preguntas del jurado y respuesta corta

| Pregunta | Respuesta corta |
|---|---|
| ¿Por qué Firebase Web SDK y no React Native Firebase? | Por simplicidad de setup; con resolver custom de Metro funciona en RN sin código nativo extra. |
| ¿Por qué Google Maps en Android y Apple Maps en iOS? | `react-native-maps` los soporta nativamente, ahorra costos en iOS y respeta la HIG de Apple. |
| ¿Cómo evitan que 2 drivers acepten el mismo viaje? | Las security rules sólo permiten el cambio `searching → accepted` si el ride sigue en `searching`. El segundo intento falla. |
| ¿Cómo manejan reconexión / app cerrada con ride activo? | Hooks de bootstrap que se suscriben al ride activo en Firestore y navegan a la pantalla correcta automáticamente. |
| ¿Qué pasa si Directions API falla? | Cae al `etaMin`/`distanceKm` guardado al crear el ride. La UI nunca queda en blanco. |
| ¿Cómo controlan el costo de Directions? | Coarsening de coords a 110m para que sólo se refetchee cuando el driver se mueve significativamente. |
| ¿Por qué COP redondeado a $50? | Las tarifas reales en Colombia no tienen centavos. Redondeo a $50 para que se sienta natural. |
