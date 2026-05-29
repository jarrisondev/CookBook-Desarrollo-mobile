# Firestore índices requeridos

Firebase pedirá crearlos automáticamente la primera vez que se ejecute cada query. Si quieres crearlos a mano, son:

## Solicitudes abiertas (driver)
- Collection: `rides`
- Where: `status == "searching"`
- Order by: `createdAt` desc

## Ride activo del driver
- Collection: `rides`
- Where: `driverId == <uid>`, `status in ["accepted", "arrived", "inProgress"]`

## Historial del rider
- Collection: `rides`
- Where: `riderId == <uid>`, `status in ["completed", "cancelled"]`
- Order by: `createdAt` desc

## Historial del driver
- Collection: `rides`
- Where: `driverId == <uid>`, `status in ["completed", "cancelled"]`
- Order by: `createdAt` desc

Cuando una query requiera un índice compuesto, Firebase mostrará un link en los logs del cliente. Tócalo y se crea solo.
