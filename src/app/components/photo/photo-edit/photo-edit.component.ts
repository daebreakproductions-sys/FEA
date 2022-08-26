import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';

@Component({
  selector: 'eats-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.scss'],
})
export class PhotoEditComponent implements OnInit {
  @Input() image64: String;
  @Output() photoUpdatedEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  sendUpdate(image64: string) {
    this.photoUpdatedEvent.emit(image64);
  }

  selectImage() {
    const options: ImageOptions = {
      quality: 100,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    }
    Camera.getPhoto(options).then((imageData) => {
      this.sendUpdate(imageData.base64String);
    }, (err) => {
      // Handle error
      console.log(err)
    });
  }  

}
