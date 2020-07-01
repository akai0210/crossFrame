

import Module from "./Module";
import XlsxDataManager from "../../cfw/xlsx/XlsxDataManager";

//模块id
export enum ModuleID {
    LOGIN,
    LOADING,
    GAME,
    LOBBY,
    PUBLIC,
    MAX
}

export default class ModuleManager {


    private static mgrMap: Module[] = []

    private static moduleID: ModuleID = ModuleID.LOADING;


    static dataManager: XlsxDataManager;
    
    static init(projectName: string) {
        for (let index = 0; index < ModuleID.MAX; index++) {
            this.mgrMap[index] = new Module(projectName + index);
        }
        this.dataManager = new XlsxDataManager()
    }

    static getAudio(id: ModuleID = this.moduleID) {
        return this.mgrMap[id].getAudio()
    }

    static publicAudio() {
        return this.mgrMap[ModuleID.PUBLIC].getAudio()
    }

    static publicLoader() {
        return this.mgrMap[ModuleID.PUBLIC].getLoader()
    }


    static setModuleID(id: ModuleID) {
        this.moduleID = id;
    }
    static getLoader(id: ModuleID = this.moduleID) {
        return this.mgrMap[id].getLoader()
    }

}