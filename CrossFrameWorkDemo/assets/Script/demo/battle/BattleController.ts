import BaseController from "../../cfw/mvc/BaseController";
import BattleManager from "./BattleManager";
import ModuleManager, { ModuleID } from "../module/ModuleManager";
import { UIIndex } from "../../cfw/tools/Define";


export default class BattleController extends BaseController {


    private static ins: BattleController;

    static instance() {
        if (!this.ins) {
            this.ins = new BattleController()
        }
        return this.ins;
    }

    intoLayer() {
        ModuleManager.setModuleID(ModuleID.GAME)
        this.pushView('Prefab/BattleView', "BattleView", new BattleManager(), ModuleManager.getLoader(),UIIndex.ROOT)
    }
}
