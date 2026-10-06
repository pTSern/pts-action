
import { _decorator, Node } from 'cc';
import { pTSAsset } from 'db://pts-core/scripts/pTSAsset';
import { pGlobal } from 'db://pts-core/scripts/utils';
import { editor_property } from 'db://pts-core/scripts/utils/pClass';

const { ccclass, property } = _decorator;

interface _I {
    onReady(condition: pTSAction_Condition_Base): void
}

@ccclass('pTSAction_Condition_Base')
export abstract class pTSAction_Condition_Base extends pTSAsset<_I> {
    @property({  })
    enabled: boolean = true;

    @property({  })
    logger: boolean = false;

    @editor_property()
    protected _ready: boolean = false;

    isReady() {
        return this._ready;
    }

    protected _reset?(): void
    reset() {
        this._ready = false;
        this._reset?.();
    }

    abstract stop(): void
    tick?(dt: number): void

    abstract init(origin: Node): void
    abstract release(origin: Node): void

    protected _actReadyUp() {
        this._ready = true;
        this.logger && pGlobal.log({ level: "DEV", group: "pTSAction-Condition" }, `[${this.name} >> ReadyUp]`, this)
        this.emit('onReady', this);
    }
}
