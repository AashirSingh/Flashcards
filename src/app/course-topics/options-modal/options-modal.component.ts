import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-options-modal',
  templateUrl: './options-modal.component.html',
  styleUrls: ['./options-modal.component.scss']
})
export class OptionsModalComponent {

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  selectOption(mode: string) {
    // Here you can handle the action when an option is selected
    console.log(`Selected option: ${mode}`);
    this.closeModal();
  }
}
