import Asana from 'asana';
import axios from 'axios';

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '';

let tasksApiInstance = new Asana.TasksApi();
let project_gid = "1201688170188885";
let opts = {
    'completed_since': "2012-02-22T02:06:58.158Z",
    'limit': 50,
    'opt_fields': "assignee,name,notes" // Ajuste en los campos solicitados
};

function fetchTasks(offset = null) {
    // Set the offset if provided
    if (offset) {
        opts.offset = offset;
    }

    // Call the getTasksForProject method with the current offset
    return tasksApiInstance.getTasksForProject(project_gid, opts);
}

// Perform the first paginated request
fetchTasks().then(async (result) => {
    // Handle the results
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));

    // Check if there is a next page
    if (result.next_page) {
        // Extract the offset from the next_page attribute
        const nextPageOffset = result.next_page.offset;

        // Perform the next paginated request
        const nextResult = await fetchTasks(nextPageOffset);
        
        // Combine the data from the current and next result
        result.data = result.data.concat(nextResult.data);
    }

    // Process the data and send notes to Clientify
    processAndSendNotes(result.data);
}).catch((error) => {
    console.error(error.response ? error.response.body : error.message);
});

function processAndSendNotes(tasks) {
    const apiKey = '529f345a1219496efc6bc6664b76cf6aeebaea3c';
    const companyId = 1242366;

    const apiUrl = `https://api.clientify.net/v1/companies/${companyId}/note/`;

    // Iterate through tasks and send notes
    tasks.forEach(task => {
        const assigneeName = task.assignee ? task.assignee.name : 'No Assignee';
        const noteData = {
            name: `Note for task: ${task.name}`,
            comment: `Assigned to: ${assigneeName}`
        };

        axios.post(apiUrl, noteData, {
            headers: {
                Authorization: `Token ${apiKey}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Note successfully sent:', response.data);
        })
        .catch(error => {
            console.error('Error sending note:', error.response ? error.response.data : error.message);
        });
    });
}
