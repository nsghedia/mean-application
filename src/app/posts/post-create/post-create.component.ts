import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IPost } from 'src/app/Models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  ErrorContent = 'Enter post content...';
  ErrorTitleContent = 'Enter post title...';

  constructor(private postService: PostService) {}

  onSavePost(form: NgForm) {
    this.postService
      .addPost(form.value.enterTitle, form.value.enterContent)
      .subscribe((res) => {
        console.log(res);
        console.log(res.body);
        form.reset();
      });
  }
}
