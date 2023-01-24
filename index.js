//Llamando elementos del DOM
const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
const modoOscuro = document.querySelector("#switch")


let carrito = {}

//Captura de datos del api.json
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    //Cargar objetos guardados en el localStorage, si los hay.
    if(localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        crearCarrito()
    }
})

const fetchData = async () => {
    try {
        const res = await fetch("api.json")
        const data = await res.json()
        crearCards(data)
    } catch (error) {
        console.log(error);
    }  
}



//Botón Añadir al Carrito
cards.addEventListener("click", e => {
    agregarCarrito(e)
})

//Botón Sumar y Restar
items.addEventListener("click", e => {
    btnAccion(e)
})



//Creando atributos de los productos
const crearCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.title
        templateCard.querySelector("p").textContent = producto.precio
//Estableciendo el valor del atributo con .setAttribute
        templateCard.querySelector("img").setAttribute("src", producto.img)
        templateCard.querySelector(".btn-primary").dataset.id = producto.id
//Clonando los productos
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
    
}


const agregarCarrito = e => {
    if(e.target.classList.contains("btn-primary")) {
        setCarrito(e.target.parentElement)
    }
    //Deteniendo el evento con .stopPropagation
    e.stopPropagation()
}
//Capturando elementos agregados al Carrito
const setCarrito = objeto => {
    // console.log(objeto);
    const producto = {
        id: objeto.querySelector(".btn-primary").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }
//Aumentando la cantidad de un producto ya existente en el Carrito
    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
//Copiando productos con Spread {...}
    carrito[producto.id] = {...producto}
    crearCarrito()
}

const crearCarrito = () => {
    //Arranca Vacío
    items.innerHTML = ""
    Object.values(carrito).forEach(producto => {
        
        templateCarrito.querySelector("th").textContent = producto.id
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
        //Multiplicando el precio según la cantidad de productos
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    crearFooter()

    //Guardando Objetos en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

const crearFooter = () => {
    footer.innerHTML = ""
    //Cambiar el texto una vez el Carrito se vacíe
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito Vacío</th>
        `

        return
    }

    //Utilizando .reduce para sumar cantidades y precios
    const nCantidad = Object.values(carrito).reduce((acum, {cantidad}) => acum + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acum, {cantidad, precio}) => acum + cantidad * precio, 0)
   
    templateFooter.querySelectorAll("td")[0].textContent = nCantidad
    templateFooter.querySelector("span").textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    //Botón y evento Vaciar Carrito
    const btnVaciar = document.getElementById("vaciar-carrito")
    btnVaciar.addEventListener("click", () => {
        carrito = {}
        crearCarrito()
    })
}

//Constante para los botones sumar y restar
const btnAccion = e => {
    //Evento para aumentar
    if(e.target.classList.contains("btn-info")) {
        console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        crearCarrito()
    }
    //Evento para disminuir
    if(e.target.classList.contains("btn-danger")){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        //Eliminar el objeto del Carrito
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        crearCarrito()
    }

    e.stopPropagation()
}