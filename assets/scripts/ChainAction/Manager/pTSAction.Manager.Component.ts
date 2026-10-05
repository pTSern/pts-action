import { _decorator, Component } from 'cc';
import { pTSAction_Manager_Condition } from './pTSAction.Manager.Condition';
import { pTSAction_Manager_Mechanic } from './pTSAction.Manager.Mechanic';
import { EDITOR, EDITOR_NOT_IN_PREVIEW } from 'cc/env';

const { ccclass, property } = _decorator;

@ccclass('pTSAction_Manager_Component')
export class pTSAction_Manager_Component extends Component {
    @property({ type: pTSAction_Manager_Condition })
    condition: pTSAction_Manager_Condition = new pTSAction_Manager_Condition()

    @property({ type: pTSAction_Manager_Mechanic })
    mechanic: pTSAction_Manager_Mechanic = new pTSAction_Manager_Mechanic()

    protected onLoad(): void {
        if(EDITOR && EDITOR_NOT_IN_PREVIEW) return;

        this.condition.init(this.node);
        this.mechanic.init(this.node);
    }
}
