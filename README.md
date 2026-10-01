# `pts-action` - Action & Fast Animation Framework

> **Author**: pTSern  
> **Version**: `1.0.0`  
> **Cocos Creator Compatibility**: `>= 3.8.0`  
> **Category**: Gameplay, Animation & Sequence Execution

---

## 1. Overview

`pts-action` is a high-performance action and tween execution framework designed for Cocos Creator. It provides lightweight, pooled animation behaviors (`FastAction`), node controllers, transform synchronization utilities, and countdown timers. Instead of writing verbose `tween(node)...` routines across multiple scripts, `pts-action` offers declarative, inspector-configurable components that execute cleanly and clean up automatically on node disable or destruction.

---

## 2. Process Architecture & Topology

```
┌─────────────────────────────────────────────────────────────┐
│                 AssetDB Mount: `db://assets`                │
│  Mounted from `./assets` as read-only runtime package       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Runtime Components                       │
│                                                             │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │ FastAction Framework  │       │ Synchronization Suite │  │
│  │ - FastAction_Base<T>  │       │ - Sync_Position       │  │
│  │ - FastAction_Moving   │       │ - Sync_UITransform    │  │
│  │ - FastAction_Scaling  │       └───────────────────────┘  │
│  │ - FastAction_Opacity  │       ┌───────────────────────┐  │
│  │ - FastAction_Coloring │       │ Smart Controllers     │  │
│  │ - FastAction_Spawner  │       │ - Smart_NodeController│  │
│  │ - FastAction_Sharing  │       │ - Smart_Percentage... │  │
│  └───────────────────────┘       │ - Tick_CountDown      │  │
│                                  └───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Core Component Suites

### 3.1. `FastAction` Engine (`assets/scripts/FastAction/`)
All `FastAction` components extend `FastAction_Base<TTarget>`, which in turn extends `Smart_StartUp` from `pts-core`. They provide lifecycle-safe tweening, easing curves, loop controls, delays, and callbacks.

* **`FastAction_Moving`**:
  * Moves target `Node` to specified coordinate offsets, target nodes, or absolute positions.
  * Configurable by duration or constant speed (`speed > 0`).
  * Integrates with `Helper_Vec3` for flexible 2D/3D coordinate transformations.
* **`FastAction_Scaling`**:
  * Smooth scale interpolation (e.g. bounce, punch, elastic zoom).
  * Independent or uniform XYZ scaling with custom easing curves.
* **`FastAction_Opacity`**:
  * Fades `UIOpacity` on target node.
  * Handles auto-enabling/disabling of the renderer when reaching zero opacity.
* **`FastAction_Coloring`**:
  * Tweens `UIRenderer` (Sprite, Label, Graphic) colors smoothly across RGB/HSV palettes.
* **`FastAction_Spawner`**:
  * Instantiates nodes from prefab pools and runs entry animations simultaneously.
* **`FastAction_Sharing`**:
  * Multi-target action broadcaster executing identical action curves across multiple target nodes without duplicate tween allocations.

---

### 3.2. Synchronization Utilities (`assets/scripts/Sync/`)

* **`Sync_Position`**:
  * Copies world position from an `origin` node to one or more `targets`.
  * Useful for floating UI elements, health bars, damage indicators following game entities, or shadow anchors.
* **`Sync_UITransform`**:
  * Listens to `Node.EventType.TRANSFORM_CHANGED` on an origin `UITransform` and mirrors its `contentSize` and `anchorPoint` to targets.
  * Essential for dynamic containers, 9-slice background auto-fitting, and responsive overlays.

---

### 3.3. Smart Controllers & Timers

* **`Smart_NodeController` (`assets/scripts/Smart/Smart.NodeController.ts`)**:
  * Groups an array of `Node` references.
  * Exposes simple bulk operations: `active()` and `inactive()`.
  * Ideal for binding to UI buttons, tabs, screen switchers, or event drivers.
* **`Smart_Percentage_Updater` (`assets/scripts/Smart/Smart.Percentage.Updater.ts`)**:
  * Normalizes numerical inputs into percentages `[0.0, 1.0]` and drives progress bars, scale bars, or color gradients accordingly.
* **`Tick_CountDown` (`assets/scripts/Tick/Tick.CountDown.ts`)**:
  * High-precision countdown timer.
  * Dispatches `Event_Flexer` events on each second tick, pause, resume, and upon reaching zero.
  * Integrates with `Smart.Label` to show formatted timers (e.g. `02:45`).

---

## 4. Usage Example

### Declarative Inspector Setup:
1. Attach `FastAction_Moving` to a popup dialog node.
2. Set `target` to the Dialog root node.
3. Set `easing` to `backOut`, `duration` to `0.35s`, and initial position to `(0, -1000, 0)`.
4. The popup automatically plays its entry bounce when enabled!

### Script-driven Trigger:
```typescript
import { _decorator, Component } from 'cc';
import { FastAction_Moving } from 'db://pts-action/scripts/FastAction/Resources/FastAction.Moving';

const { ccclass, property } = _decorator;

@ccclass('ChestRewardController')
export class ChestRewardController extends Component {
    @property({ type: FastAction_Moving })
    public rewardFlyAction: FastAction_Moving = null;

    public onChestOpened() {
        this.rewardFlyAction?.execute();
    }
}
```

---

## 5. Integration with `pts-core`

`pts-action` relies on `pts-core` for:
* `Smart_StartUp`: Base lifecycle management (triggering on `start`, `onEnable`, or manual execution).
* `pConst.GROUPS`: Clean property inspector grouping (`CORE`, `SETTINGS`, etc.).
* `Event_Flexer`: Flexible event dispatching from timers and completion callbacks.
