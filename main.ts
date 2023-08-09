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
	private typoBox: HTMLElement | null = null; // Updated property name

	private options: string[] = ['Option 1', 'Option 2', 'Option 3']; // List of options

    private currentOptionIndex: number = 0; // Index of the currently selected option


	async onload() {
		await this.loadSettings();

		let boxOpen = false;
		// Register the hotkey
        this.addCommand({
            id: 'intelliTypo-open-hotkey',
            name: 'Open IntelliTypo Hotkey',
            callback: () => {
				if (boxOpen) {
					console.log("Closing Box")
                    this.closetypoBox(); // Close the box if it's open
					boxOpen = false;
                } else {
					console.log("Opening Box")
                    this.opentypoBox(); // Open the box if it's closed
					boxOpen = true;
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

	opentypoBox() {
		const editor = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!editor) return;

		const cursorPosition = editor.editor.getCursor();

		// Create the floating box element
		this.typoBox = document.createElement('div');
		this.typoBox.className = 'TypoBox';
		this.typoBox.innerText = 'Your text here';

		// Style the floating box
		this.typoBox.style.position = 'absolute';
		this.typoBox.style.border = '1px solid #ccc';
		this.typoBox.style.padding = '10px';
		this.typoBox.style.background = 'white';
		this.typoBox.style.zIndex = '9999';
		this.typoBox.style.position = 'fixed';

		// Calculate the position relative to the viewport
        const left = cursorPosition.ch + window.scrollX + 600;
        const top = cursorPosition.line + window.scrollY + 140;

		this.typoBox.style.left = left + 'px';
		this.typoBox.style.top = top + 'px';



		document.addEventListener('keydown', this.handleKeyDown);


		// Append the box to the editor
		document.body.appendChild(this.typoBox);

		// let scrollInfo= editor.editor.getScrollInfo
		// scrollInfo
	}

	closetypoBox() {
        if (this.typoBox) {
            document.body.removeChild(this.typoBox); // Remove the box from the document
            this.typoBox = null; // Clear the reference
			document.removeEventListener('keydown', this.handleKeyDown);
        }
	}

	handleKeyDown = (event: KeyboardEvent) => {

		// Prevent default behavior of arrow keys (up and down)
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
        }

        // Respond to keyboard inputs
        switch (event.key) {
            case 'ArrowUp':
                this.navigateOptions(-1); // Move to the previous option
                break;
            case 'ArrowDown':
                this.navigateOptions(1); // Move to the next option
                break;
            // Add more cases to handle other keys if needed
        }
    }

	navigateOptions(direction: number) {
        this.currentOptionIndex = (this.currentOptionIndex + direction + this.options.length) % this.options.length;
        if (this.typoBox) {
            this.typoBox.innerText = this.options[this.currentOptionIndex];
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
