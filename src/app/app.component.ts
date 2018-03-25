import { Component , OnInit, OnDestroy } from '@angular/core';
import { RunService } from './service/run.service';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  baseRunData = [];
  selectedBaseRunData = [1, 2, 8];

  msgs: string[] = [];


  get$: Subscription;
  edit$: Subscription;

  constructor(private runService: RunService) {
  }

  ngOnInit(): void {
      this.get$ = this.runService.getBaseRun().subscribe(
        runData => this.baseRunData = runData,
          error => this.showError(error)
      );
  }

  ngOnDestroy() {
      this.get$.unsubscribe();
      this.edit$.unsubscribe();
  }

  saveBaseRun() {
    // update
    this.edit$ = this.runService.updateBaseRun(this.selectedBaseRunData)
    .finally(() => {
        // this.selectedBaseRunData = null;
    })
    .subscribe(
        (runData: number[]) => {
            this.baseRunData = runData;
            this.showSuccess('Base Run was successfully created');
        },
        error => this.showError(error)
    );
    
  }


  private showError(errMsg: string) {
    this.msgs = [];
    //this.msgs.push({severity: 'error', summary: 'Sorry, an error occurred', detail: errMsg});
    this.msgs.push('error');
  }

  private showSuccess(successMsg: string) {
    this.msgs = [];
    this.msgs.push('success');
  }
}
