window.NutriCart = (()=>{
  const key=()=>`nutrivida_compra_${NutriData.session()?.correo || 'invitado'}`
  const rows=()=>NutriData.read(key())
  function set(id,quantity){
    const service=NutriData.services().find(row=>String(row.id)===String(id))
    if(!Number.isInteger(quantity)||quantity<0||quantity>10)throw new Error('La cantidad debe estar entre 0 y 10.')
    if(quantity && (!service || quantity>service.stock))throw new Error('La cantidad supera el stock disponible.')
    const next=rows().filter(row=>String(row.id)!==String(id));if(quantity)next.push({id,cantidad:quantity})
    localStorage.setItem(key(),JSON.stringify(next));render()
  }
  function add(id){set(id,(rows().find(row=>String(row.id)===String(id))?.cantidad || 0)+1)}
  function render(){
    const count=rows().reduce((sum,row)=>sum+row.cantidad,0)
    for(const node of document.querySelectorAll('[data-cart-count]'))node.textContent=`Carrito (${count})`
    const target=document.getElementById('carritoContenido');if(!target)return
    target.replaceChildren();let total=0
    for(const row of rows()){
      const service=NutriData.services().find(item=>String(item.id)===String(row.id));const article=document.createElement('article');article.className='card'
      const heading=document.createElement('h2');heading.textContent=service?.nombre || 'Servicio ya no disponible';article.append(heading)
      if(service){const p=document.createElement('p');p.textContent=`${NutriData.money(service.precio)} por unidad · Stock: ${service.stock}`;article.append(p);total+=service.precio*row.cantidad}
      const label=document.createElement('label');label.textContent='Cantidad ';const input=document.createElement('input');input.type='number';input.min='1';input.max=String(Math.min(10,service?.stock || 10));input.value=row.cantidad;label.append(input);article.append(label)
      const error=document.createElement('p');error.setAttribute('role','alert');input.onchange=()=>{try{set(row.id,Number(input.value))}catch(e){error.textContent=e.message}}
      const remove=document.createElement('button');remove.textContent='Quitar';remove.className='btn btn--secondary';remove.onclick=()=>set(row.id,0);article.append(remove,error);target.append(article)
    }
    const summary=document.createElement('p');summary.textContent=count?`Total: ${NutriData.money(total)}`:'Tu carrito está vacío.';target.append(summary)
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const nav=document.getElementById('navMenu');if(nav && !nav.querySelector('[data-cart-count]')){const link=document.createElement('a');link.href='carrito.html';link.className='navbar__link';link.dataset.cartCount='';nav.append(link)}
    render()
  })
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-add-cart]');if(!button)return
    let notice=button.parentElement.querySelector('[data-cart-message]');if(!notice){notice=document.createElement('p');notice.dataset.cartMessage='';notice.setAttribute('role','status');button.after(notice)}
    try{add(button.dataset.addCart);notice.textContent='Servicio agregado al carrito.'}catch(e){notice.textContent=e.message}
  })
  window.addEventListener('storage',render)
  return {rows,set,add,render}
})()
