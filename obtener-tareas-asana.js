import Asana from 'asana';

let client = Asana.ApiClient.instance;
let token = client.authentications['token'];
token.accessToken = '2/1201686013359871/1206470872894935:51797f595a205c882b8810f82bff374d';

let tasksApiInstance = new Asana.TasksApi();
let project_gid = "1203021343249809";
let opts = {
    'completed_since': "2012-02-22T02:06:58.158Z",
    'limit': 50,
    'opt_fields': "actual_time_minutes,approval_status,assignee,assignee.name,assignee_section,assignee_section.name,assignee_status,completed,completed_at,completed_by,completed_by.name,created_at,created_by,custom_fields,custom_fields.asana_created_field,custom_fields.created_by,custom_fields.created_by.name,custom_fields.currency_code,custom_fields.custom_label,custom_fields.custom_label_position,custom_fields.date_value,custom_fields.date_value.date,custom_fields.date_value.date_time,custom_fields.description,custom_fields.display_value,custom_fields.enabled,custom_fields.enum_options,custom_fields.enum_options.color,custom_fields.enum_options.enabled,custom_fields.enum_options.name,custom_fields.enum_value,custom_fields.enum_value.color,custom_fields.enum_value.enabled,custom_fields.enum_value.name,custom_fields.format,custom_fields.has_notifications_enabled,custom_fields.is_formula_field,custom_fields.is_global_to_workspace,custom_fields.is_value_read_only,custom_fields.multi_enum_values,custom_fields.multi_enum_values.color,custom_fields.multi_enum_values.enabled,custom_fields.multi_enum_values.name,custom_fields.name,custom_fields.number_value,custom_fields.people_value,custom_fields.people_value.name,custom_fields.precision,custom_fields.resource_subtype,custom_fields.text_value,custom_fields.type,dependencies,dependents,due_at,due_on,external,external.data,followers,followers.name,hearted,hearts,hearts.user,hearts.user.name,html_notes,is_rendered_as_separator,liked,likes,likes.user,likes.user.name,memberships,memberships.project,memberships.project.name,memberships.section,memberships.section.name,modified_at,name,notes,num_hearts,num_likes,num_subtasks,offset,parent,parent.created_by,parent.name,parent.resource_subtype,path,permalink_url,projects,projects.name,resource_subtype,start_at,start_on,tags,tags.name,uri,workspace,workspace.name"
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
fetchTasks().then((result) => {
    // Handle the results
    console.log('API called successfully. Returned data: ' + JSON.stringify(result.data, null, 2));

    // Check if there is a next page
    if (result.next_page) {
        // Extract the offset from the next_page attribute
        const nextPageOffset = result.next_page.offset;

        // Perform the next paginated request
        return fetchTasks(nextPageOffset);
    } else {
        // No more pages, you have reached the end
        return Promise.resolve(result);
    }
}).then((result) => {
    console.log('All pages fetched successfully. Final data: ' + JSON.stringify(result.data, null, 2));
}).catch((error) => {
    console.error(error.response ? error.response.body : error.message);
});
