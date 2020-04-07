export default class GoogleHandler{

    /**
     * \brief modifies task data in user's Google Tasks
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
            headers: { Authorization: `Bearer ${this.props.accessToken}`},
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

}