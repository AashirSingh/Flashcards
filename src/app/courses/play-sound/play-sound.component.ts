import { Component } from '@angular/core';
import { Howl } from 'howler';  // Import Howler.js

@Component({
  selector: 'app-play-sound',
  templateUrl: './play-sound.component.html',
  styleUrls: ['./play-sound.component.scss']
})
export class PlaySoundComponent {

  private sound: Howl | null = null;

  constructor() {}

  playSound(fileUrl: string) {
    if (this.sound) {
      console.log("Stopping currently playing sound");
      this.sound.stop();  // Stop any currently playing sound
    }

    console.log("Initializing sound with file:", fileUrl);
    
    this.sound = new Howl({
      src: ['assets/sounds/4209177_livepiano__01c0_om-elo.wav'],  // Ensure the correct file path is provided here
      html5: true,     // Use HTML5 audio for larger file support
      onload: () => {
        console.log("Sound loaded successfully");
      },
      onplayerror: (error:any) => {
        console.error("Error while trying to play the sound:", error);
      },
      onplay: () => {
        console.log("Sound is playing");
      },
      onloaderror: (error:any) => {
        console.error("Failed to load sound:", error);
      }
    });

    this.sound.play();  // Play the sound
  }
}
