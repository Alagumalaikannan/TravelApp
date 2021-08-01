import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  currentSysDate: any;
  actualEndDate: any;
  remainingDays: number;
  remainingHours: any;
  totalHours: any;
  remainingMinutes: any;
  totalMinutes: any;
  remainingSeconds: any;
  totalSeconds: any;
  betweenDays: any;
  citiesWeather: any = [];
  featureDestination: any = [];
  TravelForm: FormGroup;
  submitted = false;
  success: string = '';
  constructor(
    private CommonService: CommonService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.daysBetweenDates();
    this.betweenDays = setInterval(() => {
      this.daysBetweenDates();
    }, 1000);
    this.fetchCityWeather();
    this.fetchFeatureDestination();
    
    /* Travel Form Validation */
    this.TravelForm = this.formBuilder.group({
      yourName: ['', Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ['', [Validators.required, Validators.email]]
     });
  }

  get f() { return this.TravelForm.controls; }

  /* Travel Form Submit */
  onSubmit() {
      this.submitted = true;
      if (this.TravelForm.invalid) {
          return;
      } else {
        this.submitted = false;
        this.TravelForm.reset();
        this.success = 'We hear you! We will get back to you for planning your vacation.';
        return this.success;
      }
  }

  ngOnDestroy() {
      clearInterval(this.betweenDays);
  }

  /* End Date Countdown Timer Calculation */
  daysBetweenDates() {
    var currentDate = new Date();
    var endDate = new Date('08/08/2021 18:00');
    this.currentSysDate = currentDate;
    this.actualEndDate = endDate;
    this.totalSeconds = Math.floor((this.actualEndDate - (this.currentSysDate))/1000);
    this.totalMinutes = Math.floor(this.totalSeconds/60);
    this.totalHours = Math.floor(this.totalMinutes/60);
    this.remainingDays = Math.floor(this.totalHours/24);
    this.remainingHours = this.totalHours - (this.remainingDays * 24);
    this.remainingMinutes = this.totalMinutes - ( this.remainingDays * 24 * 60 ) - ( this.remainingHours * 60 );
    this.remainingSeconds = this.totalSeconds - ( this.remainingDays * 24 * 60 * 60 ) - ( this.remainingHours * 60 * 60 ) - ( this.remainingMinutes * 60 );
  }
  
  /* Section wise Navigation in Page */
  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  /* Calling City Weather API */
  fetchCityWeather() {
    this.CommonService.getCityWeather().subscribe((res) => {
        this.citiesWeather = res;
      });
  }

  /* Calling Feature Destinations API */
  fetchFeatureDestination(){
    this.CommonService.getFeatureDestinations().subscribe((res) => {
      this.featureDestination = res;
    });
  }
}
