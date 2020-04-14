export default class GoogleHandler{

    /**
     * \brief tells Google to mark a task in user's Google Tasks as completed
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
     *      updates task's name (taskName) and due date (dueDate) in user's Google Tasks
     *      taskName is a string, taskListId is a string, dueDate is a string, 
     *      completion is a bool (true for completed)
     *      taskId identifies the task
     *      dueDate must be a Date() object
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
     *      creates a task with a custom task name and due date chosen by the user
     *      dueDate should be a Date() object
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