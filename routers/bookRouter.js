var express = require('express');
var Book = require('../models/bookModel');
var bookController = require('../controllers/bookController');

module.exports = function() {
    var router = express.Router();

    router.use('/', function(req, res, next) {
        console.log("Received a bulk operation");
        next();
    });
    var bookControllerInAction = bookController(Book);
    router.route('/')
        .get(bookControllerInAction.getAll)
        .post(bookControllerInAction.createBook);


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

    var dbCallback = function(res) {
        return function(err, saved) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(saved);
            }
        }
    }


    router.route('/os/:bookId')
        .get(function(req, res) {
            console.log("Found and returning the book.");
            res.status(200).json(req.book);
        })
        .put(function(req, res) {
            console.log("Update the book");
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.read = req.body.read;
            req.book.save(dbCallback(res));
        })
        .patch(function(req, res) {
            console.log("Patching the book");
            for (var i in req.body) {
                req.book[i] = req.body[i];
            }
            req.book.save(dbCallback(res));
        })
        .delete(function(req, res) {
            console.log("DELETE the book ");
            req.book.remove(dbCallback(res));
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