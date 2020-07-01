import BaseItemView from "../../../cfw/mvc/BaseItemView";
import CollideAble from "../../../cfw/interface/CollideAble";
import CollisionHelper from "../../../cfw/collide/CollisionHelper";
import Simulator from "../Simulator";
import { DIR } from "../../../cfw/tools/Define";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleView extends BaseItemView implements CollideAble {


    protected simulator: Simulator;


    protected faceDir: DIR = DIR.UP;;

    protected moveDir: DIR = DIR.UP;

    setFaceDir(d: DIR, f: boolean = true) {
        this.faceDir = d;
        if (f) {
            this.setMoveDir(d)
        }
    }

    getFaceDir() {
        return this.faceDir;
    }

    getMoveDir() {
        return this.moveDir;
    }

    setMoveDir(d: DIR) {
        this.moveDir = d;

    }

    setSimulator(s: Simulator) {
        this.simulator = s;
    }

    getSimulator() {
        return this.simulator;
    }

    @property(cc.Sprite)
    icon: cc.Sprite = null;



    protected quadIndex: number = 0;

    start() {

    }

    getRect(): cc.Rect {
        return this.node.getBoundingBox();
    }

    kill() {

    }

    canKill(): boolean {
        return true;
    }

    born() {
        this.node.opacity = 255;
    }

    isAlive() {
        return this.node.opacity == 255;
    }

    isVisible() {
        if (!this.isAlive()) {
            return false;
        }
        return this.checkVisible();
    }

    checkVisible() {
        let vsize = cc.view.getVisibleSize();
        if (CollisionHelper.isOutScreen(this.node.x, this.node.y, this.node.width, this.node.height, vsize.width, vsize.height)) {
            return false;
        }
        return true;
    }

    updateObj(dt: number) {

    }

    //获得对象的索引
    getQuadIndex(): number {
        return this.quadIndex;
    }

    //设置对象索引
    setQuadIndex(index: number) {
        this.quadIndex = index;
    }

    setPosition(x: number, y: number) {
        this.node.x = x;
        this.node.y = y;
    }
}
