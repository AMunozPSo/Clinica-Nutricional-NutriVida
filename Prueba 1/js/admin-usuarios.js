document.addEventListener('DOMContentLoaded', () => {
  if (!NutriData.admin()) { location.href='login.html';return }
  const session=NutriData.session()
  const form=document.getElementById('formNuevoPaciente')
  const fields=[['nombre','Nombre',50],['apellidos','Apellidos',100],['run','RUN sin puntos ni guion',9],['correo','Correo electrónico',100],['password','Contraseña temporal',10],['direccion','Dirección',300],['telefono','Teléfono (opcional)',9],['fechaNacimiento','Fecha de nacimiento (opcional)',undefined]]
  form.noValidate=true
  form.innerHTML=fields.map(([key,label,max]) => `<div class="form__field"><label for="np-${key}">${label}</label><input id="np-${key}" name="${key}" type="${key==='password'?'password':key==='correo'?'email':key==='fechaNacimiento'?'date':'text'}" ${max ? `maxlength="${max}"` : ''} ${['telefono','fechaNacimiento'].includes(key)?'':'required'} autocomplete="${key==='password'?'new-password':key==='correo'?'email':key==='nombre'?'given-name':key==='apellidos'?'family-name':key==='direccion'?'street-address':'off'}"><span class="form__error" id="np-error-${key}"></span></div>`).join('') +
    `<div class="form__field"><label for="np-region">Región</label><select id="np-region" name="region"><option value="">Selecciona una región</option>${Object.keys(NutriRules.LOCATIONS).map(name=>`<option>${name}</option>`).join('')}</select><span class="form__error" id="np-error-region"></span></div>
    <div class="form__field"><label for="np-comuna">Comuna</label><select id="np-comuna" name="comuna" disabled><option value="">Selecciona una comuna</option></select><span class="form__error" id="np-error-comuna"></span></div>
    <div class="form__field"><label for="np-rol">Tipo de usuario</label><select id="np-rol" name="rol"><option value="paciente">Cliente / Paciente</option><option value="vendedor">Vendedor</option><option value="medico">Médico Especialista</option>${NutriRules.BASE_EMAILS.includes(session.correo)?'<option value="admin">Administrador</option>':''}</select></div>
    <p id="np-error" role="alert"></p><div><button class="btn btn--primary" type="submit">Guardar usuario</button><button class="btn btn--secondary" type="button" onclick="toggleFormNuevoPaciente()">Cancelar</button></div>`
  form.elements.password.value='paciente12'
  const changeRegion=() => {const select=form.elements.comuna;select.replaceChildren(new Option('Selecciona una comuna',''));for(const name of NutriRules.LOCATIONS[form.elements.region.value] || []) select.add(new Option(name,name));select.disabled=!form.elements.region.value}
  form.elements.region.addEventListener('change',changeRegion)
  let editing=null
  const validate=() => {
    const values=Object.fromEntries(new FormData(form));if(editing) values.correo=editing
    const errors=NutriRules.validateUser(values,NutriData.read('nutrivida_usuarios'),editing || '')
    for(const key of Object.keys(values)){const node=document.getElementById(`np-error-${key}`);if(node){node.textContent=errors[key] || '';node.style.display='block'}}
    return {values,errors}
  }
  form.addEventListener('input',()=>{if(form.dataset.submitted)validate()})
  form.addEventListener('submit',event=>{
    event.preventDefault();form.dataset.submitted='true'
    if(!NutriData.admin()) return
    const {values,errors}=validate();if(Object.keys(errors).length)return
    if(values.rol==='admin' && !NutriRules.BASE_EMAILS.includes(session.correo)) return
    const users=NutriData.read('nutrivida_usuarios')
    const user={...values,nombre:values.nombre.trim(),apellidos:values.apellidos.trim(),correo:values.correo.trim().toLowerCase(),run:values.run.toUpperCase(),esAdmin:values.rol==='admin'}
    try {
      localStorage.setItem('nutrivida_usuarios',JSON.stringify(editing ? users.map(row=>row.correo===editing?user:row) : [...users,user]))
      form.reset();form.elements.correo.disabled=false;form.elements.password.value='paciente12';editing=null;form.dataset.submitted='';changeRegion();toggleFormNuevoPaciente();render()
    } catch {document.getElementById('np-error').textContent='No se pudo guardar el usuario.'}
  })
  window.toggleFormNuevoPaciente=() => {const container=document.getElementById('contenedorNuevoPaciente');container.style.display=container.style.display==='none'?'block':'none'}
  const protectedUser=user=>NutriRules.BASE_EMAILS.includes(user.correo) || user.correo===session.correo || (user.rol==='admin' && !NutriRules.BASE_EMAILS.includes(session.correo))
  function render(){
    const body=document.getElementById('tablaUsuariosBody');body.replaceChildren()
    for(const user of NutriData.read('nutrivida_usuarios')){
      const tr=document.createElement('tr')
      for(const text of [`${user.nombre || ''} ${user.apellidos || ''} (${user.run || 'Sin RUN'})`,user.correo,{admin:'Administrador',medico:'Médico Especialista',vendedor:'Vendedor',paciente:'Cliente / Paciente'}[user.rol] || 'Cliente / Paciente',String(NutriData.read('nutrivida_citas').filter(row=>row.pacienteCorreo===user.correo).length)]){const td=document.createElement('td');td.textContent=text;tr.append(td)}
      const actions=document.createElement('td')
      if(protectedUser(user))actions.textContent='Cuenta protegida'
      else {
        const edit=document.createElement('button');edit.textContent='Editar';edit.className='btn btn--secondary';edit.onclick=()=>{
          editing=user.correo
          for(const key of [...fields.map(([key])=>key),'rol','region'])form.elements[key].value=user[key] || ''
          changeRegion();form.elements.comuna.value=user.comuna || '';form.elements.correo.disabled=true
          document.getElementById('contenedorNuevoPaciente').style.display='block'
        }
        const remove=document.createElement('button');remove.textContent='Eliminar';remove.className='btn btn--primary';remove.onclick=()=>{
          if(NutriData.admin() && !protectedUser(user) && confirm(`¿Eliminar a ${user.nombre}?`)){localStorage.setItem('nutrivida_usuarios',JSON.stringify(NutriData.read('nutrivida_usuarios').filter(row=>row.correo!==user.correo)));render()}
        };actions.append(edit,remove)
      }
      tr.append(actions);body.append(tr)
    }
  }
  document.getElementById('btnCerrarSesionAdmin')?.addEventListener('click',event=>{event.preventDefault();localStorage.removeItem('nutrivida_sesion');location.href='login.html'})
  render()
})
