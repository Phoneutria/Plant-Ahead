export default class GoogleHandle{

    /**
     * \brief tells Google to mark a task in user's Google Tasks as completed
     * \detail 
     *      right now, can only mark tasks as complete
     *      can easily be extended to be able to mark tasks as not complete
     * @param {*} taskId a string that represent the taskId (each task has an unique taskId)
     * @param {*} taskListId a string that represent the id of the task list (each task belongs to a task list)
     *                       currently being passed in as undefined
     *                       TODO: add support for multiple task lists
     * @param {*} accessToken a string that tells the Google server that the app is authorized to access the user's information
     * 
     */
    completeGoogleTask = async(taskId, taskListId, accessToken) => {

        let taskLists = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
            headers: { Authorization: `Bearer ${accessToken}`},
        }).catch(error => console.log("error message: " + error));

        let taskListJson = await taskLists.json();

        // Google Tasks' completed field is the date that the task was completed
        let completedTask = await fetch('https://www.googleapis.com/tasks/v1/lists/' + taskListJson.items[0].id + '/tasks/' + taskId, {
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-type': 'application/json'},
            method: 'PATCH',
            body: JSON.stringify({
                id: taskId,
                completed: new Date().toISOString,
                status: 'completed'
            })
        }).catch((error) => {
            console.error('Error:', error)
        })
    }

    /**
     * \brief updates task data in user's Google Tasks
     * \detail
     *      called from the EditTaskScreen
     *      cannot be used to mark tasks as complete
     * @param {*} taskId a string that represent the taskId (each task has an unique taskId)
     * @param {*} taskListId a string that represent the id of the task list (each task belongs to a task list)
     *                       currently being passed in as undefined
     *                       TODO: add support for multiple task lists
     * @param {*} taskName a string, the name of the task
     * @param {*} dueDate  a Date object, the date that the task is due
     * @param {*} accessToken a string that tells the Google server that the app is authorized to access the user's information
     * 
     */
    updateGoogleTask = async (taskId, taskListId, taskName, dueDate, accessToken) => {
        // request the list of task lists
        // a task list contains many tasks, think of "a task list" as a calendar
        let taskLists = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
            headers: { Authorization: `Bearer ${accessToken}`},
        }).catch(error => console.log("error message: " + error));
        
        // have to parse what we receive from the server into a json
        let taskListJson = await taskLists.json();

        // we assume that all tasks from the user is stored in task list 1
        // TODO: add support for multiple task lists
        
        // send an HTTP PATCH request to the google API, which updates the specified task 
        // TODO: make it possible to complete tasks, update the due date
        let editedTask = await fetch('https://www.googleapis.com/tasks/v1/lists/' + taskListJson.items[0].id + '/tasks/' + taskId, {
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-type': 'application/json'},
            method: 'PATCH',
            body: JSON.stringify({
                title: taskName,
                id: taskId,
                due: dueDate.toISOString()
            })
        }).catch((error) => {
            console.error('Error:', error)
        })
    }

    /**
     * \brief creates a new task in user's Google Tasks
     * \detail
     *      called from the create task screen
     * @param {*} taskName a string, the name of the task
     * @param {*} dueDate  a Date object, the date that the task is due
     * @param {*} accessToken a string that tells the Google server that the app is authorized to access the user's information
     */
    createGoogleTask = async(taskName, dueDate, accessToken) => {
        // request the list of task lists
        // a task list contains many tasks, think of "a task list" as a calendar
        let taskLists = await fetch('https://www.googleapis.com/tasks/v1/users/@me/lists', {
            headers: { Authorization: `Bearer ${accessToken}`},
        }).catch(error => console.log("error message: " + error));
       
        // have to parse what we receive from the server into a json
        let taskListJson = await taskLists.json();
        
        // we assume that all tasks from the user is stored in task list 1
        // TODO: add support for multiple task lists

        console.log(dueDate.toISOString());

        let newTask = await fetch('https://www.googleapis.com/tasks/v1/lists/' + taskListJson.items[0].id + '/tasks', {
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-type': 'application/json', "Accept": 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                title: taskName,
                due: dueDate.toISOString()
            })
        }).catch((error) => {
                console.error('Error:', error)
        })

        return newTaskJson.id;
    }
}