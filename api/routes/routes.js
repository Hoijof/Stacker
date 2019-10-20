
const ObjectId = require('mongodb').ObjectID;

const error = (res) => {
  res.status(500);
}

const appRouter = function (app) {
    app.get("/", function(req, res) {
      const collection = req.app.locals.stacker;

      collection.find({}).toArray().then(response => res.status(200).json(response)).catch(error => error(res));
    });

    app.get('/:uuid', (req, res) => {
      const uuid = req.params.uuid; 
      const collection = req.app.locals.stacker;

      collection.findOne({ uuid: uuid }).then(response => res.status(200).json(response)).catch(error => error(res));
    });

    app.post('/:uuid', function(req, res) {
        const collection = req.app.locals.stacker;
        const uuid = req.params.uuid; 
        const data = req.body;

        collection.findOne({ uuid })
        .then(response => {
          if (response !== null) {
            collection.updateOne({uuid}, {$set: data}).then(response => res.status(200).json(response)).catch(error => error(res));
          } else {
            collection.insertOne({uuid, ...data}).then(response => res.status(200).json(response)).catch(error => error(res));
          }
        }).catch(error => error(res));
    });
  }
  
  module.exports = appRouter;