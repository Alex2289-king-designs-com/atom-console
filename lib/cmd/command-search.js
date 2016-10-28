'use babel';

fs = require('fs');

// Tool to search for commands
export default class CommandSearch {

    constructor() {
        this.isInteractive = true;
        this.method = "search";
        this.prefix = "Search for command:  ";
        this.COMMANDS = Object.keys(atom.commands.registeredCommands).concat(Object.keys(require('../command/aliases')));
        this.specialOutput = '\b';
        this.clearConsoleAfterSubmit = true;
    }

    search(term) {
            let results = [];
            for (let cmd in this.COMMANDS) {
                if (this.COMMANDS.hasOwnProperty(cmd)) {
                    if (this.COMMANDS[cmd].match(new RegExp(term), "gi")) {
                        results.push(this.COMMANDS[cmd]);
                    }
                }
            }

            if (!results.length || !term.length) {
                this.specialOutput = false;
            } else {
              this.specialOutput = '\b';
                atom.workspace.open("Command Search Results.md").then(function() {
                            let editor = atom.workspace.getActiveTextEditor()
                            editor.insertText(`# Search Results\n\n__Search Term: *${term}* __\n\n`);
                            for (let r in results) {
                                editor.insertText(`* ${results[r].replace(term, `__${term}__`)}\n\n`);
        }
        atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), "markdown-preview:toggle");
        editor.getBuffer().save();
        atom.workspace.getActivePane().destroyItem();

        fs.unlink(editor.getPath(), function(err){
          if (err) {
            throw err;
          }
        });
          this.specialOutput = '\b';
      }, function() {
        console.log("Command Search failed!");
      });
    }
  }

}