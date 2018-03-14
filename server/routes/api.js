var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:" + process.env.DB_PORT + "/" + process.env.DB_PROJECT_NAME;
var httpRequest = require('http');
var request = require('request');
var parser = require('xml2js').parseString;
var fs = require('fs');
var moment = require('moment');

const buildEmail = require('../email/email')

/* api/apartments endpoint returns list of apartments */
router.get('/apartments', (req, res, next) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("apartments").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/apartments/:apartmentName enpoint returns apartment data depending on id passed */
router.get('/apartments/:apartmentName/:language', (req, res, next) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("apartment_details").find({apartmentShortName: req.params.apartmentName,language: req.params.language}).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/flags endpoint returns list of languages */
router.get('/flags', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("flags").find({}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/landingcontent/:language endpoint returns landing content depending on language passed */
router.get('/landingcontent/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("landing_page_content").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/aboutcontent/:language endpoint returns about us content depending on language passed */
router.get('/aboutcontent/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("about_us_content").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/contactcontent/:language endpoint returns contact us content depending on language passed */
router.get('/contactcontent/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("contact_us_content").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/crofacts/:language endpoint returns Croatia facts content depending on language passed */
router.get('/crofacts/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("croatia_facts_content").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/dufacts/:language endpoint returns Dubrovnik facts content depending on language passed */
router.get('/dufacts/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("dubrovnik_facts_content").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/policy/:language endpoint returns Policy content depending on language passed */
router.get('/policy/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("policy_content").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/surroundings/:language endpoint returns Surroundings content depending on language passed */
router.get('/surroundings/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("surroundings_content").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/contactform - contact form handler */
router.post('/contactform', (req, res, next) => {
   var formData = req.body;

   var inquiry = '';


   if(!formData.bookingStart && !formData.bookingEnd) {
     inquiry = '<p>General Inquiry</p>';
   }else {
     inquiry = '<p>Inquiry for: ' + formData.apartment + '</p>' + '<p>Desired period: '+  moment(formData.bookingStart).format('DD-MM-YYYY') + ' to ' + moment(formData.bookingEnd).format('DD-MM-YYYY') +'</p>'
   }

   var buildTemplate = {
       from: formData.email,
       to: 'raperscurse@msn.com',
       subject: formData.subject,
       html: '<p>Name: ' + formData.contactName + '</p>' + '<p>Message: ' + formData.message +'</p>' + inquiry
   }

   var responseMessage = {
       header: "",
       message: ""
   }
    if (!formData) {
        res.status(400);
        responseMessage.header = "error 400";
        responseMessage.message = "Oops Bad DATA"
        res.json(responseMessage);
    }else {
       buildEmail.sendEmail(buildTemplate);
       console.log('-----------------------------------------');
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            db.collection("contact_form_data").save(formData, (err, formData) => {
                if(err) {
                    res.send(err);
                    console.log('oops something bad happened: ', err);
                }
                res.status(200);
                responseMessage.header = "Thank you for contacting us.";
                responseMessage.message = "We have received your enquiry and will respond to you within 24 hours.";
                res.json(responseMessage);
            console.log('form data saved in DB');
            });
        });
    }
});

/* api/markers endpoint returns markers used to populate google map used in location */
router.get('/markers/', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("location_markers").find({}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/cards/:language endpoint returns list of cards depending on language passed */
router.get('/cards/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("about_us_cards").find({flag: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/nearbys/:apartment endpoint returns list of nearby places depending on apartment passed in ascending order*/
router.get('/nearbys/:apartment', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("nearby_places").find({apartmentName: req.params.apartment}).sort({distance: 1}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

router.get('/pricelist/:apartment', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("apartment_pricelist").find({apartmentShortName: req.params.apartment}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/cromoney/:language endpoint returns Cro Money content depending on language passed */
router.get('/cromoney/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("cro_facts_money").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/werecommend/:language endpoint returns We Recommend content depending on language passed */
router.get('/werecommend/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("du_facts_we_recommend").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/busiestmonths/:language endpoint returns Busiest Months content depending on language passed */
router.get('/busiestmonths/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("du_facts_busiest_months").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});


/* api/gallery/:language endpoint returns images depending on apartment passed */
router.get('/gallery/:apartment', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
    if (err) throw err;
        db.collection("apartment_images_collection").find({apartmentShortName: req.params.apartment}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

router.get('/interestingFacts/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("du_facts_interesting").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

router.get('/dufactsuseful/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("du_facts_useful").find({language: req.params.language}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

router.get('/thingstodo/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("things_to_do").find({ $and: [{visible : {$eq: true}}], language: {$eq: req.params.language}}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/thingstodo/:activity/:language endpoint returns one activity */
router.get('/thingstodo/:activity/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("things_to_do").find({ $and: [{visible : {$eq: true}}], language: {$eq: req.params.language}, shortName: {$eq: req.params.activity}}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});


/* api/ttd-side/:activity/:language endpoint returns  side content of one activity */
router.get('/ttd-side/:activity/:language', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("things_to_do_sideTable").find({ $and: [{language: {$eq: req.params.language}}], shortName: {$eq: req.params.activity}}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

/* api/activitybanner/:activity endpoint returns banner image */
router.get('/activitybanner/:activity', (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        db.collection("activity_banner_image").find({shortName: req.params.activity}).toArray( (err, result) => {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

router.get('/courselist', (req, res, next) => {
    var fileName = 'course-list.xml';
    fs.stat(fileName, (err, stat) => {
        if(err == null) {
            var createdDate = moment(stat.birthtime).format("MMM Do YY");
            var today = moment().format("MMM Do YY");
            if (today === createdDate){
                fs.readFile(fileName,'utf8',(err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    var parsedBody;
                    var doneParsing = false;
                    parser(data, (err, result) => {
                        parsedBody = result;
                    doneParsing = true;
                    });
                    if (doneParsing === true) {
                        data = parsedBody;
                    }
                    res.json(data);
                });
            }else {
                fs.unlink(fileName, () => {
                    console.log('Old file removed!');
                    console.log('Trying to retrieve new one!');
                    var stream = request("http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml")
                        .pipe(fs.createWriteStream(fileName));
                    stream.on('finish', () => {
                        console.log('Stream finished!');
                        fs.readFile(fileName,'utf8',(err, data) => {
                            if (err) {
                                return console.log(err);
                            }
                            var parsedBody;
                            var doneParsing = false;
                            parser(data, (err, result) => {
                                parsedBody = result;
                                doneParsing = true;
                            });
                            if (doneParsing === true) {
                                data = parsedBody;
                            }
                            console.log('New file created!');
                            res.json(data);
                        });
                    });
                })
            }
        } else if(err.code == 'ENOENT') {
            var stream = request("http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml")
                .pipe(fs.createWriteStream(fileName));
            stream.on('finish', () => {
                fs.readFile(fileName,'utf8',(err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    var parsedBody;
                var doneParsing = false;
                parser(data, (err, result) => {
                    parsedBody = result;
                    doneParsing = true;
                });
                if (doneParsing === true) {
                    data = parsedBody;
                }
                res.json(data);
            });
            });
        } else {
            console.log('Some other error: ', err.code);
        }
    });

});

module.exports = router;
