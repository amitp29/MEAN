import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Blog } from './blog.model';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';
import { map } from "rxjs/operators"; 
// import 'rxjs/add/operator/toPromise';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private http: HttpClient) { }

  getAllBlogs() {/*
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    headers = headers.append('Access-Control-Allow-Origin', '*');
    headers = headers.append('Access-Control-Expose-Headers', 'X-Service-API-Version, X-Service-Name ');

    Access-Control-Allow-Headers:Content-Type, body
Access-Control-Allow-Methods:POST,PUT,DELETE
Access-Control-Allow-Origin:http://core.test
Access-Control-Expose-Headers:X-Service-API-Version, X-Service-Name */
    // tslint:disable-next-line: max-line-length
    return this.http.get('http://localhost:3000/getAllBlogs') //, {headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')})
      .pipe(map(res => res));
  }

  getBlogsByEmail(email) {
    return this.http.get('http://localhost:3000/getBlogsByEmail?email=' + email)
      .pipe(map(res => res));
  }

  getBlogById(id) {
    return this.http.get('http://localhost:3000/getBlogById/' + id)
      .pipe(map(res => res));
  }

  addBlogs(newBlog) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Access-Control-Allow-Origin', '*');

    return this.http.post('http://localhost:3000/addBlog', newBlog)
      .pipe(map(res => res));
  }

  deleteBlog(id) {
    return this.http.delete('http://localhost:3000/deleteBlogById/?id=' + id)
      .pipe(map(res => res));
  }

  updateBlog(id, updatedBlog) {
    return this.http.put('http://localhost:3000/updateBlogById/'+ id, updatedBlog)
      .pipe(map(res => res));
  }


}
