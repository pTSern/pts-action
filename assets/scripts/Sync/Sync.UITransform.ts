import { _decorator, Node, Component, UITransform } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Sync_UITransform')
export class Sync_UITransform extends Component {
    @property({ type: UITransform })
    protected _origin: UITransform = null;

    @property({ type: UITransform })
    get origin() { return this._origin; }
    set origin(value: UITransform) {
        if(this._origin === value) return;
        if(this._origin) {
            this._origin.node.off(Node.EventType.TRANSFORM_CHANGED, this._onTransformChanged, this);
        }
        this._origin = value;

        this._apply();
    }

    @property({ type: UITransform })
    targets: UITransform[] = [];

    protected onLoad(): void {
        this._apply();
    }

    protected _apply() {
        this._origin.node.on(UITransform.EventType.SIZE_CHANGED, this._onTransformChanged, this);
        this._onTransformChanged();
    }

    protected _onTransformChanged() {
        this.targets.forEach(_ => {
            _.setContentSize(this._origin.width, this._origin.height);

        })
    }
}
