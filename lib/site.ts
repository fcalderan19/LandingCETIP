export const site = {
  name: "CETIP",
  fullName: "CETIP — Centro Educativo Terapéutico",
  tagline: "Acompañamos cada trayectoria con un equipo interdisciplinario.",
  description:
    "Centro Educativo Terapéutico con equipo interdisciplinario. Atendemos niños, adolescentes y adultos con enfoque cálido, profesional e inclusivo.",
  address: "Av. Siempreviva 1234, CABA, Argentina",
  phoneDisplay: "(011) 4444-5555",
  phoneTel: "+541144445555",
  whatsappNumber: "5491100000000",
  whatsappMessage: "Hola CETIP, quisiera hacer una consulta.",
  email: "contacto@cetip.com.ar",
  hours: "Lun a Vie 8:00–19:00 · Sáb 9:00–13:00",
  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/"
  },
  mapsEmbed:
    "https://www.google.com/maps?q=Av.%20Siempreviva%201234%20CABA&output=embed"
};

export const waLink = (text = site.whatsappMessage) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
