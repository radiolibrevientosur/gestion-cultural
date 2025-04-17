const handleDownloadImage = async () => {
  if (!cardRef.current) {
    console.error('Referencia a la tarjeta no encontrada.');
    alert('No se pudo encontrar la tarjeta para generar la imagen.');
    return;
  }

  try {
    // Generar la imagen desde el DOM
    const dataUrl = await toPng(cardRef.current, {
      quality: 1.0,
      pixelRatio: 2, // Aumentar resolución de la imagen
    });

    // Crear un enlace dinámico para descargar la imagen
    const link = document.createElement('a');
    link.download = `${event.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error al generar la imagen:', error);
    alert('Hubo un problema al generar la imagen. Por favor, inténtalo de nuevo.');
  }
};
