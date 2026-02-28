import express from "express";
import {
    createProfile,
    addExperience,
    addEducation,
    addCertification,
    getFullProfile,
    editProfile,
    editExperience,
    editEducation,
    editCertification,
    deleteProfile,
    deleteExperience,
    deleteEducation,
    deleteCertification
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/create/:profileID", createProfile); // create a profile

router.post("/add-experience/:profileID", addExperience); // add experience to a profile

router.post("/add-education/:profileID", addEducation); // add education to a profile

router.post("/add-certification/:profileID", addCertification); // add certification to a profile

router.get("/full-profile/:profileID", getFullProfile); // get full profile details

router.put("/edit-profile/:profileID", editProfile); // edit profile details

router.put("/edit-experience/:profileID/:experienceID", editExperience); // edit experience details

router.put("/edit-education/:profileID/:educationID", editEducation); // edit education details

router.put("/edit-certification/:profileID/:certificationID", editCertification); // edit certification details

router.delete("/delete-profile/:profileID", deleteProfile); // delete a profile

router.delete("/delete-experience/:profileID/:experienceID", deleteExperience); // delete an experience from a profile

router.delete("/delete-education/:profileID/:educationID", deleteEducation); // delete an education from a profile

router.delete("/delete-certification/:profileID/:certificationID", deleteCertification); // delete a certification from a profile

export default router;