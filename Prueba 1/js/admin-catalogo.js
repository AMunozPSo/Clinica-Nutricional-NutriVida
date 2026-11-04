document.addEventListener('DOMContentLoaded',()=>{
  if(!NutriData.admin()){location.href='login.html';return}
  const form=document.getElementById('servicioForm'), editor=document.getElementById('editorServicio'), notice=document.getElementById('servicioMensaje')
  let editing=null
  const fields=[['codigo','Código del servicio','text'],['nombre','Nombre del servicio','text'],['doctor','Especialista a cargo','text'],['precio','Precio','number'],['stock','Stock disponible','number'],['stockCritico','Stock crítico (opcional)','number'],['imagen','Imagen (opcional)','text'],['duracion','Duración (minutos)','number']]
  form.innerHTML=fields.map(([key,label,type])=>`<div class="form__field"><label for="cs-${key}">${label}</label><input id="cs-${key}" name="${key}" type="${type}" ${type==='number'?`min="0" step="${key==='precio'?'any':'1'}"`:''} ${key==='nombre'?'maxlength="100"':key==='codigo'?'minlength="3"':''}><span id="cs-error-${key}" class="form__error"></span></div>`).join('')+
    `<div class="form__field"><label for="cs-categoria">Categoría</label><select id="cs-categoria" name="categoria"><option value="">Selecciona una categoría</option><option value="evaluaciones">Evaluaciones / Consultas</option><option value="planes">Planes Especializados</option><option value="talleres">Talleres Grupales</option></select><span id="cs-error-categoria" class="form__error"></span></div>
    <div class="form__field"><label for="cs-modalidad">Modalidad</label><select id="cs-modalidad" name="modalidad"><option>Presencial</option><option>Online</option></select></div>
    <div class="form__field"><label for="cs-descripcion">Descripción (opcional)</label><textarea id="cs-descripcion" name="descripcion" maxlength="500"></textarea><span id="cs-error-descripcion" class="form__error"></span></div>
    <button type="submit" class="btn btn--primary">Guardar servicio</button><button type="button" id="cancelarServicio" class="btn btn--secondary">Cancelar</button>`
  const reset=()=>{editing=null;form.reset();form.elements.duracion.value=45;editor.hidden=false;notice.textContent=''}
  document.getElementById('nuevoServicio').onclick=reset
  document.getElementById('cancelarServicio').onclick=()=>{editor.hidden=true}
  function validate(){
    const values=Object.fromEntries(new FormData(form));values.id=editing
    const errors=NutriRules.validateService(values,NutriData.services())
    if(values.duracion && (!Number.isInteger(Number(values.duracion)) || Number(values.duracion)<1))errors.duracion='La duración debe ser un entero positivo.'
    if(values.imagen && !/^(https?:\/\/|img\/)/i.test(values.imagen))errors.imagen='Usa una URL http(s) o una ruta img/.'
    for(const [key] of [...fields,['categoria'],['descripcion']]){const node=document.getElementById(`cs-error-${key}`);node.textContent=errors[key] || '';node.style.display='block'}
    return {values,errors}
  }
  form.addEventListener('input',()=>{if(form.dataset.submitted)validate()})
  form.addEventListener('submit',event=>{
    event.preventDefault();form.dataset.submitted='true';if(!NutriData.admin())return
    const {values,errors}=validate();if(Object.keys(errors).length)return
    const rows=NutriData.services();const saved={...values,id:editing ?? Math.max(0,...rows.map(row=>Number(row.id)||0))+1,precio:Number(values.precio),stock:Number(values.stock),stockCritico:values.stockCritico===''?'':Number(values.stockCritico),duracion:Number(values.duracion)||45,imagen:values.imagen || 'img/consulta.jpg'}
    try {NutriData.saveServices(editing===null?[...rows,saved]:rows.map(row=>row.id===editing?saved:row));editor.hidden=true;notice.textContent='Servicio guardado correctamente.';render()}catch(error){notice.textContent=error.message}
  })
  function render(){
    const body=document.getElementById('servicioFilas');body.replaceChildren()
    for(const service of NutriData.services()){
      const tr=document.createElement('tr')
      for(const text of [service.codigo,service.nombre,NutriData.money(service.precio),`${service.stock}${service.stockCritico!=='' && service.stock<=service.stockCritico?' · Stock crítico':''}`,service.categoria]){const td=document.createElement('td');td.textContent=text;tr.append(td)}
      const td=document.createElement('td'),edit=document.createElement('button'),remove=document.createElement('button');edit.textContent='Editar';edit.className='btn btn--secondary';remove.textContent='Eliminar';remove.className='btn btn--primary'
      edit.onclick=()=>{reset();editing=service.id;for(const [key,value] of Object.entries(service))if(form.elements[key])form.elements[key].value=value}
      remove.onclick=()=>{if(confirm(`¿Eliminar ${service.nombre}?`)){try{NutriData.saveServices(NutriData.services().filter(row=>row.id!==service.id));render()}catch(error){notice.textContent=error.message}}}
      td.append(edit,remove);tr.append(td);body.append(tr)
    }
  }
  document.getElementById('btnCerrarSesionAdmin')?.addEventListener('click',event=>{event.preventDefault();localStorage.removeItem('nutrivida_sesion');location.href='login.html'})
  render()
})
