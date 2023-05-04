import React, { Component, ChangeEvent } from 'react';
import { Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import App from './App';
const localStorage = window.localStorage;
interface Task {
  id: string;
  optimisticTime: number;
  mostLikelyTime: number;
  pessimisticTime: number;
  predecessors: string[];
}

interface State {
  numTasks: number;
  tasks: Record<string, Task>;
}

class TaskForm extends Component<{}, State> {
  state: State = {
    numTasks: 0,
    tasks: {}
  };

  handleNumTasksChange = (event: ChangeEvent<HTMLInputElement>) => {
    const numTasks = parseInt(event.target.value, 10);
    const tasks = { ...this.state.tasks };
    for (let i = 1; i <= numTasks; i++) {
      const taskId = `Task ${i}`;
      if (!tasks[taskId]) {
        tasks[taskId] = {
          id: taskId,
          optimisticTime: 0,
          mostLikelyTime: 0,
          pessimisticTime: 0,
          predecessors: []
        };
      }
    }
    this.setState({ numTasks, tasks });
  };

  handleTaskChange = (event: ChangeEvent<HTMLInputElement>, taskId: string, field: keyof Task) => {
    const tasks = { ...this.state.tasks };
    tasks[taskId][field] = parseFloat(event.target.value);
    this.setState({ tasks });
  };

  handlePredecessorChange = (event: ChangeEvent<HTMLInputElement>, taskId: string) => {
    const tasks = { ...this.state.tasks };
    tasks[taskId].predecessors = event.target.value.split(',');
    this.setState({ tasks });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const json = JSON.stringify(this.state.tasks);
    console.log(json);
    ReactDOM.render(<App />, document.getElementById('root'));
    localStorage.setItem('myData', JSON.stringify(json));

  };

  // renderTaskFields = (taskId: string) => {
  //   const fields: (keyof Task)[] = ['optimisticTime', 'mostLikelyTime', 'pessimisticTime'];
  //   return (
  //     <>
  //       {fields.map((field) => (
  //         <div key={field}>
  //           <label>{field}</label>
  //           <input
  //             type="number"
  //             placeholder={field}
  //             value={this.state.tasks[taskId][field]}
  //             onChange={(event) => this.handleTaskChange(event, taskId, field)}
  //           />
  //         </div>
  //       ))}
  //     </>
  //   );
  // };

  renderTaskFields = (taskId: string) => {
    const fields: (keyof Task)[] = ['optimisticTime', 'mostLikelyTime', 'pessimisticTime'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom:'20px'}}>
        {fields.map((field) => (
          <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>{field}</label>
            <input
              type="number"
              step="0.1"              
              placeholder={field}
              value={this.state.tasks[taskId][field]}
              onChange={(event) => this.handleTaskChange(event, taskId, field)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        ))}
      </div>
    );
  };
  
  // renderTaskFields = (taskId: string) => {
  //   const fields: (keyof Task)[] = ['optimisticTime', 'mostLikelyTime', 'pessimisticTime'];
  //   return (
  //     <Form>
  //       {fields.map((field) => (
  //         <FormGroup key={field}>
  //           <FormLabel>{field}</FormLabel>
  //           <FormControl
  //             type="number"
  //             placeholder={field}
  //             value={this.state.tasks[taskId][field]}
  //             onChange={(event) => this.handleTaskChange(event, taskId, field)}
  //           />
  //         </FormGroup>
  //       ))}
  //     </Form>
  //   );
  // };

  renderPredecessorFields = (taskId: string) => {
    return (
      <>
        <div key={`${taskId}-predecessors`}>
          <label className="space">{taskId} predecessors (comma-separated)</label>
          <input
            type="text"
            placeholder="predecessors"
            value={this.state.tasks[taskId].predecessors.join(',')}
            onChange={(event) => this.handlePredecessorChange(event, taskId)}
          />
        </div>
      </>
    );
  };

  render() {
    const taskIds = Object.keys(this.state.tasks);

    return (
      <form onSubmit={this.handleSubmit}>
        <div id="numTasks">
          <label className="space">Number of tasks: </label>
          <input type="number" onChange={this.handleNumTasksChange} />
        </div>
        {taskIds.map((taskId) => (
          <div key={taskId} id="taskk">
            <h3>{taskId}</h3>
            <div>
              <label className="space">ID</label>
              <input type="text" placeholder="ID" value={taskId} disabled />
            </div>
            {this.renderTaskFields(taskId)}
            {this.renderPredecessorFields(taskId)}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    )}
}

export default TaskForm;