import UIText from "../UIText";
import GlobalEvent from "../../cfw/event/GlobalEvent";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
export default class UILangComp extends cc.Component {


    @property
    uiID: string = '';


    start() {
        this.setText();
        GlobalEvent.instance().on(GlobalEvent.CHANGE_LANG,this.setText,this)
    }

    onDestroy(){
        GlobalEvent.instance().off(GlobalEvent.CHANGE_LANG,this.setText,this)
    }


    setText(){
        this.getComponent(cc.Label).string = UIText.instance().getText(this.uiID)
    }

}
