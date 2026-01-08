// actualizado: envía leads al endpoint /api/leads además de preparar link de WhatsApp
document.addEventListener('DOMContentLoaded', function(){
  const preciosSugeridos = {
    construccion: 250000,
    concreto: 200000,
    metalica: 180000,
    remodelacion: 150000,
    acabados: 120000,
    cubiertas: 110000,
    mantenimiento: 80000,
    apu: 100000,
    supervision: 90000
  };

  const empresaNumber = '573208967267';

  // elementos de la calculadora
  const servicioSelect = document.getElementById('servicio');
  const precioInput = document.getElementById('precio');
  const areaInput = document.getElementById('area');
  const calcularBtn = document.getElementById('calcularBtn');
  const resultadoSec = document.getElementById('resultado');
  const resumen = document.getElementById('resumen');
  const valorSpan = document.getElementById('valor');
  const enviarWhats = document.getElementById('enviarWhats');
  const solicitarAsesor = document.getElementById('solicitarAsesor');
  const resetBtn = document.getElementById('resetBtn');

  // Valores por servicio al cambiar select
  if(servicioSelect && precioInput){
    const urlParams = new URLSearchParams(window.location.search);
    const servicioParam = urlParams.get('servicio');
    if(servicioParam){
      servicioSelect.value = servicioParam;
    }
    const setPrecioPorServicio = () => {
      const s = servicioSelect.value || 'construccion';
      if(!precioInput.value) precioInput.value = preciosSugeridos[s] || 100000;
    };
    servicioSelect.addEventListener('change', setPrecioPorServicio);
    setPrecioPorServicio();
  }

  if(calcularBtn){
    calcularBtn.addEventListener('click', async () => {
      const servicio = servicioSelect.value;
      const area = Number(areaInput.value) || 0;
      const precio = Number(precioInput.value) || (preciosSugeridos[servicio] || 100000);
      if(area <= 0){
        alert('Ingresa un área válida (m²).');
        return;
      }
      const valor = Math.round(area * precio);
      resumen.textContent = `Servicio: ${servicio.replace(/^[a-z]/, c => c.toUpperCase())}. Área: ${area} m². Ciudad: ${document.getElementById('ciudad').value || 'No indicada'}.`;
      valorSpan.textContent = new Intl.NumberFormat('es-CO').format(valor);
      resultadoSec.style.display = 'block';

      // Preparar link de WhatsApp
      const nombre = document.getElementById('nombre').value || '';
      const telefono = document.getElementById('telefono').value || '';
      const ciudad = document.getElementById('ciudad').value || '-';
      const mensaje = encodeURIComponent(
        `Hola, solicito cotización preliminar:\nServicio: ${servicio}\nÁrea: ${area} m²\nValor estimado: ${new Intl.NumberFormat('es-CO').format(valor)} COP\nCiudad: ${ciudad}\nNombre: ${nombre}\nTeléfono: ${telefono}`
      );
      enviarWhats.href = `https://wa.me/${empresaNumber}?text=${mensaje}`;

      // Enviar lead al endpoint (configurable)
      try {
        const payload = {
          source: 'cotizacion_web',
          servicio,
          area_m2: area,
          estimated_value: valor,
          city: ciudad,
          contactName: nombre,
          contactPhone: telefono,
          contactEmail: document.getElementById('correo') ? document.getElementById('correo').value : ''
        };
        // Ajusta la URL si la API está en otro dominio (ej: https://api.tusitio.com/api/leads)
        const API_URL = window.__API_URL__ || '/api/leads';
        const resp = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          // opcional: mostrar confirmación en UI o enviar eventos de analytics
          console.log('Lead enviado al backend');
        } else {
          console.warn('Error al enviar lead al backend', await resp.text());
        }
      } catch (err) {
        console.warn('No se pudo enviar lead al backend', err);
      }
    });
  }

  if(solicitarAsesor){
    solicitarAsesor.addEventListener('click', () => {
      alert('Gracias. Un asesor se pondrá en contacto contigo en menos de 24 horas.');
    });
  }

  if(resetBtn){
    resetBtn.addEventListener('click', () => {
      const form = document.getElementById('cotizacionForm');
      if(form) form.reset();
      resultadoSec.style.display = 'none';
      const ev = new Event('change');
      if(servicioSelect) servicioSelect.dispatchEvent(ev);
    });
  }

  // Contact form (ahora envía lead al backend)
  const contactSend = document.getElementById('contactSend');
  if(contactSend){
    contactSend.addEventListener('click', async () => {
      const nombre = document.getElementById('c_nombre').value || '';
      const correo = document.getElementById('c_email').value || '';
      const telefono = document.getElementById('c_telefono').value || '';
      const mensaje = document.getElementById('c_mensaje').value || '';
      const payload = {
        source: 'contacto_web',
        contactName: nombre,
        contactPhone: telefono,
        contactEmail: correo,
        message: mensaje
      };
      try {
        const API_URL = window.__API_URL__ || '/api/leads';
        const resp = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          alert('Gracias — recibimos tu mensaje. Te contactaremos pronto.');
          document.getElementById('contactForm').reset();
        } else {
          alert('Tu mensaje fue enviado, pero hubo un inconveniente en el backend. Intentaremos de todas formas responderte.');
        }
      } catch (err) {
        console.warn(err);
        alert('Error enviando el formulario. Por favor contacta por WhatsApp.');
      }
    });
  }

  // Asistente (placeholder)
  const abrirAsistente = document.getElementById('abrirAsistente');
  if(abrirAsistente){
    abrirAsistente.addEventListener('click', () => {
      alert('Asistente virtual: En producción, aquí se abriría el chat (ChatGPT/Dialogflow/Rasa).');
    });
  }
});