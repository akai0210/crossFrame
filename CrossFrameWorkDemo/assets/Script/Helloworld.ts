import BattleController from "./demo/battle/BattleController";
import ModuleManager from "./demo/module/ModuleManager";
import UIManager from "./cfw/ui/UIManager";
import { UIIndex } from "./cfw/tools/Define";
import SingleManager from "./cfw/ui/SingleManager";
import StackLayerManager from "./cfw/ui/StackLayerManager";
import QueueLayerManager from "./cfw/ui/QueueLayerManager";
import LangManager from "./cfw/lang/LangManager";
import { ResType } from "./cfw/res/ResInterface";
import ResItem from "./cfw/res/ResItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {



    @property(cc.JsonAsset)
    gameData: cc.JsonAsset = null;

    onLoad() {
        ModuleManager.init('CrossFrameWork')

        ModuleManager.dataManager.addFile(this.gameData)


        let lang = 'en'
        let langFileName = 'game_lang_' + lang;
        ModuleManager.publicLoader().loadRes('data/' + langFileName, ResType.Json, (err, item: ResItem) => {
            if (err || !cc.isValid(this.node)) {
                return;
            }
            // 2 添加数据到管理器
            ModuleManager.dataManager.addFile(item.getRes(), langFileName)
            // 3 将语言数据添加到语言管理器
            LangManager.instance().setLang(lang, ModuleManager.dataManager.get(langFileName))
        })
    }

    start() {




        //初始化5层管理器。不明白的请翻阅教程。
        UIManager.instance().init(this.node)
        UIManager.instance().setManager(UIIndex.ROOT, new SingleManager(1, false))
        UIManager.instance().setManager(UIIndex.STACK, new StackLayerManager(10, true))
        UIManager.instance().setManager(UIIndex.QUEUE, new QueueLayerManager(100, true))
        UIManager.instance().setManager(UIIndex.TOAST, new StackLayerManager(200, false))
        UIManager.instance().setManager(UIIndex.TOP, new StackLayerManager(300, false))
    }

    onButtonEnterGameClick() {
        BattleController.instance().intoLayer()
    }
}
