/*:
 * @plugindesc Allows exporting and importing save data as JSON.
 * @author GPT
 *
 * @help
 * Adds menu options for "Export Save" and "Import Save".
 * Export downloads your current save as a JSON file.
 * Import loads a JSON file into your saves.
 */

(function() {
    const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        this.addCommand("Export Save", "exportSave");
        this.addCommand("Import Save", "importSave");
    };

    const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler("exportSave", this.commandExportSave.bind(this));
        this._commandWindow.setHandler("importSave", this.commandImportSave.bind(this));
    };

    Scene_Menu.prototype.commandExportSave = function() {
        const data = StorageManager.load(1); // Slot 1 by default
        if (data) {
            const blob = new Blob([data], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "dsaf_save.json";
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert("No save found in Slot 1!");
        }
        this.popScene();
    };

    Scene_Menu.prototype.commandImportSave = function() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    StorageManager.save(1, reader.result); // Save into Slot 1
                    alert("Save imported into Slot 1!");
                } catch (err) {
                    alert("Import failed: " + err);
                }
            };
            reader.readAsText(file);
        };
        input.click();
        this.popScene();
    };
})();
