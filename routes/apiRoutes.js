const { response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

//Backend running
router.get("/", (req, res) => {
  res.send("Backend running!");
});

//get jobs for user
router.get("/job-apps/", (req, res) => {
  console.log(req.userId)
  db.job_track.findAll({
    where: {
      user_id: req.userId
    },
    
  })

    .then((response) => res.send(response))
    .catch((error) => console.log(error))
})


//add jobs for user
router.post("/job-apps", (req, res) => {

  // 
  // if(!req.userId) {
  //   res.status.send("this can be a string of what we want to communcatee")
  // }
  db.job_track.create({
    user_id: req.userId,
    company_name: req.body.company_name,
    job_title: req.body.job_title,
    date_applied: req.body.date_applied,
    city: req.body.city,
    company_responded: "false",
    is_deleted: "false"
  })
    .then((results) => res.send(results))
    .catch((err) => console.log(err));

});

//change employer response
router.put("/employer-response/:id", (req, res) => {
  db.job_track
    .update( 
       {
      company_responded: Sequelize.literal('NOT company_responded')
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    .then((results) => res.send(results))
    .catch((err) => alert(err));
});

//edit posted job

router.put("/edit-job/:id", (req, res) => {
  
  db.job_track.update(
  {
    company_name: req.body.company_name,
    job_title: req.body.job_title,
    date_applied: req.body.date_applied,
    city: req.body.city
  },
  {
    where: {
      id: req.params.id
    }
  })

  .then((results) => res.send(results))
  .catch((err) => console.log(err));
});


//delete job 
router.put("/job-apps/:id", (req, res) => {
  
    db.job_track.update(
    {
      is_deleted: Sequelize.literal('NOT is_deleted')
    },
    {
      where: {
        id: req.params.id
      }
    })

    .then((results) => res.send(results))
    .catch((err) => console.log(err));
});




module.exports = router;

