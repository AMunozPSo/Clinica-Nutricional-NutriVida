const form = document.getElementById('registroForm')
const keys = {nombre:'nombreInput',apellidos:'apellidosInput',fechaNacimiento:'fechaNacimientoInput',run:'runInput',telefono:'telefonoInput',correo:'correoInput',password:'passInput',confirmPassword:'passConfirmInput',direccion:'direccionInput',region:'regionSelect',comuna:'comunaSelect'}
const inputs = Object.fromEntries(Object.entries(keys).map(([key,id]) => [key,document.getElementById(id)]))
const region = inputs.region
const comuna = inputs.comuna
for (const name of Object.keys(NutriRules.LOCATIONS)) region.add(new Option(name,name))
region.addEventListener('change', () => {
  comuna.replaceChildren(new Option('Seleccione una comuna...',''))
  for (const name of NutriRules.LOCATIONS[region.value] || []) comuna.add(new Option(name,name))
  comuna.disabled = !region.value
})
function validate() {
  const values = Object.fromEntries(Object.entries(inputs).map(([key,input]) => [key,input.value]))
  const errors = NutriRules.validateUser(values,NutriData.read('nutrivida_usuarios'))
  for (const [key,input] of Object.entries(inputs)) {
    let error = document.getElementById(`${input.id}-error`)
    if (!error) { error=document.createElement('span'); error.id=`${input.id}-error`;error.className='form__error';input.after(error) }
    error.textContent = errors[key] || '';error.style.display=errors[key] ? 'block':'none'
    input.setAttribute('aria-describedby',error.id);input.setAttribute('aria-invalid',String(!!errors[key]))
  }
  return {values,errors}
}
form.noValidate = true
let submitted = false
form.addEventListener('input', () => { if(submitted) validate() })
form.addEventListener('submit',event => {
  event.preventDefault();submitted=true
  const {values,errors}=validate()
  if(Object.keys(errors).length) return
  delete values.confirmPassword
  values.correo=values.correo.trim().toLowerCase(); values.run=values.run.trim().toUpperCase();values.rol='paciente';values.esAdmin=false
  try {
    localStorage.setItem('nutrivida_usuarios',JSON.stringify([...NutriData.read('nutrivida_usuarios'),values]))
    const success=document.getElementById('mensajeExito');success.textContent='¡Registro exitoso! Redirigiendo a inicio de sesión...';success.style.display='block'
    setTimeout(() => {window.location.href='login.html'},1000)
  } catch { const success=document.getElementById('mensajeExito');success.textContent='No se pudo guardar el registro. Revisa el almacenamiento del navegador.';success.style.display='block' }
})
