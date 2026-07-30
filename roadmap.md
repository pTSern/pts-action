# Road Map
+ Allow to select `folder` in Editor mode via `Project Settings` panels - this can be done by update the `package.json` - just like the `pts-multi-game-sdk`:
    - one is the `located_json`
    - one is plugins folder
+ On Selected `New` folder is completed ( only if the new folder is selected ) - and make sure that folder is not `OUTSIDE` of the Project path -> get all the `.json` file inside that folder;
+ Get all the `content` inside every `json` folders, then save it with formart `file name` as key and `file data` as value inside the `_$list` which is the `const` should be decalred on top of the `script` that created to handle this extension action.
    - Expected data of `_$list` can be:
    ```typescript
    const _$list = Object.create(null);
    function get(_files_list: string[]) //< Example u get the files list as array
    {
        for(const _key of _files_list) {
            _$list[_key] = get_data_from_file(_key);
        }
    }
    ```
+ After the `_$list` is done loaded data -> create `.js` file and `.d.ts` file script inside the `plugins` folder we allow user to select above.
    - the `js` file should have content like this:
    ```js
    const _$path = "the_selected_path_that_storage_all_the_json_files"
    const _$langs = {
        __enums__: null,
        ... //< All the json file name here, the key and value is both the file name.
        //Example const _$langs = { __enums__: null, test: "test" }
    }
    const _$container = {
        "the_file_name": { /** Declared all the `key` inside the this file json data. the key and value is the same ( ignore reall value ) */ }
        //Example const _$container = { "test": { __enums__: null, abc: "abc" } }
        // Make sure everysingle object inside `_$container` must have `__enums__` as null value
    }

    function Enum(key) {
        return _$container[key];
    }

    window['pTS'] = window['pTS'] || {}
    window['pTS']['languages'] = {
        Enum, ELang: _$langs, path: _$path,
    }
    ```

    - the `.d.ts` file should be:
    ```typescript .d.ts
    declare namespace pTS {
        export namespace languages {
            const _$langs = [/** All the files name here */] as const
            export type TLang = typeof _$langs[number];
            export function Enum(key: TLang): Record<string, string>
            export const path: string;
            export const ELang: Record<string, string>
        }
    }
    ```

+ Read the `pts-multi-game-sdk` or `pts-bundle-list` for more information to understand how i did
