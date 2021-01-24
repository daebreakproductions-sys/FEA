import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tag } from '@app/models/tag';
import { TipType } from '@app/models/tip-type.enum'
import { TagService } from '@app/services/tag.service';
import { TipService } from '@app/services/tip.service';
import { IonSearchbar, IonSlides } from '@ionic/angular';
import * as keyword_extractor from 'keyword-extractor'
import {getAllEnumKeys, getAllEnumValues, getAllEnumEntries} from 'enum-for'
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-tips',
  templateUrl: './add-tips.page.html',
  styleUrls: ['./add-tips.page.scss'],
})
export class AddTipsPage implements OnInit {
  @ViewChild(IonSlides) slider: IonSlides;
  @ViewChild('search') searchBar: IonSearchbar;
  public tipForm: FormGroup;
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

  public associatedTags: {
    selected: boolean,
    tag: Tag
  }[];
  public searchTags: {
    selected: boolean,
    tag: Tag
  }[];
  public tagSearchTerm: string = '';

  constructor(
    public formBuilder: FormBuilder,
    public tagService: TagService,
    public router: Router,
    public tipService: TipService,
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
    return new FormGroup({
      type: new FormControl('',Validators.compose([
        Validators.required,
      ])),
      description: new FormControl('',Validators.compose([
        Validators.required,
      ])),
    });
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    // Reset the form in case it has already been used
    this.tipForm.reset();
    this.associatedTags = null;
    this.searchTags = null;
    this.tagSearchTerm = null;
    this.searchBar.value = null;
  }
  ngAfterViewInit() {
    for(let control in this.tipForm.controls) {
      let form: AbstractControl = this.tipForm.controls[control];
      form.statusChanges
        .pipe(debounceTime(400))
        .subscribe(() => {
          setTimeout(() => {
            this.slider.updateAutoHeight(225);
            this.updateSlideUI();
          }, 25);
        });
    }
    this.updateSlideUI();
  }

  readonly extractorOpts = {
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: false
  };
  loadTags() {
    if(this.associatedTags == null) {
      this.associatedTags = [];
      let titleKeywords: string[] = keyword_extractor.extract(this.tipForm.controls['description'].value,this.extractorOpts);
      console.log(titleKeywords);
      titleKeywords.forEach(keyword => {
        this.tagService.search(keyword).forEach(tag => {
          this.associatedTags.push({
            selected: false,
            tag: tag
          });
        });
      });
    }
  }
  toggleTag(id: number) {
    this.associatedTags.forEach(entry => {
      if(Number(entry.tag.id) == id) {
        entry.selected = !entry.selected;
      }
    })
  }
  searchTag(searchEvent: any) {
    if(searchEvent.target.value) {
      this.tagSearchTerm = searchEvent.target.value;
      this.searchTags = this.tagService.search(searchEvent.target.value).map( (val: Tag) => {
        return { selected: false, tag: val };
      });
    } else {
      this.tagSearchTerm = null;
      this.searchTags = null;
    }
    this.updateSlideUI();
  }
  chooseSearchTag(id: number) {
    let tagIndex: number = this.searchTags.findIndex(which => which.tag.id == id);
    let tag: Tag = this.searchTags.slice(tagIndex, tagIndex + 1)[0].tag;
    this.associatedTags.unshift({selected: true, tag: tag});
    this.eliminateDuplicateTags();
    this.updateSlideUI();
  }
  eliminateDuplicateTags() {
    let temp: { selected: boolean, tag: Tag }[] = [];
    this.associatedTags.forEach(item => {
      if(!temp.some(test => {
        return test.tag.id == item.tag.id;
      })) {
        temp.push(item);
      }
    });
    this.associatedTags = temp;
  }
  newTag(term: string) {
    this.tagService.create(term).then((tag) => {
      this.associatedTags.push({
        selected: true,
        tag: tag
      });
      this.updateSlideUI();
    });
  }

  saveTip() {
    let newTip = {
      type: this.tipForm.get('type').value,
      text: this.tipForm.get('description').value,
    }
    this.tipService.create(newTip).then(tip => {
      this.associatedTags.filter(tag => {
        return tag.selected;
      }).forEach(tag => {
        this.tagService.tagItem(tip.id, tag.tag);
      });
      this.router.navigate(['tabs/me']);
    });
  }

  updateSlideUI() {
    this.slider.getActiveIndex().then(slideNumber => {
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
          this.nextButton.text = 'Tags';
          break;
        case 2:
          // Tags
          this.loadTags();
          setTimeout(() => {
            this.slider.updateAutoHeight(225);
          }, 25);
          locked = !this.checkStep3();
          this.prevButton.text = 'Description';
          break;
      }
      this.slider.lockSwipeToNext(locked);
      this.nextButton.disabled = locked;
      this.prevButtonVisible(slideNumber);
      this.nextButtonVisible(slideNumber);
      this.saveButtonVisible(slideNumber);
    });
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
      case 2:
        this.nextButton.show = false;
        break;
      default:
        this.nextButton.show = true;
    }
  }
  saveButtonVisible(slideNumber: number) {
    switch(slideNumber) {
      case 2:
        this.showSaveButton = true;
        break;
      default:
        this.showSaveButton = false;
    }
  }

  nextClick() {
    if(!this.nextButton.disabled) {
      this.slider.slideNext();
    }
  }
  prevClick() {
    if(!this.prevButton.disabled) {
      this.slider.slidePrev();
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
    // Tags
    return true;
  }

}
