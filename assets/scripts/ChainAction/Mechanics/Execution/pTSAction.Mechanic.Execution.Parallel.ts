
import { Tween, Node, _decorator, tween } from "cc";
import { pTSAction_Mechanic_Execution_Base } from "../../Base/pTSAction.Mechanic.Execution.Base";
import { pTSAction_Mechanic_Base } from "../../Base/pTSAction.Mechanic.Base";
import { menu } from "db://pts-core/scripts/utils";

const { ccclass } = _decorator;

@ccclass('pTSAction_Mechanic_Execution_Parallel')
@menu('pTSAction/Mechanic/Execution/Parallel')
export class pTSAction_Mechanic_Execution_Parallel extends pTSAction_Mechanic_Execution_Base {

    protected _map: Map<string, Tween<Node>[]> = new Map();
    generate(_tween: Tween<Node>, contents: pTSAction_Mechanic_Base[], uuid: string): Tween<Node> {
        const _target = _tween.getTarget();
        const _list = contents.map(_content => {
            const _tween = tween(_target);

            const _list = this._map.get(uuid) || [];
            _list.push(_tween);
            this._map.set(uuid, _list);

            _content.tween(_tween);
            return _tween;
        })
        _tween.parallel(..._list)
        return _tween;
    }

    release(uuid: string): void {
        const _list = this._map.get(uuid);
        _list?.forEach(_content => _content.stop());
        this._map.delete(uuid);
    }
}
