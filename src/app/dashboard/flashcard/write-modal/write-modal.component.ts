import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-write-modal',
  templateUrl: './write-modal.component.html',
  styleUrls: ['./write-modal.component.scss'],
})
export class WriteModalComponent implements AfterViewInit {
  @ViewChild('drawingCanvas', { static: false }) drawingCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  constructor(private modalController: ModalController) {}

  ngAfterViewInit(): void {
    if (this.drawingCanvas) {
      this.ctx = this.drawingCanvas.nativeElement.getContext('2d')!;
      this.initializeCanvas();
    }
  }

  // Initialize canvas for drawing
  initializeCanvas() {
    const canvas = this.drawingCanvas.nativeElement;
    this.ctx.strokeStyle = '#ffffff';  // Set the stroke color to white
    this.ctx.lineWidth = 2;
  
    let drawing = false;
  
    const startDrawing = (event: MouseEvent) => {
      drawing = true;
      draw(event); // Call the draw function
    };
  
    const stopDrawing = () => {
      drawing = false;
      this.ctx.beginPath(); // Begin a new path to start a new line when the mouse is clicked again
    };
  
    const draw = (event: MouseEvent) => {
      if (!drawing) return;
  
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;   // Scale factor for horizontal
      const scaleY = canvas.height / rect.height; // Scale factor for vertical
  
      const offsetX = (event.clientX - rect.left) * scaleX;
      const offsetY = (event.clientY - rect.top) * scaleY;
  
      this.ctx.lineTo(offsetX, offsetY);
      this.ctx.stroke();
      this.ctx.beginPath(); // Begin a new path so the line is continuous
      this.ctx.moveTo(offsetX, offsetY);
    };
  
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);
  }
  

  // Submit the drawing for evaluation
  submitDrawing() {
    const canvas = this.drawingCanvas.nativeElement;
    const dataURL = canvas.toDataURL();  // Convert the drawing to an image data URL
    console.log('Submitting drawing:', dataURL);
    // Handle the submission logic here
    this.dismiss();  // Close the modal after submission
  }

  // Clear the drawing canvas
  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.drawingCanvas.nativeElement.width, this.drawingCanvas.nativeElement.height);
    }
  }

  // Dismiss the modal
  dismiss() {
    this.modalController.dismiss();
  }
}