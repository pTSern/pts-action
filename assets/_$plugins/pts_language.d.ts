declare namespace pTS {
    export namespace languages {
        const _$langs = ["en"] as const;
        export type TLang = typeof _$langs[number];
        export function Enum(key: TLang): Record<string, string>;
        export const path: string;
        export const ELang: Record<string, string>;
    }
}
