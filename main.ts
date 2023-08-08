import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface IntelliTypoSettings {
	openWindow: string;
}

const DEFAULT_SETTINGS: IntelliTypoSettings = {
	openWindow: 'Option + Enter'
}

export default class IntelliTypo extends Plugin {
	settings: IntelliTypoSettings;

	async onload() {
		await this.loadSettings();


		// Register the hotkey
        this.addCommand({
            id: 'intelliTypo-open-hotkey',
            name: 'Open IntelliTypo Hotkey',
            callback: () => {
				if (this.floatingBox) {
					console.log("Closing Box")
                    this.closeFloatingBox(); // Close the box if it's open
                } else {
					console.log("Opening Box")
                    this.openFloatingBox(); // Open the box if it's closed
                }
			},
        });




		this.addSettingTab(new SettingsTab
		(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	openFloatingBox() {
		const editor = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!editor) return;

		const cursorPosition = editor.editor.getCursor();

		// Create the floating box element
		const floatingBox = document.createElement('div');
		floatingBox.className = 'my-plugin-floating-box';
		floatingBox.innerText = 'Your text here';

		// Style the floating box
		floatingBox.style.position = 'absolute';
		floatingBox.style.border = '1px solid #ccc';
		floatingBox.style.padding = '10px';
		floatingBox.style.background = 'white';
		floatingBox.style.zIndex = '9999';

		// Append the box to the editor
		document.body.appendChild(floatingBox);

		// Position the box above the cursor
		floatingBox.style.left = cursorPosition.ch + 100 + 'px';
		floatingBox.style.top = cursorPosition.line - floatingBox.clientHeight + 100 + 'px';
	}

	closeFloatingBox() {
        if (this.floatingBox) {
            document.body.removeChild(this.floatingBox); // Remove the box from the document
            this.floatingBox = null; // Clear the reference
        }
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TypoModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
        const { contentEl } = this;

        // Create the content of your modal
        const textBox = document.createElement('div');
        textBox.className = 'my-plugin-modal-text-box';
        textBox.innerText = 'Your text here';

        // Append the content to the modal
        contentEl.appendChild(textBox);
    }

    onClose() {
        // Clean up or perform actions when the modal is closed
    };
	}


class SettingsTab extends PluginSettingTab {
	plugin: IntelliTypo;

	constructor(app: App, plugin: IntelliTypo) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();
	}
}
