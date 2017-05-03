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
  return gallery.update({
    author: editInfo.author,
    link: editInfo.link,
    description: editInfo.description
  },{
    where: {
      id: editId
    }
  }); // Might need to add more to function

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