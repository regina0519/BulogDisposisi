import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import Global from './Global';

const BACKGROUND_FETCH_TASK = 'background-fetch';
class BackgroundProcess {
    constructor() {
        console.log("background");
        TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
            console.log("BG Trying");
            Global.doBackground();

            return BackgroundFetch.BackgroundFetchResult.NewData;
            //return BackgroundFetch.Result.NewData;
        });
        Global.setNotif();
        //this.registerBackgroundFetchAsync();

    }
    registerBackgroundFetchAsync = async () => {
        return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 1, // 15 minutes
            stopOnTerminate: false, // android only,
            startOnBoot: true, // android only
        });
    }
    checkStatusAsync = async () => {
        const status = await BackgroundFetch.getStatusAsync();
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
        return { "status": status, "isRegistered": isRegistered };
    };
}
export default BackgroundProcess;