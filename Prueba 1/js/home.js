document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.querySelector('.servicios-grid');grid.replaceChildren()
  for(const service of NutriData.services().slice(0,3)){
    const article=document.createElement('article');article.className='tarjeta-servicio'
    article.innerHTML=`<a href="detalle-servicio.html?id=${service.id}"><img src="${NutriData.escape(service.imagen)}" alt="${NutriData.escape(service.nombre)}" style="width:100%;height:180px;object-fit:cover;border-radius:8px"></a><h3>${NutriData.escape(service.nombre)}</h3><p>${NutriData.escape(service.descripcion)}</p><p>${NutriData.money(service.precio)}</p><a href="detalle-servicio.html?id=${service.id}" class="btn btn--secondary">Ver detalle</a><button class="btn btn--primary" data-add-cart="${service.id}" ${service.stock===0?'disabled':''}>Añadir al carrito</button>`
    grid.append(article)
  }
})
