import React, { Component } from 'react';
import { text } from 'stream/consumers';


class TaskTable extends Component {
  render() {
    const { activitiesParams, earliestStartTimes, earliestFinishTimes, latestStartTimes, latestFinishTimes, slack, criticalPath } = this.props.data;
    const taskKeys = Object.keys(activitiesParams);
    
    return (
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Expected Time</th>
            <th>Earliest Start</th>
            <th>Earliest Finish</th>
            <th>Latest Start</th>
            <th>Latest Finish</th>
            <th>Slack</th>
            <th>Critical Path</th>
          </tr>
        </thead>
        <tbody>
          {taskKeys.map(taskKey => (
            <tr key={taskKey}>
              <td>{taskKey}</td>
              <td>{activitiesParams[taskKey].expectedTime}</td>
              <td>{earliestStartTimes[taskKey]}</td>
              <td>{earliestFinishTimes[taskKey]}</td>
              <td>{latestStartTimes[taskKey]}</td>
              <td>{latestFinishTimes[taskKey]}</td>
              <td>{slack[taskKey]}</td>
              <td>{criticalPath.indexOf(taskKey) > -1 ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default TaskTable;
