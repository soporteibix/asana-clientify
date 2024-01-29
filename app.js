import axios from 'axios';


// Configuración de las credenciales de Asana
const asanaToken = 'TU_TOKEN_DE_ASANA';
//const asanaToken = '2/1201686013359871/1206470066282296:e7f516fd00180e1d66e81decf4daaf29';
const asanaEndpoint = 'https://app.asana.com/api/1.0';

// Configuración de las credenciales de Clientify
const clientifyToken = '529f345a1219496efc6bc6664b76cf6aeebaea3c';
//const clientifyToken = 'TU_TOKEN_DE_CLIENTIFY';
const clientifyEndpoint = 'https://api.clientify.net/v1/';

// ID del proyecto de Asana y Clientify que deseas sincronizar
const asanaProjectId = '1203021343249809'; //en este caso esta el de Afe
//const asanaProjectId = 'ID_DEL_PROYECTO_DE_ASANA'; 

const clientifyProjectId = '2042511'; //en este caso esta el de Afe
//const clientifyProjectId = 'ID_DEL_PROYECTO_DE_CLIENTIFY';

// Función para obtener tareas de Asana
async function getAsanaTasks() {
  const response = await axios.get(`${asanaEndpoint}/projects/${asanaProjectId}/tasks`, {
    headers: {
      'Authorization': `Bearer ${asanaToken}`,
    },
  });
  return response.data.data;
}

// Función para crear una nota en Clientify
async function createClientifyNote(noteName, commentText) {
  const response = await axios.post(`${clientifyEndpoint}/companies/integer/note/`, {
    name: noteName,
    comment: commentText,
  }, {
    headers: {
      'Authorization': `Token ${clientifyToken}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}

// Función principal para sincronizar tareas y comentarios
async function syncTasksAndComments() {
  try {
    // Obtener tareas de Asana
    const asanaTasks = await getAsanaTasks();

    // Iterar sobre las tareas y sincronizar con Clientify
    for (const task of asanaTasks) {
      // Sincronizar tarea como nota en Clientify
      const noteName = `Tarea de Asana: ${task.name}`;
      const commentText = `Comentario de Asana: ${task.notes}`;
      await createClientifyNote(noteName, commentText);
    }

    console.log('Sincronización exitosa.');
  } catch (error) {
    console.error('Error al sincronizar:', error.message);
  }
}

// Ejecutar la sincronización
syncTasksAndComments();
