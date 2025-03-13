import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from './service/contact.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  dbStatusMessage: string = '';
  alertMessage: string = ''; // This holds the alert message from form submission
  alertType: string = ''; // This determines if the alert is success or error
  email: string = 'ishmeet.singh.dev@gmail.com';
  showAlert: boolean = false; // Flag to toggle visibility of alert

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.checkDatabaseStatus();
  }

  checkDatabaseStatus() {
    this.contactService.checkDatabaseStatus().subscribe(
      (response) => {
        this.dbStatusMessage = response.message;
        this.showAlert = true;
      },
      (error) => {
        this.dbStatusMessage = "❌ Database Connection Failed!";
        this.showAlert = true;
      }
    );
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactService.sendMessage(this.contactForm.value).subscribe(
        (response) => {
          this.alertMessage = '✅ Message sent successfully!';
          this.alertType = 'success';
          this.showAlert = true;
          this.contactForm.reset();
        },
        (error) => {
          this.alertMessage = '❌ Failed to send message. Please try again.';
          this.alertType = 'danger';
          this.showAlert = true;
        }
      );
    } else {
      this.alertMessage = '❌ Please fill in all fields correctly.';
      this.alertType = 'danger';
      this.showAlert = true;
    }
  }
}
