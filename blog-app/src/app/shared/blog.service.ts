import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';

import {Blog} from './blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  selectedBlog: Blog; // form for update blogs
  blogs: Blog[]; // array of all blogs
  constructor() { }
}
