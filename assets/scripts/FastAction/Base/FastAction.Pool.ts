import { js, Enum } from "cc";

const _$enum = [];
export function register(_class: Function) {
    const _name = js.getClassName(_class);
    if(!_$enum.find(_ => _.name === _name)) _$enum.push({ name: _name, value: _name });
}

export const EList = _$enum
