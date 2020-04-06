import { NativeModules } from "react-native";

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
    updateGoogleTask = async (taskId, taskListId, taskName, dueDate, completion) => {
        // get task from user's Google Tasks
        let task = await fetch('https://www.googleapis.com/tasks/v1/' + taskListId +
        "/tasks/" + taskId, {
            headers: { Authorization: `Bearer ${this.props.accessToken}`},
        }).catch(error => console.log("error message: " + error));
        
        // modify task
        task.title = taskName;
        task.due = dueDate;
        task.completed = completion;
        
        // send modified task back to user's Google Tasks
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", "https://www.googleapis.com/tasks/v1/lists/" + taskListId + "/tasks/" + taskId,
        true);
        xhr.send(task);
    }

}