
import { CCInteger, Tween, _decorator, randomRangeInt, sp } from 'cc'
import { FastAction_Base } from '../Base/FastAction.Base';
import { pConst } from 'db://pts-core/scripts/utils';
import { Helper_Skeleton } from 'db://pts-core/scripts/helper/Common/Helper.Skeleton';

const { ccclass, property } = _decorator;

@ccclass("FastAction_Skeleton")
export class FastAction_Skeleton extends FastAction_Base<sp.Skeleton> {
    @property({ type: sp.Skeleton, group: pConst.GROUPS.CORE })
    target: sp.Skeleton = null;

    @property({ group: pConst.GROUPS.CORE, type: CCInteger })
    track: number = randomRangeInt(0, 1000);

    @property({ group: pConst.GROUPS.CORE, type: Helper_Skeleton })
    helper: Helper_Skeleton[] = []

    onFocusInEditor(): void {
        if(!this.target) return;

        const _anims = this.target.skeletonData.getRuntimeData().animations;
        const _list = _anims.map(_anim => ({ name: _anim.name, value: _anim.name }));
        this.helper.forEach(_helper => _helper.focus(_list));
    }

    protected _chain(i?: number) {
        let _i = typeof i === 'number' ? i : 0;
        const _cur = this.helper[_i];
        if(!_cur) return;
        const _is = _i === this.helper.length - 1;
        const _loop = _is ? _cur.loop : false;
        const _track = this.target.setAnimation(this.track, _cur.anim, _loop);

        this.target.setTrackCompleteListener(_track, () => {
            this._chain(_i + 1);
        })
    }

    protected _mechanic(origin: Tween<sp.Skeleton>) {
        let _last = "";
        for(let i = 0; i < this.helper.length; i++) {
            const _cur = this.helper[i];
            const _prev = this.helper[i - 1];
            _last = !!_prev ? _prev.anim : this.target.animation;
            this.target.setMix(_last, _cur.anim, _cur.mixin);
        }
        return origin.call( this._chain.bind(this) );
    }

    protected _onLoad(): void {
    }

    protected _onPause(): void {
    }
    protected _onResume(): void {
    }
    protected _onStop(): void {
    }
}
