import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppGlobals} from '../../appGlobals';
import {FeedbackDataService} from '../../dataservices/feedback-data.service';
import {Subscription} from 'rxjs/Subscription';
import {Feedback} from '../../datamodels/feedback.model';

import '../../../../bower_components/las2peer-comment-widget/las2peer-comment-widget.html';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnDestroy {

  constructor() {
    /*var comments = document.getElementById("comments");
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4 && xhttp.status === 201) {
        console.log(xhttp.responseText);
        localStorage.setItem("thread", xhttp.responseText);
        comments.setAttribute("thread", localStorage.getItem("thread"));
      }
    };
    xhttp.open("POST", "http://134.61.177.168:8080/commentmanagement/threads", true);
    xhttp.setRequestHeader("Authorization", "Basic " + btoa("alice:pwalice"));
    xhttp.send('{owner:"alice",writer:"bobby",reader:"joey"}');*/
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
