var express = require('express');
var Book = require('../models/bookModel');

module.exports = function() {
    var router = express.Router();

    router.use('/', function(req, res, next) {
        console.log("Received a bulk operation");
        next();
    });

    router.route('/')
        .get(function(req, res) {
            Book.find(function(err, books) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).json(books);
                }
            });
        })
        .post(function(req, res) {
            console.log("CREATE Incoming request body: " + JSON.stringify(req.body));
            var book = new Book(req.body)
            book.save();
            res.status(201).json(book);
        });


    router.use('/os/:bookId', function(req, res, next) {
        var query = {};
        console.log("Incoming request params: " + JSON.stringify(req.params));
        if (req.params.bookId) {
            query._id = req.params.bookId;
        }
        Book.findById(query._id, function(err, book) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else if (book) {
                req.book = book;
                next();
            } else {
                res.status(200).json({
                    result: "NONE"
                });
            }
        });
    });

    router.route('/os/:bookId')
        .get(function(req, res) {
            console.log("Found and returning the book.");
            res.status(200).json(req.book);
        })
        .put(function(req, res) {
            console.log("UPDATE the book");
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;
            req.book.save();
            res.status(200).json(req.book);
        })
        .delete(function(req, res) {
            console.log("DELETE the book ");
            req.book.remove();
            res.status(202).json(req.book);
        });

    router.route('ns/:bookId')
        .get(function(req, res) {
            console.log("Found and returning the book.");
            res.status(200).json(req.book);
        })
        .put(function(req, res) {
            Book.update({
                _id: req.params.bookId
            }, req.body, function(err, book) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).json(book);
                }
            })
        })
        .delete(function(req, res) {
            console.log("DELETE Incoming request params: " + JSON.stringify(req.params));
            if (req.params.bookId) {
                Book.remove({
                    _id: req.params.bookId
                }, function(err, book) {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    } else {
                        res.status(200).json({
                            result: "DELETED " + book
                        });
                    }
                })
            }
        });
    return router;
}