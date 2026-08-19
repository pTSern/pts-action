import { _decorator, Tween, UIRenderer } from 'cc';
import { FastAction_Base } from '../Base/FastAction.Base';
import { pConst } from 'db://pts-core/scripts/utils';
import { Helper_Color } from 'db://pts-core/scripts/helper/Common/Helper.Color';

const { ccclass, property } = _decorator;

@ccclass('FastAction_Coloring')
export class FastAction_Coloring extends FastAction_Base<UIRenderer> {
    @property({ type: UIRenderer, group: pConst.GROUPS.CORE })
    target: UIRenderer = null;

    @property({ group: pConst.GROUPS.CORE, type: Helper_Color })
    colors: Helper_Color[] = [];

    protected _mechanic(origin: Tween<UIRenderer>): Tween<UIRenderer> {
        return this.colors.reduce((_, _cur) => {
            _ = _cur.tween<UIRenderer>(_, 'color');
            return _
        }, origin)
    }

    protected _onPause(): void {
    }

    protected _onResume(): void {
    }

    protected _onStop(): void {
    }
    
}
