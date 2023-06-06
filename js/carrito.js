
    const listaProductos = document.getElementById('lista-productos');
    const total = document.getElementById('total');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const comprarBtn = document.getElementById('comprar');
    const resumenCompra = document.getElementById('resumen-compra');
    const resumenTotal = document.getElementById('resumen-total');
    const resumenProductos = document.getElementById('resumen-productos');
    const confirmarCompraBtn = document.getElementById('confirmar-compra');
    const cancelarCompraBtn = document.getElementById('cancelar-compra');
    const agregarCarritoBtns = document.getElementsByClassName('agregar-carrito');
  
    let carrito = [];
  
    // RECUPERAR CARRITO DEL ALMACENAMIENTO LOCAL
    if (localStorage.getItem('carrito')) {
      carrito = JSON.parse(localStorage.getItem('carrito'));
      actualizarCarrito();
    }
  
    // AGREGAR PRODUCTO
    function agregarProducto(e) {
      const producto = e.target.parentElement;
      const nombre = producto.getAttribute('data-nombre');
      const precio = parseInt(producto.getAttribute('data-precio'));
  
      const nuevoProducto = {
        nombre: nombre,
        precio: precio
      };
  
      carrito.push(nuevoProducto);
      actualizarCarrito();
      guardarCarritoEnAlmacenamiento();
    }
  
    // ACTUALIZAR CARRITO
    function actualizarCarrito() {
      listaProductos.innerHTML = '';
      let totalCarrito = 0;
    
      carrito.forEach((producto, index) => {
        const { nombre, precio } = producto;
    
        const itemCarrito = document.createElement('li');
        itemCarrito.innerHTML = `${nombre} - $${precio}`;
        
        const botonEliminar = document.createElement('button');
        botonEliminar.innerText = 'Eliminar';
        botonEliminar.classList.add('eliminar-producto');
        botonEliminar.setAttribute('data-indice', index);
        botonEliminar.addEventListener('click', eliminarProducto);
        
        itemCarrito.appendChild(botonEliminar);
        listaProductos.appendChild(itemCarrito);
    
        totalCarrito += precio;
      });
    
      total.textContent = `Total: ${totalCarrito}`;
    }
    
    function eliminarProducto(e) {
      const indice = e.target.getAttribute('data-indice');
      carrito.splice(indice, 1);
      actualizarCarrito();
      guardarCarritoEnAlmacenamiento();
    }    
  
    // VACIAR CARRITO
    function vaciarCarrito() {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas vaciar el carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Carrito vaciado',
            text: 'El carrito ha sido vaciado.',
            icon: 'success'
          });
    
          carrito = [];
          actualizarCarrito();
          guardarCarritoEnAlmacenamiento();
        }
      });
    }
    
// COMPRAR
function comprar() {
  resumenTotal.textContent = `Total: $${total.textContent.substring(7)}`;
  resumenProductos.innerHTML = '';

  carrito.forEach((producto) => {
    const { nombre, precio } = producto;

    const itemResumen = document.createElement('p');
    itemResumen.innerHTML = `${nombre} - $${precio}`;
    resumenProductos.appendChild(itemResumen);
  });

  resumenCompra.style.display = 'block';

  confirmarCompraBtn.style.display = 'inline-block';
  cancelarCompraBtn.style.display = 'inline-block';
  
  confirmarCompraBtn.addEventListener('click', confirmarCompra);
  cancelarCompraBtn.addEventListener('click', cancelarCompra);
}


// CONFIRMAR COMPRA
function confirmarCompra() {
  const totalCompra = total.textContent.substring(7); // Obtener el total de la compra

  Swal.fire({
    title: 'Confirmar compra',
    html: `Total: $${totalCompra}<br/><br/>Confirmación de su compra en: <span id="countdown">2</span> segundos`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {

// INFORMACION DE LA COMPRA
  const resumenCompra = {
    total: totalCompra,
    productos: carrito
    };

// Enviar la información al servidor mediante AJAX
  const xhr = new XMLHttpRequest();
    xhr.open('POST', 'url_a_agregar'); 
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
// Cuenta regresiva de 1 segundo
          const countdownElement = document.getElementById('countdown');
          let countdown = 1;

          const countdownInterval = setInterval(() => {
            countdownElement.textContent = countdown;
            countdown--;

              if (countdown < 0) {
                clearInterval(countdownInterval);
                Swal.close();

                Swal.fire('¡Compra confirmada!', 'Gracias por tu compra.', 'success');
                resumenCompra.style.display = 'none';
                guardarCarritoEnAlmacenamiento();
              }
            }, 1000);
          } else {
            Swal.fire('Error', 'Ha ocurrido un error al procesar la compra.', 'error');
          }
        }
      };
    xhr.send(JSON.stringify(resumenCompra));
    }
  });
}

// CANCELAR COMPRA
  function cancelarCompra() {
    resumenCompra.style.display = 'none';
  }
  
// GUARDAR CARRITO EN EL ALMACENAMIENTO LOCAL
  function guardarCarritoEnAlmacenamiento() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
  
// EVENT LISTENERS
    for (let i = 0; i < agregarCarritoBtns.length; i++) {
      agregarCarritoBtns[i].addEventListener('click', agregarProducto);
    }
  
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    comprarBtn.addEventListener('click', comprar);
    confirmarCompraBtn.addEventListener('click', confirmarCompra);
    cancelarCompraBtn.addEventListener('click', cancelarCompra);
  