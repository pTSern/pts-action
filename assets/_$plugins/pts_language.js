const _$path = "project://assets/game/$language";
const _$langs = {"__enums__":null,"en":"en"};
const _$container = {"en":{"__enums__":null,"test":"test"}};

function Enum(key) {
    return _$container[key];
}

window['pTS'] = window['pTS'] || {};
window['pTS']['languages'] = {
    Enum, ELang: _$langs, path: _$path,
};
