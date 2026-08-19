import { _decorator, CCClass, Component } from 'cc';
import { FastAction_Base } from './FastAction.Base';
import { EList } from './FastAction.Pool';
import { pConst } from 'db://pts-core/scripts/utils';

const { ccclass, property } = _decorator;

@ccclass('FastAction_Sharing._Helper')
class _Helper {
    @property({ visible() { return this._type != '' }, readonly: true })
    protected _type: string = ""
    @property({ type: pConst.ENUM })
    get type() { return this._type; }
    set type(value: string) { this._type = value; }

    @property({ type: FastAction_Base })
    actions: FastAction_Base<any>[] = []

    execute(target?: any) {
        for(const _ of this.actions) {
            _.setNewTarget(target);
            _.execute();
        }
    }

    protected focus() {
        CCClass.Attr.setClassAttr(FastAction_Sharing, 'type', 'enumList', EList);
    }
}

@ccclass('FastAction_Sharing')
export class FastAction_Sharing<_TTarget extends object> extends Component {
    @property({ type: _Helper })
    helpers: _Helper[] = []

    onFocusInEditor(): void {
        this._focus();
    }

    resetInEditor(): void {
        this._focus();
    }

    protected _focus() {
        CCClass.Attr.setClassAttr(_Helper, 'type', 'enumList', EList);
    }
}
