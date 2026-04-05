# Integración de Video Llamadas con Zego

## 📋 Descripción

Este módulo integra video llamadas en tiempo real usando **ZegoCloud UIKit**. Te permite hacer llamadas de video conferencia con múltiples participantes desde tu aplicación.

## 🔧 Configuración

### 1. Obtener Credenciales de Zego

1. Ve a [https://zegocloud.com](https://zegocloud.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. En el dashboard, copia:
   - **APP ID**
   - **SERVER SECRET**

### 2. Configurar Credenciales

Abre el archivo `src/features/chat-videocall/components/zego-config.js` y reemplaza:

```javascript
export const ZEGO_CONFIG = {
    APP_ID: 1784682065, // ← Reemplaza con tu APP ID
    SERVER_SECRET: '791007b5b0461a7ff37d15c671086e0e', // ← Reemplaza con tu SERVER SECRET
    // ... resto de la configuración
};
```

## 🚀 Como Usar

### Acceder a Video Llamadas

1. En el dashboard, haz clic en **"Video Llamada"** en la barra lateral
2. Se abrirá la interfaz de video llamadas
3. El sistema generará automáticamente un **Room ID** único
4. Puedes compartir el enlace con otros usuarios para que se unan

### Funcionalidades Disponibles

- ✅ Video conferencia en tiempo real
- ✅ Micrófono y cámara (activación/desactivación)
- ✅ Chat de texto en vivo
- ✅ Lista de usuarios conectados
- ✅ Compartir pantalla
- ✅ Configuración de audio/video avanzada
- ✅ Generación de enlaces compartibles

## 📝 Estructura de Archivos

```
src/features/chat-videocall/
├── VideoCallPage.jsx          # Componente principal de video llamadas
├── index.ts                   # Exportaciones
├── components/
│   ├── zego-config.js        # Configuración de Zego
│   ├── index.js              # Scripts adicionales
│   ├── chat.js               # Chat funcionalidades
│   └── ...
└── css/
    └── chat.css              # Estilos
```

## 🔐 Seguridad

> **⚠️ IMPORTANTE**: Las credenciales del servidor (SERVER_SECRET) nunca deben ser expuestas en el código frontend en producción.
> 
> Para aplicaciones de producción:
> 1. Mantén el SERVER_SECRET en el backend
> 2. Crea un endpoint en tu servidor que genere tokens
> 3. El cliente debe obtener tokens del servidor, no generarlos localmente

### Generación de Tokens Seguros (Backend)

```javascript
// En tu servidor Node.js/Express
const ZegoServerAssistant = require('./zego-server-assistant');

app.post('/api/video-token', (req, res) => {
    const { userId, userName, roomId } = req.body;
    const token = ZegoServerAssistant.generateToken(
        ZEGO_APP_ID,
        ZEGO_SERVER_SECRET,
        roomId,
        userId,
        userName
    );
    res.json({ token });
});
```

## 🎮 Opciones de Configuración

En `zego-config.js` puedes personalizar:

- **VIDEO**: Calidad, ancho de banda, FPS
- **AUDIO**: Bitrate, canales
- **CHAT**: Duración de retención de mensajes, límite de longitud
- **maxUsers**: Número máximo de participantes (actualmente 2)

## 🐛 Solución de Problemas

### "El componente de video no aparece"
- Verifica que el APP_ID y SERVER_SECRET sean correctos
- Comprueba la consola del navegador para errores

### "No puedo conectarme"
- Asegúrate de tener permisos de cámara/micrófono activados
- Verifica tu conexión a Internet
- Comprueba el Room ID correcto

### "Error de autenticación"
- Verifica que las credenciales de Zego sean válidas
- Comprueba que tu proyecto esté activo en Zego

## 📚 Documentación Adicional

- [Documentación de Zego](https://docs.zegocloud.com/article/18849)
- [Prebuilt SDK React](https://zegocloud.com/prebuilt-uikit)
- [API Reference](https://docs.zegocloud.com/reference)

## 💡 Próximos Pasos

1. ✅ Integración completada
2. 📞 Agregar manejo de llamadas salientes
3. 📞 Agregar notificaciones de llamadas entrantes
4. 📊 Agregar historial de llamadas
5. 🔐 Implementar generación de tokens en backend

---

**Estado**: ✅ Listo para usar
**Última actualización**: Abril 2026
