import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  post = {} as Post;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private angularFireStore: AngularFirestore
  ) { }

  ngOnInit() {
  }

  async createPost(post: Post) {
    if (this.formValidation()) {
      let loader = this.loadingCtrl.create({
        message: "Please wait..."
      });
      (await loader).present();
      try {
        await this.angularFireStore.collection("posts").add(post);
      } catch (e) {
        this.showToast(e);
      }
      (await loader).dismiss();
      this.navCtrl.navigateRoot("home");
    }
  }

  formValidation() {
    if (!this.post.title) {
      this.showToast("Enter Title");
      return false;
    }
    if (!this.post.details) {
      this.showToast("Enter Details");
      return false;
    }
    return true;
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    })
      .then(toastData => toastData.present());
  }
}
