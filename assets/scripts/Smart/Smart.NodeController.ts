import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Smart_NodeController')
export class Smart_NodeController extends Component {
    @property({ type: Node })
    nodes: Node[] = [];

    active() {
        this.nodes.forEach(_ => _ && (_.active = true));
    }

    inactive() {
        this.nodes.forEach(_ => _ && (_.active = false));
    }
}
