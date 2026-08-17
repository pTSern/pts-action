import { _decorator, Component, Node, JsonAsset, Enum, CCClass, js } from 'cc';
import { CC_IEnumList } from 'db://pts-core/scripts/interfaces/cc/CC.IEnumable';
import { pClass, pEngine } from 'db://pts-core/scripts/utils';
import { editor_property } from 'db://pts-core/scripts/utils/pClass';

const { ccclass, property } = _decorator;

@ccclass('Smart_Percentage_Updater')
export class Smart_Percentage_Updater extends Component {
    @property({ type: JsonAsset })
    onPercentageChanged: JsonAsset[] = [];

    @property({  })
    reverse: boolean = false;

    @property({ type: Node })
    protected _target: Node = null;

    @property({ type: Node })
    get target() { return this._target; }
    set target(value: Node) {
        this._target = value;
        this.focus();
    }

    @property({  })
    protected _component: string = '';
    @property({ type: Enum({}) })
    get comp() { return this._component; }
    set comp(value: string) {
        this._component = value;
        this.focus();
    }

    @property({  })
    protected _property: string = '';
    @property({ type: Enum({}) })
    get property() { return this._property; }
    set property(value: string) {
        this._property = value;
        this.focus();
    }

    @editor_property(Component)
    protected _selector: Component = null;

    onFocusInEditor(): void {
        this.focus()
    }

    resetInEditor(): void {
        this.focus()
    }

    focus() {
        CCClass.Attr.setClassAttr(this, 'comp', 'visible', !!this._target);

        if(!this._target) return;
        const _comps = this._target.components.map( _ => ({ name: js.getClassName(_), value: js.getClassName(_) }) )
        console.log('Smart_Percentage_Updater focus', _comps);
        CCClass.Attr.setClassAttr(this, 'comp', 'enumList', _comps);

        if(!this._component) return;
        const _comp = this._target.getComponent(this._component);
        CCClass.Attr.setClassAttr(this, 'property', 'visible', !!_comp);

        if(!_comp) return;
        const _ccprops = pEngine.NodeUtils.getCCProps(_comp).filter(_ => typeof _comp[_] == 'number');
        const _props = CC_IEnumList.generator(_ccprops);

        CCClass.Attr.setClassAttr(this, 'property', 'enumList', _props);
    }

    protected _onChangeLookUp(...args: any[]) {

        const _params: number[] = []

        for (const arg of args) {
            if(typeof arg != 'number') continue 
            if(_params.length >= 1 && arg <= 0) continue;

            _params.push(arg);
        }

        if(_params.length >= 2) {
            this._onChange(_params[0] / _params[1]);
        }
    }

    @editor_property()
    protected _percentage: number = 0;
    protected _onChange(percentage: number) {
        if(!this._selector) return;
        //if(!Object.prototype.hasOwnProperty.call(this._selector, this._property)) return;

        percentage = Math.abs(this.reverse ? 1 - percentage : percentage);

        this._percentage = percentage;
        this._selector[this._property] = percentage;
    }

    protected __preload(): void {
        pEngine.Json.event.add(this.onPercentageChanged, { func: this._onChangeLookUp, binder: this });
        this._selector = this._target?.getComponent(this._component);
    }

    protected onDestroy(): void {
        pEngine.Json.event.remove(this.onPercentageChanged, { func: this._onChangeLookUp, binder: this });
    }
}
