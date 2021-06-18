(function() {

    
    let idCliente;
    
   
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const empresaInput = document.querySelector('#empresa');
    const telefonoInput = document.querySelector('#telefono');

    document.addEventListener('DOMContentLoaded', () => {


        conectarDB();

        //actualiza el cliente
        formulario.addEventListener('submit', actualizarCliente);


        // Verificar si el cliente existe
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        // console.log(idCliente);
        if(idCliente) {
   
            setTimeout( () => {//se usa el timeout para darle tiempo a conectarse a la base de datos,
                //se soluciona con conexion asincrona q lo veremos despues
                obtenerCliente(idCliente);
            }, 1000);
        }

    });


    


    function obtenerCliente(id) {
  
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        // console.log(objectStore);

        var request = objectStore.openCursor();
        request.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                if(cursor.value.id  == Number(id) ) {
                    // pasar el que estamos editando...
                    llenarFormulario(cursor.value);
                    console.log(cursor.value);
                }
                cursor.continue();          
            }
        };

    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, empresa, telefono } = datosCliente;
         nombreInput.value = nombre;
         emailInput.value = email;
         empresaInput.value = empresa;
         telefonoInput.value = telefono;
    }

    function actualizarCliente(e) {
        e.preventDefault();

        if( nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === '' ) {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // actualizar cliente...
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number( idCliente )
        };

        console.log(clienteActualizado);


        // actualizar...
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = () => {
            imprimirAlerta('Editado Correctamente');

            setTimeout(() => {
                console.log('editado correctamente')
                window.location.href = 'index.html';
            }, 3000);
        };

        transaction.onerror = (error) => {
            console.log(error);
            console.log('Hubo un errorr.');
            imprimirAlerta('hubo un error', 'error')
        };
    }


    

    

})();