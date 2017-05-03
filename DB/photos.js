/*jshint esversion: 6*/
const express = require('express');
const router = express.Router();
const db = require('./connection');
const gallery = require('../models').Picture;


const addPhoto = (item) => {
console.log(item);
return gallery.create(item);
};

const getPhotoById = (photoId) => {

  return gallery.findById(photoId);
};

const editPhoto = (editInfo, editId) => {
  return update(editInfo); // Might need to add more to function

};

const removePhoto = (removeInfo) => {
  return gallery.destroy({
    where: {
      id: removeInfo
    }
  });
};
const getAllPhotos = () => {
  allPhotos = gallery.findAll();
  return allPhotos;
};

module.exports = {
  addPhoto,
  editPhoto,
  removePhoto,
  getAllPhotos,
  getPhotoById
};