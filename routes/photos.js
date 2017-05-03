/*jshint esversion: 6*/

const express = require('express');
const galleryRouter = express.Router();
const bodyParser = require('body-parser');
const {addPhoto, editPhoto, removePhoto, getAllPhotos, getPhotoById} = require('../DB/photos.js');


// route "/gallery"
galleryRouter.route('/')
  .get((req, res) => {
    getAllPhotos()
      .then((allPhotos) => {
        let photos = allPhotos.map(item =>{
          return item.dataValues;
        });
        res.render('home', {photos: photos});
      })
      .catch(error=> {
        console.log(error);
      });
  })
  .post((req, res) => {
    const photoInfo = req.body;
    addPhoto(photoInfo)
      .then(photos => {
        res.redirect('/gallery');
      })
      .catch(error => {
        console.log(error);
      });
  });

galleryRouter.route('/:id')

  .get((req, res) => {
    console.log('get/id is hitting');
    if(req.params.id === 'new') {
      res.render('gallery/new');
      return;
    }
    let photoId = req.params.id;
    getPhotoById(photoId)
      .then(photoResult =>{
        let reqPhoto = photoResult.dataValues;
        console.log(reqPhoto);
        console.log('reqPhotos ', reqPhoto);
        res.render('gallery/photo_id', reqPhoto);
      })
      .catch(error => {
        console.log(error);
      });
  })
  .put((req, res) => {
    console.log('is this hitting PUT?');
    const photoId = req.params.id;
    const photoInfo = req.body;
    editPhoto(photoInfo, photoId)
      .then(returnedPic => {

        res.render('gallery/edit', returnedPic);

      })
      .catch(error => {
        console.log(error);
      });
  })
  .delete((req, res) => {
    console.log('is it hitting?');
    removePhoto(req.params.id)
    .then(anything => {
      res.redirect('/gallery');
    })
    .catch(error => {
      console.log(error);
    });
  });

galleryRouter.route('/:id/edit')
  .get((req, res) => {
    getPhotoById(req.params.id)
    .then(photoResult => {
      let photoCleanUp = photoResult.dataValues;
      console.log('photoResult ', photoCleanUp);
      res.render('gallery/edit', photoCleanUp);
    })
    .catch(error => {
      console.log(error);
    });
  });







module.exports = galleryRouter;