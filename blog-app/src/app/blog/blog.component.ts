import { Component, OnInit } from '@angular/core';
import { BlogService } from '../shared/blog.service';
import { Blog } from '../shared/blog.model';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],

  // to inject the blogservice use this below
  providers: [ BlogService, Blog ]
})
export class BlogComponent implements OnInit {
  blog: Blog; // form for update blogs
  blogs: any; // array of all blogs
  showModal = false;
  data: any;

  //model se le aaya baaki
  _id: string;
  title: string;
  author: string;
  email: string;
  body: string;
  hidden: boolean;
  meta: object;
  votes: number;
  likes: number;
  dislikes: number;



  // Dependency Injection
  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.blogService.getAllBlogs()
      .subscribe( blogs => this.blogs = blogs);
      /* or
           subscribe((blogs) => {
                 this.blogs = blogs;
             }); */
  }

  dateConverter(inputBlogDate) {
    let inputDate = new Date(inputBlogDate);
    return inputDate.toDateString();
  }

  deleteBlog(id) {
    this.blogService.deleteBlogById(id).subscribe();
    this.ngOnInit();
  }

  onSubmitBlog(f) {
    console.log('inside onSubmitBlog...........' + JSON.stringify(f));
    this.blogService.addBlog(f).subscribe();
    this.ngOnInit();
  }


}
