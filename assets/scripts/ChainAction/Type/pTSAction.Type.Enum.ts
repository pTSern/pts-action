import { pLazy } from "db://pts-core/scripts/utils";

export enum pTSAction_Type_ECondition {
    OR = 0,
    AND
}

export enum pTSAction_Type_EExecution {
    SEQUENCE = 0,
    PARALLEL,
}

export enum pTSAction_Type_ELooper {
    INSTANTLY = 0,
    AWAIT
}

pLazy.enums(pTSAction_Type_ECondition, pTSAction_Type_EExecution)
