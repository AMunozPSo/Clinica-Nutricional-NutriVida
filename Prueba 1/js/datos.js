window.NutriData = (() => {
  const read = (key, fallback = []) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]))
  const services = () => {
    const key = 'nutrivida_servicios'
    if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify([
      {id:1,codigo:'NV-001',nombre:'Evaluación Nutricional',doctor:'Camila Rojas',categoria:'evaluaciones',precio:25000,descripcion:'Evaluación y orientación nutricional personalizada.',imagen:'img/consulta.jpg',stock:20,stockCritico:3,duracion:45,modalidad:'Presencial'},
      {id:2,codigo:'NV-002',nombre:'Nutrición Deportiva',doctor:'Ignacio Fuentes',categoria:'planes',precio:35000,descripcion:'Plan de alimentación para acompañar tu entrenamiento.',imagen:'img/talleres.jpg',stock:20,stockCritico:3,duracion:45,modalidad:'Online'},
      {id:3,codigo:'NV-003',nombre:'Taller de hábitos saludables',doctor:'Camila Rojas',categoria:'talleres',precio:20000,descripcion:'Aprende a construir hábitos de alimentación.',imagen:'img/recepcion.jpg',stock:5,stockCritico:5,duracion:60,modalidad:'Presencial'},
    ]))
    return read(key).map(item => ({...item,codigo:item.codigo || `NV-${item.id}`,stock:item.stock ?? 20,stockCritico:item.stockCritico ?? '',imagen:item.imagen || 'img/consulta.jpg'}))
  }
  const session = () => read('nutrivida_sesion', null)
  const admin = () => { const current = session(); return !!current && (NutriRules.BASE_EMAILS.includes(current.correo) || read('nutrivida_usuarios').some(user => user.correo === current.correo && user.rol === 'admin')) }
  const money = value => new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:2}).format(Number(value) || 0)
  const saveServices = rows => { if (!admin()) throw new Error('Acceso exclusivo para administradores.'); localStorage.setItem('nutrivida_servicios',JSON.stringify(rows)) }
  return {read,escape,services,session,admin,money,saveServices}
})()
NutriData.services()
