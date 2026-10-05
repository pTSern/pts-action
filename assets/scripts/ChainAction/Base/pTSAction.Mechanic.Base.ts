import { _decorator, Node, Tween } from 'cc';
import { pTSAsset } from 'db://pts-core/scripts/pTSAsset';

const { ccclass, property } = _decorator;

@ccclass('pTSAction_Mechanic_Base')
export abstract class pTSAction_Mechanic_Base extends pTSAsset {
    @property({  })
    enabled: boolean = true;

    abstract tween(action: Tween<Node>): Tween<Node>
    abstract stop(): void
}
