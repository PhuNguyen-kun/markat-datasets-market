//const Course = require('../models/Course');
//const {mongoosesToObject} = require('../../util/mongoose.js');

function SitesController() {
    // [GET] /
    this.index = (req, res, next) => {
        res.send('Hello World');
    };
    //console.log("hieudz");
    // [GET] /search
    // this.search = (req, res) => res.render('search');
}

module.exports = new SitesController();
