import { _decorator, Component, js, TTFFont } from 'cc';
import { Smart_Limiter } from 'db://pts-core/scripts/Components/Smart/Smart.Limiter';
import { pClass } from 'db://pts-core/scripts/utils'
import { editor_property } from 'db://pts-core/scripts/utils/pClass';

const { ccclass, property, menu, requireComponent } = _decorator;

const { singleton } = pClass;

@ccclass("Config_GlobalTTF_Helper")
class _Helper {
    @property({ type: pTS.languages.ELang })
    country: string = "en"

    @property({ type: TTFFont })
    font: TTFFont = null
}

@ccclass('Config_GlobalTTF')
@menu('pts-language/Config/GlobalTTF')
@singleton()
@requireComponent(Smart_Limiter)
export class Config_GlobalTTF extends Component {
    @property({ type: _Helper })
    private list: _Helper[] = []

    @editor_property(TTFFont)
    get default() { return this._map['en'] || null }

    get() {
        return this.default;
    }

    protected _map: Record<string, TTFFont> = js.createMap(true);

    protected __preload(): void {
        for(const _ret of this.list) {
            this._map[_ret.country] = _ret.font;
        }
        delete this.list;
    }
}
