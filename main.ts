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


		// Register a global keydown event listener for the hotkey
        this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
            if (isHotkeyPressed(evt, this.settings.openWindow)) {
                // The hotkey has been pressed, implement your behavior here
                showIntelliTypoWindow();
            }
        });



		function isHotkeyPressed(event : KeyboardEvent, hotkey : string) {
			console.log(hotkey)
			const keys = hotkey.split('+');
			const pressedKeys = keys.map((key) => key.trim().toLowerCase());
	
			for (const pressedKey of pressedKeys) {
				if (!event[`${pressedKey}Key`]) {
					return false;
				} else {
					return true;
				}
			}
	
			return true;
		}





		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: IntelliTypo;

	constructor(app: App, plugin: IntelliTypo) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// Add a hotkey setting
        new Setting(containerEl)
            .setName('Open IntelliTypo Window')
            .setDesc('Set the hotkey to open the IntelliTypo window')
            .addText((text) =>
                text
                    .setPlaceholder('Click to set')
                    .setValue(this.plugin.settings.openWindow)
                    .onChange(async (value) => {
                        this.plugin.settings.openWindow = value;
                        await this.plugin.saveSettings();
                    })
            );


	}
}
