import { _decorator, js, Node } from "cc";
import { pTSAsset } from "db://pts-core/scripts/pTSAsset";
import { editor_property } from "db://pts-core/scripts/utils/pClass";

const { ccclass, property } = _decorator;

@ccclass('pTSAction_Manager_Base')
@pTS.$.eventify(true, true)
export abstract class pTSAction_Manager_Base<_TList extends pTSAsset<any>, _I extends Record<string, any>> implements pTS.$.IDriver<_I> {


    @property({ type: [pTSAsset], visible: true, displayOrder: 9999 })
    contents: _TList[] = []

    @editor_property()
    protected uuid: string = "";

    protected _contents: _TList[] = []

    release() {
        this._released();
        this._contents.forEach(_content => _content.destroy());
        this._contents = [];
    }

    init(origin: Node) {
        this._contents = pTSAsset.clone(this.contents);
        this.uuid = `${origin.uuid}_${js.IDGenerator.global.getNewId()}`
        return this._init(origin)
    }

    stop() {

    }

    protected abstract _init(origin: Node): Promise<void>
    protected abstract _stop(): void
    protected abstract _released(): void

    declare emit: pTS.$._IEventify<_I>;
    declare on: <_TKey extends keyof _I>(key: _TKey, ...funcs: pFlex.THandler<Parameters<_I[_TKey]>, void>[]) => void
    declare once: <_TKey extends keyof _I>(key: _TKey, ...funcs: pFlex.THandler<Parameters<_I[_TKey]>, void>[]) => void
    declare off: <_TKey extends keyof _I>(key: _TKey, ...funcs: pFlex.THandler<Parameters<_I[_TKey]>, void>[]) => void
    declare clear: (key: keyof _I) => void
    declare flush: () => void
}
