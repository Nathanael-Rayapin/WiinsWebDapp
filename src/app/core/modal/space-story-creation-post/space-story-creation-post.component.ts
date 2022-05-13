import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { SpaceStoryCreatePostAnimation } from '../../../../assets/animation/on-create-post-animation';
import { linearBgPost } from '../../data/linear-background-post-list';
import {
  BackgroundPostModel,
  PicturePublicationModel,
  PostPublicationModel,
  VideoPublicationModel
} from '../../model/publication/feed-publication.model';
import { FeedPublicationMakerService } from '../../service/creation/feed-publication-maker/feed-publication-maker.service';
import { SnackBarService } from '../../service/snackbar/snackbar.service';
import { RootStoreState } from '../../store';

@Component({
  selector: 'app-space-story-creation-post',
  templateUrl: './space-story-creation-post.component.html',
  styleUrls: ['./space-story-creation-post.component.scss'],
  animations: [SpaceStoryCreatePostAnimation],
})
export class SpaceStoryCreationPostComponent implements OnInit {
  // Type Posts
  feedPublicationCreate:
    | PicturePublicationModel
    | PostPublicationModel
    | VideoPublicationModel;

  visualMode = 'default'; // Picture/ Video / Post
  backgroundPostList: BackgroundPostModel[] = linearBgPost;
  bgSelected: BackgroundPostModel = linearBgPost[0];

  // Comment & Hahstags
  commentInputValue = '';
  commenInputError = false;
  hashtagsListsValues: string[] = [];

  // Picture & File
  selectedImageFile: File;
  selectedImage: string;
  files: File[] = [];
  imgPreview: string | ArrayBuffer;

  constructor(
    private snackbarService: SnackBarService,
    private store$: Store<RootStoreState.State>,
    public feedPublicationMakerService: FeedPublicationMakerService
  ) {}

  ngOnInit(): void {}

  // Select Type of Publication depending of the value
  onSelectPublicationType(value: string): void {
    this.visualMode = value;
  }

  // Change the color choice of the Background for Written Post
  onChangebackground(value: BackgroundPostModel): void {
    this.bgSelected = value;
  }

  // Build the Publication
  publicationMaker():
    | PicturePublicationModel
    | PostPublicationModel
    | VideoPublicationModel
    | any {
    switch (this.visualMode) {
      case 'picture': {
        const title = this.commentInputValue;
        const hashtags = this.hashtagsListsValues;
        const imgUrl = this.selectedImage;
        return new PicturePublicationModel(title, hashtags, imgUrl);
      }
      case 'post': {
        const title = this.commentInputValue;
        const hashtags = this.hashtagsListsValues;
        const background = new BackgroundPostModel(['red', 'green'], {
          start: [0, 0],
          end: [1, 1],
        });
        return new PostPublicationModel(title, hashtags, background);
      }
      case 'video': {
        return;
      }
    }
  }

  // Submit Data for Create new Post (Simple test with gross value before i get access to Real Data)
  onSubmit(commentInput: NgModel, hashtagInput: NgModel): void {
    // Retrieve and Assign Values
    this.commentInputValue = commentInput.value;
    this.hashtagsListsValues = hashtagInput.value;

    // Check the Errors
    if (!this.commentIsValid()) {
      this.snackbarService.openSnackBar('Comment field is invalid');
    }

    if (!this.publicationMaker()) {
      this.snackbarService.openSnackBar('An error has occurred, Try again');
      return;
    }

    // Build the publication
    const myNewFb = this.publicationMaker();

    // this.store$.dispatch(new FeedPublicationStoreActions.AddFeedPublication(myNewFb));

    // this.dialog.close();
  }

  // Check The Errors
  commentIsValid(): boolean {
    if (this.commentInputValue.trim().length < 4) {
      this.commenInputError = true;
      return false;
    } else {
      this.commenInputError = false;
      return true;
    }
  }

  // If user want to add some hashtags
  hashtagsIsValid(hashtagInput: NgModel): void {
    if (hashtagInput.value.length < 4) {
      return;
    }
    this.hashtagsListsValues.push(hashtagInput.value);
  }

  resetPublication(): void {
    this.visualMode = 'default';
  }

  onSendText(event: any): void {
    alert(event);
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    this.files.push(...event.addedFiles);
    const reader = new FileReader();
    reader.readAsDataURL(event.addedFiles[0]);
    reader.onload = (_event) => {
      this.imgPreview = reader.result;
    };
  }

  undoPicturePreview(): void {
    this.imgPreview = null!;
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
