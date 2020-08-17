import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
// import { Subscription } from "rxjs";

// import { ErrorService } from "./error.service";

@Component({
  templateUrl: "./error.component.html",
  selector: "app-error",
  styleUrls: ["./error.component.css"]
})
export class ErrorComponent {

  constructor( @Inject(MAT_DIALOG_DATA) public data: { message: string } ) {}
  
}
