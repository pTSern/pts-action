import { _decorator, Component, Node, Tween } from 'cc';
import { FastAction_Base } from '../Base/FastAction.Base';
import { pConst } from 'db://pts-core/scripts/utils';

const { ccclass, property } = _decorator;

@ccclass('FastAction_Moving')
export class FastAction_Moving extends FastAction_Base<Node> {
    @property({ type: Node, group: pConst.GROUPS.CORE })
    target: Node;

    protected _mechanic(origin: Tween<Node>): Tween<Node> {
        return origin;
    }
    
}
