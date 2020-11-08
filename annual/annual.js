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
    const d = new Date();
    const delay = ((d.getHours() < 8 ? 8 : 32) - d.getHours())*3600000;
    const day = 86400000; // millis in day
    [
        new Task(checkCompetitions, delay, day, {'client': client})
    ].forEach(task => {
        handler.add(task)
    });
}