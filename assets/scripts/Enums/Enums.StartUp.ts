import { Enum } from "cc";

export enum Enums_EStartUp {
    None = "none",
    PreLoad = "__preload",
    OnLoad = "onLoad",
    OnStart = "start",
    OnEnable = "onEnable",
    OnDisable = "onDisable",
    OnDestroy = "onDestroy",
    OnJsonEvent = "onJsonEvent",
}

Enum(Enums_EStartUp)
