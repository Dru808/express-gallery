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
        console.log(photos);
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
    const photoId = req.params.id;
    editPhoto(photoInfo, photoId)
      .then(returnedPic => {
        console.log('picresult ', returnedPic);

      })
      .catch(error => {
        console.log(error);
      });
    res.send('put works');
  })
  .delete((req, res) => {
    res.send('delete works');
  });

galleryRouter.route('/:id/edit')
  .get((req, res) => {
    res.send('get edit works');
  });







module.exports = galleryRouter;