export default class GoogleHandler{

    /**
     * \brief updates task data in user's Google Tasks
     * \detail
     *      updates task's name (taskName) and due date (dueDate) in user's Google Tasks
     *      can also tell Google Tasks that the task is complete
     *      taskName is a string, taskListId is a string, dueDate is a string, 
     *      completion is a bool (true for completed)
     *      taskId identifies the task
     */
    updateGoogleTask = async (taskId, taskListId, taskName, dueDate, completion, accessToken) => {
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
                id: taskId
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
    createGoogleTask = async(taskName, accessToken, dueDate) => {
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

        let newTaskJson = await newTask.json();
        console.log(newTaskJson);
    }

    // /**
    //  * \brief completes a specified task in a user's Google Tasks
    //  * \detail taskId is the task's id
    //  *         taskListId is the task list's id
    //  *         completed is true if to mark the task as complete
    //  *         completed is false to mark the task as not complete
    //  */
    // completeGoogleTask = async(taskId, taskListId, completed) {

    // }

}