import { Component, OnInit } from '@angular/core';

import { BlogService } from '../shared/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],

  // to inject the blogservice use this below
  providers: [BlogService]
})
export class BlogComponent implements OnInit {

  constructor(private blogService: BlogService) { }

  ngOnInit() {
  }

}
