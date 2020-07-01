import XlsxData from "../cfw/xlsx/XlsxData";
import ModuleManager from "../demo/module/ModuleManager";
import LangManager from "../cfw/lang/LangManager";
import { Ui_dataEnum } from "./GameEnumConfig";

export default class UIText {

    private static ins: UIText;

    static instance() {
        if (!this.ins) {
            this.ins = new UIText()
        }
        return this.ins;
    }

    private uiData: XlsxData;

    constructor() {
        this.uiData = ModuleManager.dataManager.get('ui_data')
    }

    getText(id: any, opt?) {
        let content = this.uiData.getValue(id, Ui_dataEnum.content);
        console.log(' content ',content)
        return LangManager.instance().getLocalString(content, opt)
    }
}
