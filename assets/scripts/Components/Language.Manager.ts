import { pClass, pDriver } from 'db://pts-core/scripts/utils';

const { singleton } = pClass

type _TEvent = {
    onCountryChanged: pFlex.TFunc<[string, string], void>
}

@singleton()
export class Language_Manager {
    protected _driver: pDriver.Handler<_TEvent> = new pDriver.Handler;
    get driver() { return this._driver }

    get(key: string) {

    }

    load() {

    }


    change(country: string) {

    }
}
