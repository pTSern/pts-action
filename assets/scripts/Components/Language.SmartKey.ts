import { _decorator, Component, Label } from 'cc';
import { instance } from 'db://pts-core/scripts/utils/pClass';
import { Config_GlobalTTF } from '../Config/Config.GlobalTTF';

const { ccclass, property, requireComponent, menu } = _decorator;

@ccclass('Language_SmartKey')
@menu('pts-language/Language/SmartKey')
@requireComponent(Label)
export class Language_SmartKey extends Component {
    @property({ type: Label })
    protected _hooker: Label = null
    @property({ type: Label })
    get hooker() { this._ensure(); return this._hooker }
    set hooker(x) { if(!x) { this._ensure(); return; } this._hooker = x }

    protected _ensure() {
        if(!this._hooker) {
            this._hooker = this.getComponent(Label);
        }
    }

    protected onEnable(): void {
        this._actUpdateTTF();
    }

    protected _actUpdateTTF() {
        const _config = instance(Config_GlobalTTF);
        if(!_config) return;

        this.hooker.font = _config.get();
        this.hooker.useSystemFont = false;
    }

}
