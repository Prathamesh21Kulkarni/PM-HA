import React, { Component } from 'react';
import {
  InteractiveForceGraph,
  ForceGraphNode,
  ForceGraphArrowLink,
} from 'react-vis-force';
import jsPERT, { pertProbability, START, END, Pert } from 'js-pert';
import TaskTable from './TaskTable';
import NetworkDiagram from './NetworkDiagram';

const getFillColor = (nodeKey: string, pert: Pert) => {
  if (nodeKey === START || nodeKey === END) {
    return 'blue';
  }
  return pert.criticalPath.indexOf(nodeKey) > -1 ? 'red' : 'green';
};

interface ComponentProps {}
interface StateProps {
  selected?: string;
  pert?: Pert;
  probability?: number;
}

class App extends Component<ComponentProps, StateProps> {
  constructor(props: ComponentProps) {
    super(props);
    const activities1 = JSON.parse(localStorage.getItem('myData') || '{}');
    const pert = jsPERT(JSON.parse(activities1));
    console.log(JSON.stringify(pert));
    const probability = pertProbability(pert, 19);
    this.state = { selected: undefined, pert, probability };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(nodeKey?: string) {
    this.setState({ selected: nodeKey });
  }

  renderSelected() {
    if (!this.state.selected || !this.state.pert.activitiesParams[this.state.selected]) {
      return null;
    }
    const { expectedTime } = this.state.pert.activitiesParams[this.state.selected];
    const { slack } = this.state.pert;
    const { earliestStartTimes, earliestFinishTimes, latestStartTimes, latestFinishTimes } = this.state.pert;
    return (
      <div style={{ float: 'right' }}>
        Selected node: {this.state.selected}
        <br />
        Expected Time: {expectedTime}
        <br />
        Slack: {slack[this.state.selected]}
        <br />
        <br />
        Earliest Start: {earliestStartTimes[this.state.selected]}
        <br />
        Earliest Finish: {earliestFinishTimes[this.state.selected]}
        <br />
        <br />
        Latest Start: {latestStartTimes[this.state.selected]}
        <br />
        Latest Finish: {latestFinishTimes[this.state.selected]}
        <br />
      </div>
    );
  }

  render() {
    const { probability } = this.state;
    return (
      <div>
        {this.renderSelected()}
        <div>
        <TaskTable data={this.state.pert} />
        <NetworkDiagram data = {JSON.stringify(this.state.pert)} />
      </div>
      </div>
    );
  }
}

export default App;