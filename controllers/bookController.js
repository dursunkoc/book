var bookController = function(Book) {
    var createBook = function(req, res) {
        console.log("CREATE Incoming request body: " + JSON.stringify(req.body));
        var book = new Book(req.body)
        book.save();
        res.status(201).json(book);
    };

    var getAll = function(req, res) {
            Book.find(function(err, books) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.status(200).json(books);
                }
            });
        };

    var publicApi = {
    	createBook : createBook,
    	getAll : getAll
    }

    return publicApi;
};
return bookController;