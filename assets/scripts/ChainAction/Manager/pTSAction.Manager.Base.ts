import { _decorator, js, Node } from "cc";
import { pTSAsset } from "db://pts-core/scripts/pTSAsset";
import { editor_property } from "db://pts-core/scripts/utils/pClass";

const { ccclass, property } = _decorator;

@ccclass('pTSAction_Manager_Base')
export abstract class pTSAction_Manager_Base<_TList extends pTSAsset<any>> {

    @property({ type: [pTSAsset], visible: true, displayOrder: 9999 })
    contents: _TList[] = []
    @editor_property()
    protected uuid: string = "";

    release() {
        this._released()
    }

    init(origin: Node) {
        this.uuid = `${origin.uuid}_${js.IDGenerator.global.getNewId()}`
        return this._init(origin)
    }

    stop() {

    }

    protected abstract _init(origin: Node): Promise<void>
    protected abstract _stop(): void
    protected abstract _released(): void
}
