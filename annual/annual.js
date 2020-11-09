module.exports = {
    startTasks: startTasks
}


const {checkCompetitions} = require('./checkcompetitions.js')

class TaskHandler {
    constructor() {
        this.tasks = [];
    }

    add(task) {
        this.tasks.push(task);
    }

    stop(index) {
        this.tasks[index].stop();
        this.tasks.slice(index, 1);
    }
}

class Task {
    // object for repeating tasks annualy
    constructor(call, delay, repeat, params) {
        this.call = () => call(params);
        this.repeat = repeat;
        this.timeout = setTimeout(() => this.begin(), delay);
        this.interval = undefined;
    }

    begin() {
        // method for begining annual executions
        this.call();
        this.interval = setInterval(this.call, this.repeat);
        this.timeout = undefined;
    }

    stop() {
        // method for stoping annual executions
        if (this.timeout != undefined) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        if (this.interval != undefined) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
}

function startTasks(client) {
    let handler = new TaskHandler();
    
    const now = new Date();
    const then = new Date();
    then.setHours(8, 0, 0, 0);
    if (now.getTime() > then.getTime()) {
        then.setDate(then.getDate() + 1);
    }

    const delay = then.getTime() - now.getTime();
    const day = 86400000; // millis in day
    [
        new Task(checkCompetitions, delay, day, {'client': client})
    ].forEach(task => {
        handler.add(task)
    });
}