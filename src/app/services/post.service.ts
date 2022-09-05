import {
  HttpClient,
  HttpEventType,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Subject, tap, throwError } from 'rxjs';
import { IPost } from '../Models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private httpclient: HttpClient) {}

  private Posts: IPost[] = [];
  private ExposeModifiedPost = new Subject<IPost[]>();
  private connectionString: string =
    'https://admin-svmit-college-default-rtdb.firebaseio.com/posts.json';

  getPost() {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('print', 'HP-24');
    queryParams = queryParams.append('author', 'Lin-5');

    const posts: IPost[] = [];

    return this.httpclient
      .get(this.connectionString, {
        headers: { 'Custom-Header': 'Try Header' },
        params: queryParams,
      })
      .pipe(
        map((res: any) => {
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              posts.push({ ...res[key], id: key });
            }
          }
          this.Posts = posts;
          return posts;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  addPost(title: string, content: string) {
    const post: IPost = { title: title, content: content };
    this.Posts.push(post);
    this.ExposeModifiedPost.next([...this.Posts]);
    return this.httpclient.post(this.connectionString, post, {
      observe: 'response',
    });
  }

  addDelete(id: any) {
    var index = this.Posts.findIndex((e) => e.id == id);
    this.Posts.splice(index, 1);
    this.ExposeModifiedPost.next([...this.Posts]);
    return this.httpclient
      .delete(
        // 'https://admin-svmit-college-default-rtdb.firebaseio.com/posts/' +
        //   id +
        //   '.json',
        // id
        'https://admin-svmit-college-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events',
        }
      )
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type == HttpEventType.Sent) {
            console.log('sent');
          }
          if (event.type == HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }

  getPostUpdateListener() {
    return this.ExposeModifiedPost.asObservable();
  }
}
