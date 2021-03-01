import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  post = {} as Post;
  id: any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private angularFireStore: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getPostById(this.id);
  }

  async getPostById(id: string) {
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();
    this.angularFireStore
      .doc("posts/" + id)
      .valueChanges()
      .subscribe(data => {
        this.post.title = data["title"];
        this.post.details = data["details"];
      });
    (await loader).dismiss();
  }

  async updatePost(post: Post) {
    if (this.formValidation) {
      let loader = this.loadingCtrl.create({
        message: "Please wait..."
      });
      (await loader).present();
      try {
        await this.angularFireStore.doc("posts/" + this.id).update(post);
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
