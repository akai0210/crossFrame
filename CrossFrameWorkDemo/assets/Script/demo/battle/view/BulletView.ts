import RoleView from "./RoleView";
import PoolManager from "../../../cfw/pool/PoolManager";
import { MOVE_DIR } from "../../../cfw/tools/Define";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletView extends RoleView {

    static CLASS_NAME: string = 'BulletView'


    start() {

    }
    kill() {
        this.node.opacity = 0;
        PoolManager.instance().put(BulletView.CLASS_NAME, this)
    }
    // update (dt) {}
    updateObj(dt: number) {

        super.updateObj(dt)

        let y = this.node.y;
        y += this.getSpeed() * dt * MOVE_DIR[this.moveDir];
        this.node.y = y;

    }

    getSpeed() {
        return 300
    }
}
