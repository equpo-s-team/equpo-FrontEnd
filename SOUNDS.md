# Sonidos en Equpo FrontEnd

## Sonidos Disponibles

### Efectos de misiones

- `task-created.mp3` - Se reproduce al crear una nueva misión
- `task-updated.mp3` - Se reproduce al modificar una misión existente
- `task-completed.mp3` - Se reproduce al mover una misión a "Completada"
- `task-deleted.mp3` - Se reproduce al eliminar una misión

### Efectos de Chat

- `message-sent.mp3` - Se reproduce al enviar un mensaje
- `message-received.mp3` - Se reproduce al recibir un mensaje

### Notificaciones

- `ring_tone.mp3` - Para llamadas y alertas

### Música de Fondo

- `guitar-melody-1.mp3`
- `guitar-melody-2.mp3`
- `guitar-melody-3.mp3`

## Ubicación

Todos los archivos de sonido están en:

```
public/sounds/
```

## Cómo Agregar Nuevos Sonidos

1. **Coloca el archivo MP3** en la carpeta `public/sounds/`
2. **Usa un nombre descriptivo** (ej: `notification-success.mp3`)
3. **Agrega el sonido al hook** en `src/hooks/useSoundEffects.ts`:

```javascript
const sounds = {
  // ...sonidos existentes
  notificationSuccess: '/sounds/notification-success.mp3',
};
```

4. **Usa el sonido** en tu componente:

```javascript
const { play } = useSoundEffects();
play('notificationSuccess');
```

## Cómo Reemplazar Sonidos

1. **Reemplaza el archivo MP3** en `public/sounds/` manteniendo el mismo nombre
2. **Los efectos se actualizan automáticamente** (no necesitas cambiar código)

## Formatos Recomendados

- **Formato**: MP3
- **Duración**: 1-3 segundos para efectos
- **Calidad**: 128kbps (balance tamaño/calidad)
- **Volumen**: Normalizado para evitar sorpresas

## Notas

- Los efectos de sonido funcionan incluso si la música está muteada
- El volumen de los efectos es 20% más alto que el de la música
- Los archivos deben estar en formato MP3 para compatibilidad máxima
