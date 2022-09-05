import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPost } from 'src/app/Models/post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'Career Update', content: 'Last day at Sapphire' },
  //   { title: 'New Begining', content: 'Joining at Cognizant' },
  //   { title: 'Traveller', content: 'I\'m a Traveller' },
  // ];
  posts: IPost[] = [];
  subscription!: Subscription;
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.LoadUpdatedData();

    this.subscription = this.postService
      .getPostUpdateListener()
      .subscribe((posts: IPost[]) => {
        this.posts = posts;
      });
  }

  LoadUpdatedData() {
    this.postService.getPost().subscribe((posts) => {
      this.posts = posts;
    });
  }

  onEdit(id: any) {}

  onDelete(post: IPost) {
    this.postService.addDelete(post.id).subscribe(() => {
      this.LoadUpdatedData();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
