document.addEventListener('DOMContentLoaded',()=>{
  const session=NutriData.session(),user=NutriData.read('nutrivida_usuarios').find(row=>row.correo===session?.correo)
  if(!session || user?.rol!=='vendedor'){location.href='login.html';return}
  const services=document.getElementById('vendedorServicios'),orders=document.getElementById('vendedorOrdenes')
  for(const service of NutriData.services()){
    const p=document.createElement('p');p.textContent=`${service.codigo} · ${service.nombre} · ${NutriData.money(service.precio)} · Stock: ${service.stock} `
    const link=document.createElement('a');link.href=`detalle-servicio.html?id=${service.id}`;link.textContent='Ver detalle';p.append(link);services.append(p)
  }
  const saved=NutriData.read('nutrivida_ordenes');if(!saved.length)orders.textContent='No hay órdenes registradas.'
  for(const order of saved){const detail=document.createElement('details'),summary=document.createElement('summary');summary.textContent=`${order.id} · ${order.nombre} · ${order.estado} · ${NutriData.money(order.total)}`;detail.append(summary);for(const item of order.items || []){const p=document.createElement('p');p.textContent=`${item.cantidad} × ${item.titulo}: ${NutriData.money(item.precio*item.cantidad)}`;detail.append(p)}orders.append(detail)}
})
