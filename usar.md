---
layout: default
title: "Usar el theme"
kicker: "INSTALACIÓN · 2 LÍNEAS"
permalink: /usar/
---

# Usar el theme

En el `_config.yml` de tu sitio de GitHub Pages:

```yaml
remote_theme: yaeleureka-afk/teotech-theme
plugins:
  - jekyll-remote-theme
teotech:
  handle: tu-usuario/tu-curso
  tutor: true        # false para apagar el tutor
  footer: "Tu pie de página"
  dock:
    - {label: "INICIO", icon: "⌂", url: "/"}
    - {label: "CLASES", icon: "≡", url: "/clases/"}
```

## Layouts
- `home`: portada con `headline`, `lede` y `cycle`.
- `clase`: clase con `modulo`, `sesion`, `grabacion`, `pdf`, `resumen`.
- `default`: cualquier página.

Apaga el tutor en una página con `tutor: false`.

## Requisitos del tutor
WebGPU: Chrome reciente en Android o computadora, Safari 26 en iPhone. ~1 GB de memoria libre. Sin WebGPU, la página funciona igual y el tutor lo explica.

## Ticker
```yaml
ticker:
  - {countdown: "2@19:00", label: "PRÓXIMA CLASE"}   # día (0=domingo) @ hora, zona del sitio
  - "Texto que corre"
```

## Sección plegable
```html
<details class="fold" id="ruta">
<summary><span class="n">01</span><span class="t">Título<small>subtítulo</small></span><span class="pm"></span></summary>
<div class="in-fold" markdown="1">
Contenido en **markdown**.
</div>
</details>
```
Colores: añade `b`, `g` o `k` a la clase. Con `data-solo` solo una queda abierta. Un botón con `data-fold-all` pliega o despliega todo.
