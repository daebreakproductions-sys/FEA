import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tag } from '@app/models/tag';
import { TipType } from '@app/models/tip-type.enum'
import { TagService } from '@app/services/tag.service';
import { TipService } from '@app/services/tip.service';
import { ActionSheetController } from '@ionic/angular';
import { getAllEnumEntries} from 'enum-for'
import { debounceTime } from 'rxjs/operators';
import { Tip } from '@app/models/tip';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { SwiperContainer } from 'swiper/element';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-tips',
  templateUrl: './add-tips.page.html',
  styleUrls: ['./add-tips.page.scss'],
})
export class AddTipsPage implements OnInit {
  @ViewChild('slider', {read: ElementRef}) slider: ElementRef<SwiperContainer>;
  swiperModules = [IonicSlides];
  public tipForm: UntypedFormGroup;
  public validation_messages;
  public types: {val: number, show: string}[] = [];

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };
  public nextButton = {
    text: 'Location',
    show: true,
    disabled: true
  }
  public prevButton = {
    text: 'Title',
    show: false,
    disabled: false
  }
  public showSaveButton: boolean = false;

  public tip: Tip;
  public tags: Tag[];
  public tagStrings: string[] = [];

  constructor(
    public formBuilder: UntypedFormBuilder,
    public tagService: TagService,
    public router: Router,
    public tipService: TipService,
    public actionSheetController: ActionSheetController,
  ) { 
    this.tipForm = AddTipsPage.newTipForm();
    this.validation_messages = AddTipsPage.validation_messages;
    getAllEnumEntries(TipType).forEach(type => {
      this.types.push({
        val: Number(type[1]),
        show: type[0]
      })
    });
  }
  public static validation_messages = {
    'type': [
      { type: 'required', message: 'Tip type is required.' }
    ],
    'description': [
      { type: 'required', message: 'A description of this tip is required.' }
    ],
  };

  public static newTipForm() {
    return new UntypedFormGroup({
      type: new UntypedFormControl('',Validators.compose([
        Validators.required,
      ])),
      description: new UntypedFormControl('',Validators.compose([
        Validators.required,
      ])),
    });
  }
  ngOnInit() {
    this.resetTip();
  }
  ionViewWillEnter() {
    // Reset the form in case it has already been used
    this.tipForm.reset();
    this.resetTip();
  }
  resetTip() {
    this.tip = {
      text: null,
      tipType: null,
      image64: null,
    };
  }
  ngAfterViewInit() {
    for(let control in this.tipForm.controls) {
      let form: AbstractControl = this.tipForm.controls[control];
      form.statusChanges
        .pipe(debounceTime(400))
        .subscribe(() => {
          setTimeout(() => {
            this.slider.nativeElement.swiper.updateAutoHeight(225);
            this.updateSlideUI();
          }, 25);
        });
    }
    this.updateSlideUI();
  }

  updateTags(tags: Tag[]) {
    this.tags = tags;
    this.updateHeight();
  }
  loadTags() {
    this.tagStrings = [this.tipForm.get('description').value];
  }

  selectImage() {
    const options: ImageOptions = {
      quality: 100,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    }
    Camera.getPhoto(options).then((imageData) => {
      this.tip.image64 = imageData.base64String;
      this.updateSlideUI();
    }, (err) => {
      // Handle error
      console.log(err)
    });
  }  

  saveTip = (): void => {
    let newTip = {
      tipType: this.tipForm.get('type').value,
      text: this.tipForm.get('description').value,
      image: this.tip.image64,
    }
    this.tipService.create(newTip).then( async tip => {
      if(this.tags) {
        for (let index = 0; index < this.tags.length; index++) {
          const tag = this.tags[index];
          await this.tagService.tagItem(Number(tip.id), tag);
        }
      }
      this.router.navigate(['tabs/me/tips']);
    });
  }

  updateHeight() {
    setTimeout(() => {
      this.slider.nativeElement.swiper.updateAutoHeight(225);
      this.updateSlideUI();
    }, 25);
  }
  updateSlideUI() {
    console.log(this.slider)
    let slideNumber = this.slider.nativeElement.swiper.activeIndex;
    // Determine lock/unlock for slides
    let locked = false;
    switch(slideNumber) {
      case 0:
        // Type
        locked = !this.checkStep1();
        this.nextButton.text = 'Description';
        break;
      case 1:
        // Description
        locked = !this.checkStep2();
        this.prevButton.text = 'Type';
        this.nextButton.text = 'Picture';
        break;
      case 2:
        // Picture
        setTimeout(() => {
          this.slider.nativeElement.swiper.updateAutoHeight(175);
        }, 75);
        locked = !this.checkStep3();
        this.prevButton.text = 'Description';
        this.nextButton.text = 'Tags';
        break;
      case 3:
        // Tags
        this.loadTags();
        setTimeout(() => {
          this.slider.nativeElement.swiper.updateAutoHeight(225);
        }, 25);
        locked = !this.checkStep4();
        this.prevButton.text = 'Picture';
        break;
    }
    this.slider.nativeElement.swiper.allowSlideNext = !locked;
    this.nextButton.disabled = locked;
    this.prevButtonVisible(slideNumber);
    this.nextButtonVisible(slideNumber);
    this.saveButtonVisible(slideNumber);
  }
  prevButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 0:
        this.prevButton.show = false;
        break;
      default:
        this.prevButton.show = true;
    }
  }
  nextButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 3:
        this.nextButton.show = false;
        break;
      default:
        this.nextButton.show = true;
    }
  }
  saveButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 3:
        this.showSaveButton = true;
        break;
      default:
        this.showSaveButton = false;
    }
  }

  nextClick() {
    if(!this.nextButton.disabled) {
      this.slider.nativeElement.swiper.slideNext();
    }
  }
  prevClick() {
    if(!this.prevButton.disabled) {
      this.slider.nativeElement.swiper.slidePrev();
    }
  }
  // These all return true if they are valid
  checkStep1(): boolean {
    // Type
    return this.tipForm.controls['type'].valid;
  }
  checkStep2(): boolean {
    // Description
    return this.tipForm.controls['description'].valid;;
  }
  checkStep3(): boolean {
    // Image
    return true;
  }
  checkStep4(): boolean {
    // Tags
    return true;
  }

}
