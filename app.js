const Asana = require('asana');
const axios = require('axios');

// Configuración de Asana
const asanaAccessToken = '<YOUR_ASANA_ACCESS_TOKEN>';
let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = asanaAccessToken;

// Configuración de Clientify
const clientifyApiKey = '<YOUR_CLIENTIFY_API_KEY>';
const companyId = 123; // Reemplaza esto con el ID de la empresa específica en Clientify
const clientifyApiUrl = `https://api.clientify.net/v1/companies/${companyId}/note/`;

// Obtener detalles de una tarea en Asana
const tasksApiInstance = new Asana.TasksApi();
const taskGid = "321654"; // Reemplaza esto con el GID de la tarea específica en Asana
const asanaOpts = {
  'opt_fields': "name,assignee,due_on,completed,completed_at,notes"
};

tasksApiInstance.getTask(taskGid, asanaOpts)
  .then((result) => {
    const taskDetails = result.data;

    // Crear nota en Clientify con detalles de la tarea
    const noteData = {
      name: `Asana Task: ${taskDetails.name}`,
      comment: `
        Assignee: ${taskDetails.assignee ? taskDetails.assignee.name : 'Unassigned'}
        Due On: ${taskDetails.due_on || 'Not set'}
        Completed: ${taskDetails.completed ? 'Yes' : 'No'}
        Completed At: ${taskDetails.completed_at || 'Not completed'}
        Notes: ${taskDetails.notes || 'No notes'}
      `
    };

    // Realizar solicitud para crear la nota en Clientify
    axios.post(clientifyApiUrl, noteData, {
      headers: {
        'Authorization': `Token ${clientifyApiKey}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log('Note added successfully:', response.data);
      })
      .catch(error => {
        console.error('Error adding note to Clientify:', error.response ? error.response.data : error.message);
      });
  })
  .catch((error) => {
    console.error('Error fetching task details from Asana:', error.response ? error.response.body : error.message);
  });
